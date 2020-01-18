import React, { useEffect, useState } from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import axios from "axios";
import Header from "./components/Header";
import Tails from "./components/Tails";
import Player from "./Player";

const GlobalStyle = createGlobalStyle`
  html, body{
    margin: 0;
    padding: 0;
    font-family: consolas;
    background-color: ${({ theme }) => theme.colors.primary};
    transition: color, 0.3s, background-color 0.3s;

    *,*::before,*::after{
      box-sizing: border-box;
    }
  }
`;
const darkTheme = {
  colors: {
    primary: "#181a1b",
    secondary: "#393939",
    regularText: "#dcdde1",
    highlightText: "#ffffff"
  },
  imgBrightness: 0.7
};
const lightTheme = {
  colors: {
    primary: "#ffffff",
    secondary: "#dcdde1",
    regularText: "#393939",
    highlightText: "#181a1b"
  },
  imgBrightness: 1
};

const filters = {
  station: "station",
  artist: "artist",
  songName: "songName"
};
function App() {
  const [colorTheme, setColorTheme] = useState("dark");
  const [tails, setTails] = useState([]);
  const [currentRadioUrl, setCurrentRadioUrl] = useState("");
  const [[filterType, filterValue], setFilter] = useState([
    filters.station,
    ""
  ]);
  window.tails = tails;

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get("http://localhost:3000");
      setTails(data);
    };
    getData();
  }, []);

  const toggleTheme = () =>
    setColorTheme(prev => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeProvider theme={colorTheme === "dark" ? darkTheme : lightTheme}>
      <>
        <GlobalStyle />
        <Header toggleTheme={toggleTheme} colorTheme={colorTheme} />
        <Tails tails={tails} />
        <Player url={currentRadioUrl} />
      </>
    </ThemeProvider>
  );
}

export default App;
