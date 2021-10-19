import {
  Box,
  Fade,
  Flex,
  Image,
  Progress,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { FaVolumeDown, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { PLAYER_STATES, usePlayer } from "../../contexts/PlayerContext";
import { playerHeight } from "../../utils/constants";
import useDebounce from "../../utils/hooks/useDebounce";
import PlayerStateIcon from "../PlayerStateIcon";

const AudioIcon: React.FC<{ volume: number }> = ({ volume }) => {
  let Icon;
  if (volume === 0) {
    Icon = <FaVolumeMute />;
  } else if (volume > 0 && volume < 51) {
    Icon = <FaVolumeDown />;
  } else {
    Icon = <FaVolumeUp />;
  }
  return Icon;
};

const Player = () => {
  const { currentStation, playerState, setPlayerState, togglePlayerState } =
    usePlayer();
  const [volume, setVolume] = useState<number>(100);
  const [stationSelected, setStationSelected] = useState<boolean>(false);

  const debouncedVolume = useDebounce(volume, 3000);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (currentStation && !stationSelected) {
      setStationSelected(true);
    }
  }, [currentStation]);

  useEffect(() => {
    const savedVolume = window.localStorage.getItem("volume") as number | null;
    if (savedVolume) {
      setVolume(savedVolume * 1);
    }
  }, []);

  useEffect(() => {
    //idk it seems to be so loud so thats why divide by value higher than 100 (0-1 range)
    if (audioRef.current) {
      audioRef.current.volume = volume / 1000;
    }
  }, [volume]);

  useEffect(() => {
    window.localStorage.setItem("volume", debouncedVolume.toString());
  }, [debouncedVolume]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (playerState === PLAYER_STATES.PLAYING) {
      audioRef.current.play();
    } else if (playerState === PLAYER_STATES.PAUSED) {
      audioRef.current.pause();
    }
  }, [playerState]);

  return (
    <Fade in={stationSelected}>
      <Flex
        pos="fixed"
        left="50%"
        transform="translateX(-50%)"
        h={playerHeight + "px"}
        w="full"
        maxW={["full", "xl"]}
        bottom="0"
        bg="gray.700"
        align="center"
        color="gray.50"
      >
        <Progress
          pos="absolute"
          top={-1}
          w="full"
          size="xs"
          hasStripe
          isAnimated={playerState === PLAYER_STATES.PLAYING}
          value={100}
        />
        <Image
          src={currentStation?.song.cover}
          boxSize={playerHeight + "px"}
          fit="cover"
        />
        <Box px={2} isTruncated flex="1">
          <Text
            my={1}
            m={0}
            fontWeight="bold"
            fontSize="xl"
            color="gray.200"
            isTruncated
          >
            {currentStation?.song.name}
          </Text>
          <Text
            my={1}
            m={0}
            fontWeight="bold"
            fontSize="sm"
            color="gray.500"
            isTruncated
          >
            {currentStation?.song.artist}
          </Text>
        </Box>

        {!isMobile && (
          <Flex fontSize="3xl" ml="auto">
            <AudioIcon volume={volume} />
            <Slider
              ml={3}
              value={volume}
              onChange={(val) => setVolume(val)}
              w="100px"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Flex>
        )}

        <PlayerStateIcon
          mx={[3, 5]}
          p={1}
          fontSize="3xl"
          playerState={playerState}
          onClick={togglePlayerState}
          aria-label="asdf"
        />

        <audio
          src={currentStation?.streamURL}
          ref={audioRef}
          onLoadStart={() => setPlayerState(PLAYER_STATES.LOADING)}
          onCanPlay={() => {
            if (audioRef.current) {
              audioRef.current.play();
            }
          }}
          onPause={() => setPlayerState(PLAYER_STATES.PAUSED)}
          onPlaying={() => setPlayerState(PLAYER_STATES.PLAYING)}
        />
      </Flex>
    </Fade>
  );
};

export default Player;
