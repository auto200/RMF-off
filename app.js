const axios = require("axios");
const getUrls = require("get-urls");
const express = require("express");
const decode = require("ent/decode");
const cors = require("cors");

const app = express();
let tails = {};

app.use(cors());

const allStationsLink = "https://www.rmfon.pl/stacje/ajax_playing_main.txt";

app.get("/", (req, res) => {
  res.send(Object.values(tails));
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});

const main = async () => {
  let stationNames = {};
  let streams = {};
  try {
    console.log("getting station names");
    stationNames = await getStationNames();
    console.log("getting and validating stream sources");
    streams = await getValidStreamUrls(Object.keys(stationNames));
    Object.keys(streams).forEach(key => {
      if (!Object.keys(stationNames).includes(key)) {
        console.log("stream id doesnt match stationName id");
        delete streams[key];
        return;
      }
      if (!Object.keys(streams).includes(key)) {
        console.log("stationName id doesnt match stram id");
        delete stationNames[key];
        return;
      }
      tails[key] = {
        id: key,
        stationName: decode(stationNames[key]),
        streamURL: streams[key]
      };
    });
    console.log(Object.keys(stationNames).length, Object.keys(streams).length);
    console.log("startup completed");
  } catch (err) {}

  const getRecentDataLoop = async () => {
    console.log("getting new data about songs");
    try {
      const { data } = await axios.get(allStationsLink);
      delete data.generate;
      const dataArray = Object.entries(data);
      dataArray.forEach(radio => {
        const id = radio[0].slice(5);
        if (!tails[id]) return;
        const obj = {
          artist: decode(radio[1].name),
          songName: decode(radio[1].utwor),
          cover: radio[1].coverBigUrl
        };
        tails[id] = { ...tails[id], ...obj };
      });
    } catch (err) {}
    setTimeout(() => {
      getRecentDataLoop();
    }, 15000);
  };
  getRecentDataLoop();
};
main();

function getStationNames() {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get(
        "https://www.rmfon.pl/json/stations.txt"
      );
      const stations = {};
      data.forEach(station => {
        stations[station.id] = station.name;
      });
      resolve(stations);
    } catch (err) {
      reject();
    }
  });
}

async function getValidStreamUrls(ids) {
  return new Promise(async resolve => {
    const allUrls = {};
    await axios.all(
      ids.map(async id => {
        try {
          const { data } = await axios.get(
            `http://rmfon.pl/stacje/flash_aac_${id}.xml.txt`
          );
          const urls = [...getUrls(data)];
          const url = urls[0].replace("%3C/item%3E", "");
          allUrls[id] = url;
        } catch (err) {
          console.log(`failed to fetch url of station source id: ${id}`);
        }
      })
    );

    await axios.all(
      Object.entries(allUrls).map(async station => {
        try {
          await axios({
            method: "get",
            url: station[1],
            responseType: "stream",
            timeout: 5000
          });
        } catch (err) {
          console.log(`station source not responding id: ${station[0]}`);
          delete allUrls[station[0]];
        }
      })
    );
    resolve(allUrls);
  });
}
