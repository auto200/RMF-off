import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { usePlayer } from "../../contexts/PlayerContext";
import { FaVolumeUp, FaVolumeDown, FaVolumeMute } from "react-icons/fa";
import { playerHeight } from "../../utils/constants";
import ActionButton from "../ActionButton/ActionButton";
import { playerStates } from "../../contexts/PlayerContext";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
import useDebounce from "../../utils/hooks/useDebounce";

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
const AudioSettingsContainer = styled.div`
  position: relative;
  width: 10%;
  color: ${({ theme }) => theme.colors.regularText};
  font-size: 35px;
  display: grid;
  place-items: center;
`;
const VolumeSliderContainer = styled.div`
  position: absolute;
  bottom: ${playerHeight - 15 + "px"};
  z-index: -20000;
  width: 30px;
  display: grid;
  left: 5px;
  place-items: center;
  background-color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.regularText};
  transform: translateY(15%) scale(0);
  transform-origin: bottom;
  transition: transform 0.5s ease, scale 0.5s ease;
  .rangeslider {
    margin: 0;
    background-color: ${({ theme }) => theme.colors.secondary};
  }
  .rangeslider__fill {
    background-color: ${({ theme }) => theme.colors.highlightText};
  }
  ${AudioSettingsContainer}:hover & {
    transform: translateY(0) scale(1);
  }
  /* &:hover {
    transform: translateY(0);
  } */
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
const AudioIcon = ({ volume }) => {
  if (volume === 0) return <FaVolumeMute />;
  if (volume > 0 && volume < 51) return <FaVolumeDown />;
  return <FaVolumeUp />;
};

const Player = () => {
  const {
    station: { stationName, cover, songName, artist, streamURL },
    playerState,
    setPlayerState,
    handleActionButtonClick
  } = usePlayer();
  const [volume, setVolume] = useState(1);

  const debouncedVolume = useDebounce(volume, 3000);
  const audioRef = useRef(null);

  useEffect(() => {
    const savedVolume = window.localStorage.getItem("volume");
    if (savedVolume) {
      setVolume(savedVolume * 1);
    }
  }, []);

  useEffect(() => {
    //idk it seems to be so loud so thats why 550 and not 100 (0-1 range)
    audioRef.current.volume = volume / 550;
    audioRef.current.muted = true;
  }, [volume]);

  useEffect(() => {
    window.localStorage.setItem("volume", debouncedVolume);
  }, [debouncedVolume]);

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
      <AudioSettingsContainer>
        <AudioIcon volume={volume} />
        <VolumeSliderContainer>
          <Slider
            orientation="vertical"
            value={volume}
            onChange={val => setVolume(val)}
          />
        </VolumeSliderContainer>
      </AudioSettingsContainer>
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
