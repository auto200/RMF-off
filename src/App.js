import React, { useEffect, useState } from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./utils/themes";
import Header from "./components/Header";
import Tails from "./components/Tails";
import Player from "./components/Player";
import socketIO from "socket.io-client";
import PlayerContext from "./contexts/PlayerContext";
import { headerHeight } from "./utils/constants";

const GlobalStyle = createGlobalStyle`
  html, body{
    margin: 0;
    padding: 0;
    font-family: consolas;
    background-color: ${({ theme }) => theme.colors.primary};
    transition: color, 0.3s, background-color 0.3s;
    #root{
      margin-top: ${headerHeight + "px"};
    }

    *,*::before,*::after{
      box-sizing: border-box;
    }
  }
`;

const filterTypes = {
  stationName: "Nazwa stacji",
  artist: "Wykonawca",
  songName: "Nazwa piosenki"
};

const socket = socketIO("http://localhost:3000");

function App() {
  const [colorTheme, setColorTheme] = useState("dark");
  const [allTails, setAllTails] = useState([]);
  window.tails = allTails;
  const [filtredTails, setFiltredTails] = useState([]);
  const [[currentFilterType, filterValue], setFilter] = useState([
    "stationName",
    ""
  ]);
  const [gridLayout, setGridLayout] = useState("wide");

  useEffect(() => {
    socket.on("initialData", data => {
      setAllTails(data);
    });
    socket.on("dataUpdate", data => {
      setAllTails(prev => {
        const newTails = prev.map(tail => {
          const modifiedTail = data.find(obj => obj.id === tail.id);
          if (modifiedTail) {
            return { ...tail, ...modifiedTail };
          }
          return tail;
        });
        return newTails;
      });
    });

    const savedTheme = window.localStorage.getItem("theme");
    if (savedTheme) {
      setColorTheme(savedTheme);
    }

    const savedGridLayout = window.localStorage.getItem("gridLayout");
    if (savedGridLayout) {
      setGridLayout(savedGridLayout);
    }
  }, []);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    if (savedTheme !== colorTheme) {
      window.localStorage.setItem("theme", colorTheme);
    }
  }, [colorTheme]);

  useEffect(() => {
    const savedGridLayout = window.localStorage.getItem("gridLayout");
    if (savedGridLayout !== gridLayout) {
      window.localStorage.setItem("gridLayout", gridLayout);
    }
  }, [gridLayout]);

  useEffect(() => {
    const filterVal = filterValue.toLowerCase();
    setFiltredTails(() =>
      allTails.filter(tail =>
        tail[currentFilterType].toLowerCase().includes(filterVal)
      )
    );
  }, [allTails, filterValue, currentFilterType]);

  const toggleTheme = () =>
    setColorTheme(prev => (prev === "dark" ? "light" : "dark"));

  const toggleGridLayout = () =>
    setGridLayout(prev => (prev === "wide" ? "small" : "wide"));

  return (
    <ThemeProvider theme={colorTheme === "dark" ? darkTheme : lightTheme}>
      <>
        <GlobalStyle />
        <Header
          toggleTheme={toggleTheme}
          colorTheme={colorTheme}
          currentFilterType={currentFilterType}
          filterValue={filterValue}
          setFilter={setFilter}
          filterTypes={filterTypes}
          gridLayout={gridLayout}
          toggleGridLayout={toggleGridLayout}
        />
        <PlayerContext>
          <Tails tails={filtredTails} gridLayout={gridLayout} />
          <Player />
        </PlayerContext>
      </>
    </ThemeProvider>
  );
}

export default App;
