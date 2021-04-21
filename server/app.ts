import dotenv from "dotenv";
dotenv.config();
import path from "path";
import axios from "axios";
import express from "express";
import { decode } from "ent";
import { Server, Socket } from "socket.io";
import { sleep } from "./utils";
import {
  StationBaseInfo,
  PlayingStationsInfo,
  Station,
} from "./utils/interfaces";
import { ENDPOINTS, FETCH_INTERVAL } from "./utils/constants";

const app = express();
app.use(express.static(path.join(__dirname, "public")));

const IS_DEV = process.env.ENV === "DEV";

const server = app.listen(IS_DEV ? 5000 : null, () => {
  console.log(`listening ${IS_DEV ? "on port 5000" : ""}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let stations: Station[] = [];

io.on("connect", (socket: Socket) => {
  console.log("new connection");
  socket.emit("INITIAL_DATA", stations);
});

(async function main() {
  try {
    console.log("getting base stations info");
    const stationBaseInfo = await getStationsBaseInfo();
    //main loop
    while (true) {
      console.log("getting new data");
      try {
        const playingStationInfo = await getPlayingStationsInfo();
        const newStationsData = combineBaseAndPlayingStationsInfo(
          stationBaseInfo,
          playingStationInfo
        );

        const changedStations = newStationsData.filter((newStationData) => {
          const oldStationData = stations.find(
            (oldStation) => oldStation.id === newStationData.id
          );
          const songChanged =
            oldStationData?.song.name !== newStationData.song.name;
          return songChanged;
        });

        io.emit("DATA_UPDATE", changedStations);
        stations = newStationsData;
      } catch (err) {
        console.log(err.response || err.message);
      }
      await sleep(FETCH_INTERVAL);
    }
  } catch (err) {
    console.log(JSON.stringify(err));
    console.log(
      "Application failed to fetch initial data, no progress will be made"
    );
    io.emit(
      "ERROR",
      "Wystąpił błąd po stronie serwera, skontaktuj się z administratorem strony"
    );
  }
})();

async function getStationsBaseInfo(): Promise<StationBaseInfo[]> {
  const {
    data: { stations },
  } = await axios.get<{
    stations: {
      id: number;
      name: string;
      mp3: string;
      defaultart: string;
    }[];
  }>(ENDPOINTS.BASE_STATION_INFO);

  return stations.map((station) => ({
    id: station.id,
    name: station.name,
    streamURL: station.mp3,
    cover: station.defaultart,
  }));
}

async function getPlayingStationsInfo() {
  const { data } = await axios.get<PlayingStationsInfo>(ENDPOINTS.PLAYING_INFO);
  delete data.generate;
  return data;
}

function combineBaseAndPlayingStationsInfo(
  baseStationInfo: StationBaseInfo[],
  playingStationInfo: PlayingStationsInfo
): Station[] {
  return baseStationInfo.map(({ id, cover: stationCover, ...rest }) => ({
    id,
    ...rest,
    song: {
      name: decode(
        playingStationInfo[`radio${id}`].utwor || "Wiadomości/Przerwa"
      ),
      artist: decode(playingStationInfo[`radio${id}`].name || ""),
      cover:
        playingStationInfo[`radio${id}`].coverBigUrl ||
        playingStationInfo[`radio${id}`].artist ||
        playingStationInfo[`radio${id}`].cover ||
        stationCover,
    },
  }));
}
