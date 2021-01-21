import React from "react";
import Tail from "./Tail";
import { usePlayer } from "../../contexts/PlayerContext";
import PropTypes from "prop-types";
import { Flex, SimpleGrid } from "@chakra-ui/react";

const Tails = ({ tails }) => {
  const {
    currentStationId,
    playerState,
    handleActionButtonClick,
  } = usePlayer();
  return (
    <Flex justifyContent="center">
      <SimpleGrid minChildWidth="340px" spacing="20px" p="20px" w="full">
        {tails.map(
          ({ id, stationName, cover, songName, artist, streamURL }) => {
            return (
              <Tail
                key={`radio${id}`}
                stationName={stationName}
                cover={cover}
                songName={songName}
                artist={artist}
                streamURL={streamURL}
                //player props
                id={id}
                isActive={currentStationId === id}
                handleActionButtonClick={handleActionButtonClick}
                playerState={playerState}
              ></Tail>
            );
          }
        )}
      </SimpleGrid>
    </Flex>
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
      cover: PropTypes.string,
    })
  ),
  wideGridLayout: PropTypes.bool,
};
