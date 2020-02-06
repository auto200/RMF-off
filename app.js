const axios = require("axios");
const app = require("express")();
const cors = require("cors");
const decode = require("ent/decode");
const socketIO = require("socket.io");

let tails = [];

app.use(cors());

const server = app.listen(3000, () => {
  console.log("listening on port 3000");
});

const io = socketIO(server);

io.on("connect", socket => {
  socket.emit("initialData", tails);
});
const sleep = async time => {
  return new Promise(resolve => {
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
    console.log("startup completed");
    while (true) {
      await sleep(15000);
      console.log("getting new data");
      try {
        const recientData = await getRecentData(initialStationInfo);

        const newData = recientData.filter(newStation => {
          const oldData = tails.find(
            oldStation => oldStation.id === newStation.id
          );
          return oldData.songName !== newStation.songName;
        });

        io.emit("dataUpdate", newData);
        tails = recientData;
      } catch (err) {}
    }
  } catch (err) {}
})();

async function getInitialStationInfo() {
  const {
    data: { stations }
  } = await axios.get("http://rmfon.pl/json/app.txt");
  const info = stations.map(station => ({
    id: station.id + "",
    stationName: station.name,
    streamURL: station.mp3,
    defaultCover: station.defaultart
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
    cover: data[`radio${id}`].coverBigUrl
  }));
}
