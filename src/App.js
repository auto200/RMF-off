import React, { useEffect, useState } from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./utils/themes";
import Header from "./components/Header";
import Tails from "./components/Tails";
import Player from "./Player";
import socketIO from "socket.io-client";

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
  const [tails, setTails] = useState([]);
  window.tails = tails;
  const [filtredTails, setFiltredTails] = useState([]);
  const [currentRadioUrl, setCurrentRadioUrl] = useState("");
  const [[currentFilterType, filterValue], setFilter] = useState([
    "stationName",
    ""
  ]);
  const [gridLayout, setGridLayout] = useState("wide");
  //TODO: make useEffect to load/save data to localstorage about colorTheme/gridLayout

  useEffect(() => {
    socket.on("initialData", data => {
      setTails(data);
    });
    socket.on("dataUpdate", data => {
      console.log(data);
      setTails(prev => {
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
  }, []);

  useEffect(() => {
    const filterVal = filterValue.toLowerCase();
    setFiltredTails(() =>
      tails.filter(tail =>
        tail[currentFilterType].toLowerCase().includes(filterVal)
      )
    );
  }, [tails, filterValue, currentFilterType]);

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
        <Tails tails={filtredTails} gridLayout={gridLayout} />
        <Player url={currentRadioUrl} />
      </>
    </ThemeProvider>
  );
}

export default App;
