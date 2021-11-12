import { Fade, Flex, Image } from "@chakra-ui/react";
import PlayerStateIcon from "components/PlayerStateIcon";
import { usePlayer } from "contexts/PlayerContext";
import React, { useEffect, useRef, useState } from "react";
import { isDesktop } from "react-device-detect";
import { PLAYER_HEIGHT } from "utils/constants";
import { PLAYER_STATE } from "utils/enums";
import { AudioIcon, VolumeSlider } from "./components";
import PlayingIndication from "./components/PlayingIndication";
import SongNameAndArtist from "./components/SongNameAndArtist";

const Player = () => {
  const {
    currentStation,
    playerState,
    setPlayerState,
    togglePlayerState,
    activeStationElementRef,
  } = usePlayer();
  const [volume, setVolume] = useState<number>(() => (isDesktop ? 50 : 100));
  const [muted, setMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const scrollToActiveStation = () => {
    activeStationElementRef.current?.scrollIntoView({
      block: "center",
    });
  };

  useEffect(() => {
    if (audioRef.current) {
      //it seems to be so loud so thats why divide by value higher than 100 (0-1 range)
      audioRef.current.volume = muted ? 0 : volume / 1000;
    }
  }, [volume, muted]);

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
          cursor="pointer"
          onClick={scrollToActiveStation}
          title="Przejdź do kafelki"
        />
        <SongNameAndArtist
          songName={currentStation?.song.name}
          artist={currentStation?.song.artist}
        />

        {isDesktop && (
          <Flex fontSize="3xl" ml="auto">
            <AudioIcon
              volume={muted ? 0 : volume}
              onClick={() => setMuted((muted) => !muted)}
            />
            <VolumeSlider
              volume={muted ? 0 : volume}
              onChange={(val) => {
                setVolume(val);
                setMuted(false);
              }}
            />
          </Flex>
        )}

        <PlayerStateIcon
          mx={[3, 5]}
          p={1}
          fontSize="3xl"
          onClick={togglePlayerState}
        />

        <audio
          src={currentStation?.streamURL}
          ref={audioRef}
          onLoadStart={() => setPlayerState(PLAYER_STATE.LOADING)}
          onCanPlay={() => audioRef.current?.play()}
          onPause={() => setPlayerState(PLAYER_STATE.PAUSED)}
          onPlaying={() => setPlayerState(PLAYER_STATE.PLAYING)}
        />
      </Flex>
    </Fade>
  );
};

export default Player;
