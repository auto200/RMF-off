import axios, { AxiosError } from "axios";
import dotenv from "dotenv";
import { decode } from "ent";
import express from "express";
import path from "path";
import { Server, Socket } from "socket.io";
import { sleep } from "./utils";
import {
  FETCH_CURRENTLY_PLAYING_SONGS_INTERVAL,
  RMFON_ENDPOINTS,
  SOCKET_EVENTS,
} from "./utils/constants";
import {
  RadioIdToPlayingSongMap,
  Station,
  StationBase,
} from "./utils/interfaces";
dotenv.config();

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
  socket.emit(SOCKET_EVENTS.INITIAL_STATIONS_DATA, stations);
});

(async function main() {
  try {
    console.log("getting base stations info");
    const stationsBase = await getStationsBase();
    //main loop
    while (true) {
      console.log("getting new data");
      try {
        const playingSongs = await getPlayingSongs();
        const newStations = combineStationsBaseAndSongs(
          stationsBase,
          playingSongs
        );

        const stationsToUpdate = getStationsToUpdate(newStations, stations);
        io.emit(SOCKET_EVENTS.STATIONS_UPDATE, stationsToUpdate);
        stations = newStations;
      } catch (err) {
        console.log(
          (err as AxiosError).response || (err as AxiosError).message
        );
      }
      await sleep(FETCH_CURRENTLY_PLAYING_SONGS_INTERVAL);
    }
  } catch (err) {
    console.log(JSON.stringify(err));
    console.log(
      "Application failed to fetch initial data, no progress will be made"
    );
    io.emit(
      SOCKET_EVENTS.FATAL_ERROR,
      "Fatal server error, please contact application administrator"
    );
  }
})();

async function getStationsBase(): Promise<StationBase[]> {
  const {
    data: { stations },
  } = await axios.get<{
    stations: {
      id: number;
      name: string;
      mp3: string;
      defaultart: string;
    }[];
  }>(RMFON_ENDPOINTS.STATIONS_BASE);

  return stations.map((station) => ({
    id: station.id,
    name: station.name,
    streamURL: station.mp3,
    cover: station.defaultart,
  }));
}

async function getPlayingSongs() {
  const { data } = await axios.get<RadioIdToPlayingSongMap>(
    RMFON_ENDPOINTS.CURRENTLY_PLAYING
  );
  delete data.generate;
  delete data.timestamp;
  return data;
}

function combineStationsBaseAndSongs(
  stationsBase: StationBase[],
  playingSongs: RadioIdToPlayingSongMap
): Station[] {
  return stationsBase.map(({ id, cover, ...rest }) => {
    const radioId = `radio${id}`;
    return {
      id,
      cover,
      ...rest,
      song: {
        name: decode(playingSongs[radioId].utwor || "Wiadomości/Przerwa"),
        artist: decode(playingSongs[radioId].name || ""),
        cover:
          playingSongs[radioId].coverBigUrl ||
          playingSongs[radioId].artist ||
          playingSongs[radioId].cover ||
          cover,
      },
    };
  });
}

function getStationsToUpdate(
  newStationsData: Station[],
  oldStations: Station[]
) {
  return newStationsData.filter((newStationData) => {
    const oldStationData = oldStations.find(
      (oldStation) => oldStation.id === newStationData.id
    );
    const songChanged = oldStationData?.song.name !== newStationData.song.name;
    return songChanged;
  });
}
