import React from "react";
import styled from "styled-components";
import Tail from "./Tail";
import { headerHeight } from "../../utils/constants";

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 15px;
  padding: ${headerHeight + 15 + "px"} 15px 15px 15px;
`;

const Tails = ({ tails }) => {
  return (
    <Wrapper>
      {tails.map(({ id, stationName, cover, songName, artist, streamURL }) => {
        const defaultCover =
          "https://banner2.cleanpng.com/20180501/yxq/kisspng-t-shirt-twitch-emote-youtube-pepe-the-frog-on-saturday-5ae91f46dde8a4.441902551525227334909.jpg";
        return (
          <Tail
            key={`radio${id}`}
            stationName={stationName}
            cover={cover}
            songName={songName}
            artist={artist}
            defaultCover={defaultCover}
          ></Tail>
        );
      })}
    </Wrapper>
  );
};

export default Tails;
