import React, { useEffect, useState } from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./utils/themes";
import Header from "./components/Header";
import Tails from "./components/Tails";
import Player from "./components/Player/Player";
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
  const [darkMode, setDarkMode] = useState(true);
  const [allTails, setAllTails] = useState([]);
  window.tails = allTails;
  const [filtredTails, setFiltredTails] = useState([]);
  const [[currentFilterType, filterValue], setFilter] = useState([
    "stationName",
    ""
  ]);
  const [wideGridLayout, setWideGridLayout] = useState(true);

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

    const savedTheme = window.localStorage.getItem("darkMode");
    setDarkMode(!!savedTheme);

    const savedGridLayout = window.localStorage.getItem("wideGridLayout");
    setWideGridLayout(!!savedGridLayout);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    window.localStorage.setItem("wideGridLayout", wideGridLayout);
  }, [wideGridLayout]);

  useEffect(() => {
    const filterVal = filterValue.toLowerCase();
    setFiltredTails(() =>
      allTails.filter(tail =>
        tail[currentFilterType].toLowerCase().includes(filterVal)
      )
    );
  }, [allTails, filterValue, currentFilterType]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const toggleGridLayout = () => setWideGridLayout(prev => !prev);

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
        <PlayerContext>
          <Tails tails={filtredTails} wideGridLayout={wideGridLayout} />
          <Player />
        </PlayerContext>
      </>
    </ThemeProvider>
  );
}

export default App;
