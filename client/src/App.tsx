import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Stations from "./components/Stations";
import Player from "./components/Player";
import { io, Socket } from "socket.io-client";
import PlayerContext from "./contexts/PlayerContext";
import "typeface-quicksand";
import { Box } from "@chakra-ui/react";
import jammingFavicon from "./utils/jammingFavicon";
const Favicon = require("react-favicon");

export enum searchFilters {
  STATION_NAME = "STATION_NAME",
  ARTIST = "ARTIST",
  SONG_NAME = "SONG_NAME",
}

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
if (!SOCKET_URL) {
  throw new Error(
    `socket url not specified in ".env.${process.env.NODE_ENV}*" file`
  );
}

export interface IStation {
  id: number;
  name: string;
  streamURL: string;
  song: {
    name?: string;
    cover: string;
    artist?: string;
  };
}

const App = () => {
  const [socket, setSocket] = useState<Socket>(() => io(SOCKET_URL));
  const [error, setError] = useState<string>("");
  const [allStations, setAllStations] = useState<IStation[]>([]);
  //@ts-ignore
  window.stations = allStations;
  const [filtredStations, setFiltredStations] = useState<IStation[]>([]);
  const [[searchFilterType, searchFilterValue], setFilter] = useState<
    [searchFilters, string]
  >([searchFilters.STATION_NAME, ""]);
  useEffect(() => {
    socket.on("INITIAL_DATA", (stations: IStation[]) => {
      setAllStations(stations);
    });

    socket.on("DATA_UPDATE", (changedTails: IStation[]) => {
      setAllStations((prev) => {
        const newTails = prev.map((tail) => {
          const modifiedTail = changedTails.find((obj) => obj.id === tail.id);
          if (modifiedTail) {
            return { ...tail, ...modifiedTail };
          }
          return tail;
        });
        return newTails;
      });
    });

    socket.on("ERROR", (msg: string) => {
      setError(msg);
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    setFiltredStations(() =>
      allStations.filter((station) => {
        const values = {
          [searchFilters.ARTIST]: station.song.artist,
          [searchFilters.SONG_NAME]: station.song.name,
          [searchFilters.STATION_NAME]: station.name,
        };
        return values[searchFilterType]
          ?.toLowerCase()
          .includes(searchFilterValue.toLocaleLowerCase());
      })
    );
  }, [allStations, searchFilterValue, searchFilterType]);

  return (
    <>
      <Favicon url={jammingFavicon} animate animationDelay={50} />
      <Header
        searchFilterType={searchFilterType}
        searchFilterValue={searchFilterValue}
        setFilter={setFilter}
      />
      <PlayerContext stations={allStations}>
        <Stations stations={filtredStations} />
        <Player />
      </PlayerContext>

      {error && (
        <Box fontSize="6xl" color="red.500" textAlign="center">
          {error}
        </Box>
      )}
    </>
  );
};

export default App;
