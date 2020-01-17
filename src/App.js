import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import axios from "axios";
import Player from "./Player";

const GlobalStyle = createGlobalStyle`
  html, body{
    margin: 0;
    padding: 0;
    font-family: consolas;

    *,*::before,*::after{
      box-sizing: border-box;
    }
  }
`;

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;
const Tail = styled.div`
  position: relative;
  width: 300px;
  height: 250px;
  border: 2px solid black;
  margin: 5px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: white;
`;
const Background = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  filter: brightness(0.5);
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
    <Wrapper>
      <GlobalStyle />
      {tails.map(({ id, cover, songName, artist, url }) => {
        const defaultCover =
          "https://banner2.cleanpng.com/20180501/yxq/kisspng-t-shirt-twitch-emote-youtube-pepe-the-frog-on-saturday-5ae91f46dde8a4.441902551525227334909.jpg";
        return (
          <Tail key={id} onClick={() => setCurrentRadioUrl(url)}>
            <Background src={cover || defaultCover} />
            <h1>{songName}</h1>
            <h2>{artist}</h2>
          </Tail>
        );
      })}
      <Player url={currentRadioUrl} />
    </Wrapper>
  );
}

export default App;
