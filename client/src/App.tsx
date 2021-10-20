import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "typeface-quicksand";
import Header from "./components/Header";
import Player from "./components/Player";
import Stations from "./components/Stations";
import PlayerContext from "./contexts/PlayerContext";
import { headerHeight } from "./utils/constants";
import { searchFilters, SOCKET_EVENTS } from "./utils/enums";
import { LoadingIcon } from "./utils/icons";
import { Station } from "./utils/interfaces";
import jammingFavicon from "./utils/jammingFavicon";
const Favicon = require("react-favicon");

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
if (!SOCKET_URL) {
  throw new Error(
    `socket url not specified in ".env.${process.env.NODE_ENV}*" file`
  );
}

const IS_DEV = process.env.NODE_ENV === "development";

const App = () => {
  const [error, setError] = useState<string>("");
  const [allStations, setAllStations] = useState<Station[]>([]);
  const [filtredStations, setFiltredStations] = useState<Station[]>([]);
  const [[searchFilterType, searchFilterValue], setFilter] = useState<
    [searchFilters, string]
  >([searchFilters.STATION_NAME, ""]);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on(SOCKET_EVENTS.INITIAL_STATIONS_DATA, (stations: Station[]) => {
      setAllStations(stations);
    });

    socket.on(SOCKET_EVENTS.STATIONS_UPDATE, (changedStations: Station[]) => {
      setAllStations((prevStations) => {
        const newStations = [...prevStations];
        changedStations.forEach((changedStation) => {
          const stationToUpdateIndex = prevStations.findIndex(
            (prevStation) => prevStation.id === changedStation.id
          );
          if (stationToUpdateIndex > -1) {
            newStations[stationToUpdateIndex] = changedStation;
          }
        });
        return newStations;
      });
    });

    socket.on(SOCKET_EVENTS.FATAL_ERROR, (msg: string) => {
      setError(msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    setFiltredStations(
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

  //My production server goes to "sleep mode" if no requests are made, cron job
  //does not help and there's a cold start, heres a quick dirty fix
  useEffect(() => {
    if (!IS_DEV) return;

    setTimeout(() => {
      setAllStations((stations) => {
        if (stations.length === 0) {
          window.location.reload();
        }

        return stations;
      });
    }, 3000);
  }, []);

  return (
    <>
      <Favicon url={jammingFavicon} animate animationDelay={50} />
      <Header
        searchFilterType={searchFilterType}
        searchFilterValue={searchFilterValue}
        setFilter={setFilter}
      />
      {allStations.length ? (
        <PlayerContext stations={allStations}>
          <Stations stations={filtredStations} />
          <Player />
        </PlayerContext>
      ) : (
        <Flex
          h={`calc(100vh - ${headerHeight}px - 200px)`}
          justifyContent="center"
          alignItems="center"
          fontSize="80px"
          mt="24"
        >
          {LoadingIcon}
        </Flex>
      )}

      {error && (
        <Box fontSize="6xl" color="red.500" textAlign="center">
          {error}
        </Box>
      )}
    </>
  );
};

export default App;
