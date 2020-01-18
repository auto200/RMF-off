import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import axios from "axios";
import Tail from "./components/Tail";
import Player from "./Player";

const GlobalStyle = createGlobalStyle`
  html, body{
    margin: 0;
    padding: 0;
    font-family: consolas;
    background-color: ${({ theme }) => theme.colors.background};

    *,*::before,*::after{
      box-sizing: border-box;
    }
  }
`;
const theme = {
  colors: {
    background: "#181a1b",
    lightDark: "#393939",
    white: "#dcdde1",
    whitest: "white"
  }
};

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 15px;
  padding: 25px;
`;
function App() {
  const [tails, setTails] = useState([]);
  const [currentRadioUrl, setCurrentRadioUrl] = useState("");
  window.tails = tails;
  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get("http://localhost:3000");
      setTails(data);
    };
    getData();
  }, []);
  console.log(tails);
  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <GlobalStyle />
        {tails.map(
          ({ id, stationName, cover, songName, artist, streamURL }) => {
            const defaultCover =
              "https://banner2.cleanpng.com/20180501/yxq/kisspng-t-shirt-twitch-emote-youtube-pepe-the-frog-on-saturday-5ae91f46dde8a4.441902551525227334909.jpg";
            return (
              <Tail
                key={`radio${id}`}
                onClick={() => {
                  setCurrentRadioUrl(streamURL);
                }}
                stationName={stationName}
                cover={cover}
                songName={songName}
                artist={artist}
                defaultCover={defaultCover}
              ></Tail>
            );
          }
        )}
        <Player url={currentRadioUrl} />
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;
