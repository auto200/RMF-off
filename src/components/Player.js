import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { usePlayer } from "../contexts/PlayerContext";
import { IoMdVolumeHigh } from "react-icons/io";
import { playerHeight } from "../utils/constants";
import ActionButton from "./ActionButton/ActionButton";
import { playerStates } from "../contexts/PlayerContext";

const Wrapper = styled.div`
  height: ${playerHeight + "px"};
  position: fixed;
  z-index: 10;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%)
    ${({ isShown }) =>
      isShown ? `translateY(0)` : `translateY(${playerHeight + "px"})`};
  transition: transform 1s ease;
  background-color: ${({ theme }) => theme.colors.secondary};
  width: 100%;
  max-width: 400px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border-top: 1px solid ${({ theme }) => theme.colors.regularText};
  padding: 0 15px;
`;
const Field = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme, highlight }) =>
    highlight ? theme.colors.highlightText : theme.colors.regularText};
  width: ${({ width }) => width};
`;
const Cover = styled.img`
  height: 80%;
  width: auto;
`;
const TrackInfoContainer = styled.div`
  overflow: hidden;
  width: 30%;
  padding: 3px 0;
`;
const VolumeSlider = styled(IoMdVolumeHigh)`
  width: 10%;
  color: ${({ theme }) => theme.colors.regularText};
  font-size: 35px;
`;
const ActionButtonWrapper = styled.div`
  color: ${({ theme }) => theme.colors.regularText};
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15%;
  cursor: pointer;
`;

const Player = () => {
  const {
    station: { stationName, cover, songName, artist, streamURL },
    playerState,
    setPlayerState,
    handleActionButtonClick
  } = usePlayer();

  const audioRef = useRef(null);

  useEffect(() => {
    //temporary
    //TODO: store and get this value from localstorage (debounce it for sure)
    audioRef.current.volume = 0.01;
  }, []);

  useEffect(() => {
    if (playerState === playerStates.PLAYING) {
      audioRef.current.play();
    } else if (playerState === playerStates.PAUSED) {
      audioRef.current.pause();
    }
  }, [playerState]);

  //TODO make this on grid or someting
  return (
    <Wrapper isShown={stationName}>
      <Field width="20%">{stationName}</Field>
      <Cover src={cover} />
      <TrackInfoContainer>
        <Field highlight>{songName}</Field>
        <Field>{artist}</Field>
      </TrackInfoContainer>
      {/*TODO: make slider */}
      <VolumeSlider />
      <ActionButtonWrapper onClick={() => handleActionButtonClick()}>
        <ActionButton />
      </ActionButtonWrapper>
      <audio
        src={streamURL}
        ref={audioRef}
        onLoadStart={() => setPlayerState(playerStates.LOADING)}
        onCanPlay={() => {
          audioRef.current.play();
        }}
        // onError={}
        onPause={() => setPlayerState(playerStates.PAUSED)}
        onPlaying={() => setPlayerState(playerStates.PLAYING)}
      />
    </Wrapper>
  );
};

export default Player;
