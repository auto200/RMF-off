import React from "react";
import styled from "styled-components";
import Tail from "./Tail";
import { usePlayer } from "../../contexts/PlayerContext";
import PropTypes from "prop-types";

const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: ${({ wideGridLayout }) =>
    wideGridLayout
      ? "repeat(auto-fit, minmax(300px, 1fr))"
      : "repeat(auto-fit, minmax(250px, 1fr))"};
  grid-gap: 15px;
  justify-content: space-around;
  padding: 15px;
  overflow: hidden;
`;

const Tails = ({ tails, wideGridLayout }) => {
  const {
    currentStationId,
    playerState,
    handleActionButtonClick
  } = usePlayer();
  return (
    <Wrapper wideGridLayout={wideGridLayout}>
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
            streamURL={streamURL}
            //player props
            id={id}
            isActive={currentStationId === id}
            handleActionButtonClick={handleActionButtonClick}
            playerState={playerState}
          ></Tail>
        );
      })}
    </Wrapper>
  );
};

export default Tails;

Tails.propTypes = {
  tails: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.string,
      stationName: PropTypes.string,
      streamURL: PropTypes.string,
      artist: PropTypes.string,
      songName: PropTypes.string,
      cover: PropTypes.string
    })
  ),
  wideGridLayout: PropTypes.bool
};
