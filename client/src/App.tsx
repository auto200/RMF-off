import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Stations from "./components/Stations";
import Player from "./components/Player";
import { io } from "socket.io-client";
import PlayerContext from "./contexts/PlayerContext";
import "typeface-quicksand";
import { Box } from "@chakra-ui/react";

const filterTypes = {
  stationName: "Nazwa stacji",
  artist: "Wykonawca",
  songName: "Nazwa piosenki",
};

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
    cover?: string;
    artist?: string;
  };
}

const App = () => {
  const [socket] = useState(io(SOCKET_URL));
  const [error, setError] = useState<string>("");
  const [allStations, setAllStations] = useState<IStation[]>([]);
  //@ts-ignore
  window.tails = allStations;
  // const [filtredTails, setFiltredTails] = useState<Station[]>([]);
  // const [[currentFilterType, filterValue], setFilter] = useState<any>([
  //   "stationName",
  //   "",
  // ]);
  console.log(allStations);
  useEffect(() => {
    socket.on("INITIAL_DATA", (tails: IStation[]) => {
      setAllStations(tails);
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
  }, []);

  // useEffect(() => {
  //   const filterVal = filterValue.toLowerCase();
  //   setFiltredTails(() =>
  //     allStations.filter((tail) =>
  //       tail[currentFilterType].toLowerCase().includes(filterVal)
  //     )
  //   );
  // }, [allStations, filterValue, currentFilterType]);

  return (
    <>
      {/* <Header
        currentFilterType={currentFilterType}
        filterValue={filterValue}
        setFilter={setFilter}
        filterTypes={filterTypes}
      />
      <PlayerContext stations={allTails}> */}
      <Stations stations={allStations} />
      {/* <Player />
      </PlayerContext>
      {error && (
        <Box fontSize="6xl" color="red.500" textAlign="center">
          {error}
        </Box>
      )} */}
    </>
  );
};

export default App;
