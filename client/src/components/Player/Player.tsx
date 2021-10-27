import { Fade, Flex, Image } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { usePlayer } from "../../contexts/PlayerContext";
import { PLAYER_HEIGHT } from "../../utils/constants";
import { PLAYER_STATE } from "../../utils/enums";
import useDebounce from "../../utils/hooks/useDebounce";
import PlayerStateIcon from "../PlayerStateIcon";
import { AudioIcon, VolumeSlider } from "./components";
import PlayingIndication from "./components/PlayingIndication";
import SongNameAndArtist from "./components/SongNameAndArtist";

const Player = () => {
  const { currentStation, playerState, setPlayerState, togglePlayerState } =
    usePlayer();
  const [volume, setVolume] = useState<number>(100);

  const debouncedVolume = useDebounce(volume, 3000);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const savedVolume = window.localStorage.getItem("volume") as number | null;
    if (savedVolume) {
      setVolume(savedVolume * 1);
    }
  }, []);

  useEffect(() => {
    //it seems to be so loud so thats why divide by value higher than 100 (0-1 range)
    if (audioRef.current) {
      audioRef.current.volume = volume / 1000;
    }
  }, [volume]);

  useEffect(() => {
    window.localStorage.setItem("volume", debouncedVolume.toString());
  }, [debouncedVolume]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (playerState === PLAYER_STATE.PLAYING) {
      audioRef.current.play();
    } else if (playerState === PLAYER_STATE.PAUSED) {
      audioRef.current.pause();
    }
  }, [playerState]);

  return (
    <Fade in={!!currentStation}>
      <Flex
        pos="fixed"
        left="50%"
        transform="translateX(-50%)"
        h={PLAYER_HEIGHT + "px"}
        w="full"
        maxW={["full", "xl"]}
        bottom="0"
        bg="gray.700"
        align="center"
        color="gray.50"
      >
        <PlayingIndication isPlaying={playerState === PLAYER_STATE.PLAYING} />
        <Image
          src={currentStation?.song.cover}
          boxSize={PLAYER_HEIGHT + "px"}
          fit="cover"
        />
        <SongNameAndArtist
          songName={currentStation?.song.name}
          artist={currentStation?.song.artist}
        />

        {!isMobile && (
          <Flex fontSize="3xl" ml="auto">
            <AudioIcon volume={volume} />
            <VolumeSlider volume={volume} onChange={(val) => setVolume(val)} />
          </Flex>
        )}

        <PlayerStateIcon
          mx={[3, 5]}
          p={1}
          fontSize="3xl"
          onClick={togglePlayerState}
          aria-label="asdf"
        />

        <audio
          src={currentStation?.streamURL}
          ref={audioRef}
          onLoadStart={() => setPlayerState(PLAYER_STATE.LOADING)}
          onCanPlay={() => {
            if (audioRef.current) {
              audioRef.current.play();
            }
          }}
          onPause={() => setPlayerState(PLAYER_STATE.PAUSED)}
          onPlaying={() => setPlayerState(PLAYER_STATE.PLAYING)}
        />
      </Flex>
    </Fade>
  );
};

export default Player;
