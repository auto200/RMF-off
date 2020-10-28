import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./utils/themes";
import Header from "./components/Header";
import Tails from "./components/Tails";
import Player from "./components/Player";
import socketIO from "socket.io-client";
import PlayerContext from "./contexts/PlayerContext";
import { headerHeight, playerHeight } from "./utils/constants";
import "typeface-quicksand";

const GlobalStyle = createGlobalStyle`
  html, body{
    margin: 0;
    padding: 0;
    font-family: Quicksand, consolas;
    background-color: ${({ theme }) => theme.colors.primary};
    transition: color, 0.3s, background-color 0.3s;
    #root{
      margin-top: ${headerHeight + "px"};
      margin-bottom: ${playerHeight + "px"};
    }

    *,*::before,*::after{
      box-sizing: border-box;
    }
  }
`;
const StyledErrorMessage = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.highlightText};
  text-align: center;
`;

const filterTypes = {
  stationName: "Nazwa stacji",
  artist: "Wykonawca",
  songName: "Nazwa piosenki",
};

const SOCKET_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://rmfoff.auto200.eu";
const socket = socketIO(SOCKET_URL);
const App = () => {
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [allTails, setAllTails] = useState([]);
  window.tails = allTails;
  const [filtredTails, setFiltredTails] = useState([]);
  const [[currentFilterType, filterValue], setFilter] = useState([
    "stationName",
    "",
  ]);
  const [wideGridLayout, setWideGridLayout] = useState(true);
  useEffect(() => {
    socket.on("initialData", (data) => {
      setAllTails(data);
    });

    socket.on("dataUpdate", (data) => {
      setAllTails((prev) => {
        const newTails = prev.map((tail) => {
          const modifiedTail = data.find((obj) => obj.id === tail.id);
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

    // loading themes from localstorage
    try {
      const savedDarkMode = JSON.parse(window.localStorage.getItem("darkMode"));
      if (savedDarkMode === null) {
        setDarkMode(true);
      } else {
        setDarkMode(savedDarkMode);
      }
    } catch (err) {
      setDarkMode(true);
    }

    try {
      const savedGridLayout = JSON.parse(
        window.localStorage.getItem("wideGridLayout")
      );
      if (savedGridLayout === null) {
        setWideGridLayout(true);
      } else {
        setWideGridLayout(savedGridLayout);
      }
    } catch (err) {
      setWideGridLayout(true);
    }
  }, []);

  useEffect(() => {
    const filterVal = filterValue.toLowerCase();
    setFiltredTails(() =>
      allTails.filter((tail) =>
        tail[currentFilterType].toLowerCase().includes(filterVal)
      )
    );
  }, [allTails, filterValue, currentFilterType]);

  const toggleDarkMode = () =>
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", !prev);
      return !prev;
    });

  const toggleGridLayout = () =>
    setWideGridLayout((prev) => {
      localStorage.setItem("wideGridLayout", !prev);
      return !prev;
    });

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <>
        <GlobalStyle />
        <Header
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
          currentFilterType={currentFilterType}
          filterValue={filterValue}
          setFilter={setFilter}
          filterTypes={filterTypes}
          wideGridLayout={wideGridLayout}
          toggleGridLayout={toggleGridLayout}
        />
        {error ? (
          <StyledErrorMessage>{error}</StyledErrorMessage>
        ) : (
          <PlayerContext>
            <Tails tails={filtredTails} wideGridLayout={wideGridLayout} />
            <Player />
          </PlayerContext>
        )}
      </>
    </ThemeProvider>
  );
};

export default App;
