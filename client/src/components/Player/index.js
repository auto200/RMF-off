import React, { useRef, useEffect, useState } from "react";
import { usePlayer } from "../../contexts/PlayerContext";
import { FaVolumeUp, FaVolumeDown, FaVolumeMute } from "react-icons/fa";
import { playerHeight } from "../../utils/constants";
import PlayerStateIcon from "../PlayerStateIcon";
import { playerStates } from "../../contexts/PlayerContext";
import "react-rangeslider/lib/index.css";
import useDebounce from "../../utils/hooks/useDebounce";
import { Image, Box, Text, Flex, Progress } from "@chakra-ui/react";
import { Fade } from "@chakra-ui/react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import { isMobile } from "react-device-detect";

const AudioIcon = ({ volume }) => {
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
  const {
    station: { stationName, cover, songName, artist, streamURL },
    playerState,
    setPlayerState,
    handleActionButtonClick,
  } = usePlayer();
  const [volume, setVolume] = useState(50);

  const debouncedVolume = useDebounce(volume, 3000);
  const audioRef = useRef(null);

  useEffect(() => {
    const savedVolume = window.localStorage.getItem("volume");
    if (savedVolume) {
      setVolume(savedVolume * 1);
    }
  }, []);

  useEffect(() => {
    //idk it seems to be so loud so thats why divide by value higher than 100 (0-1 range)
    audioRef.current.volume = volume / 1000;
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

  return (
    <Fade in={!!stationName}>
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
          isAnimated={playerState === playerStates.PLAYING}
          value={100}
        />
        <Image src={cover} boxSize={playerHeight + "px"} fit="cover" />
        <Box px={2} isTruncated flex="1">
          <Text
            my={1}
            m={0}
            fontWeight="bold"
            fontSize="xl"
            color="gray.200"
            isTruncated
          >
            {songName}
          </Text>
          <Text
            my={1}
            m={0}
            fontWeight="bold"
            fontSize="sm"
            color="gray.500"
            isTruncated
          >
            {artist}
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
          onClick={() => handleActionButtonClick()}
        />

        <audio
          src={streamURL}
          ref={audioRef}
          onLoadStart={() => setPlayerState(playerStates.LOADING)}
          onCanPlay={() => {
            audioRef.current.play();
          }}
          onPause={() => setPlayerState(playerStates.PAUSED)}
          onPlaying={() => setPlayerState(playerStates.PLAYING)}
        />
      </Flex>
    </Fade>
  );
};

export default Player;
