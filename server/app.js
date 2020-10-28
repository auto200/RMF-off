require("dotenv").config();
const path = require("path");
const axios = require("axios");
const express = require("express");
const decode = require("ent/decode");
const socketIO = require("socket.io");

const app = express();
app.use(express.static(path.join(__dirname, "public")));

let tails = [];

let server = null;
if ((process.env.ENV = "DEV")) {
  server = app.listen(5000, () => {
    console.log("listening on port 5000");
  });
} else {
  server = app.listen(() => {
    console.log("listening");
  });
}

const io = socketIO(server);

io.on("connect", (socket) => {
  socket.emit("initialData", tails);
});
const sleep = async (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

(async function main() {
  let initialStationInfo = [];
  try {
    console.log("getting initial station infos");
    initialStationInfo = await getInitialStationInfo();
    tails = await getRecentData(initialStationInfo);
    console.log(tails);
    console.log("startup completed");
    while (true) {
      await sleep(15000);
      console.log("getting new data");
      try {
        const recientData = await getRecentData(initialStationInfo);

        const newData = recientData.filter((newStation) => {
          const oldData = tails.find(
            (oldStation) => oldStation.id === newStation.id
          );
          return oldData.songName !== newStation.songName;
        });

        io.emit("dataUpdate", newData);
        tails = recientData;
      } catch (err) {}
    }
  } catch (err) {
    console.log(JSON.stringify(err));
    console.log(
      "Application failed to fetch initial data, no progress will be made"
    );
    io.emit(
      "error",
      "Wystąpił błąd po stronie serwera, skontaktuj się z administratorem strony"
    );
  }
})();

async function getInitialStationInfo() {
  const {
    data: { stations },
  } = await axios.get("http://rmfon.pl/json/app.txt");
  const info = stations.map((station) => ({
    id: station.id + "",
    stationName: station.name,
    streamURL: station.mp3,
    defaultCover: station.defaultart,
  }));
  return info;
}

async function getRecentData(initialStationInfo) {
  const { data } = await axios.get(
    "https://www.rmfon.pl/stacje/ajax_playing_main.txt"
  );
  delete data.generate;
  return initialStationInfo.map(({ id, ...rest }) => ({
    id,
    ...rest,
    artist: decode(data[`radio${id}`].name),
    songName: decode(data[`radio${id}`].utwor),
    cover: data[`radio${id}`].coverBigUrl,
  }));
}
