import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Tails from "./components/Tails";
import Player from "./components/Player";
import socketIO from "socket.io-client";
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
const socket = socketIO(SOCKET_URL);

const App = () => {
  const [error, setError] = useState();
  const [allTails, setAllTails] = useState([]);
  window.tails = allTails;
  const [filtredTails, setFiltredTails] = useState([]);
  const [[currentFilterType, filterValue], setFilter] = useState([
    "stationName",
    "",
  ]);

  useEffect(() => {
    socket.on("initialData", (tails) => {
      setAllTails(tails);
    });

    socket.on("dataUpdate", (changedTails) => {
      setAllTails((prev) => {
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

    socket.on("error", (msg) => {
      setError(msg);
    });
  }, []);

  useEffect(() => {
    const filterVal = filterValue.toLowerCase();
    setFiltredTails(() =>
      allTails.filter((tail) =>
        tail[currentFilterType].toLowerCase().includes(filterVal)
      )
    );
  }, [allTails, filterValue, currentFilterType]);

  return (
    <>
      <Header
        currentFilterType={currentFilterType}
        filterValue={filterValue}
        setFilter={setFilter}
        filterTypes={filterTypes}
      />
      <PlayerContext>
        <Tails tails={filtredTails} />
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
