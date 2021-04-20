import React from "react";
import Station from "./Station";
import { usePlayer } from "../../contexts/PlayerContext";
import PropTypes from "prop-types";
import { Flex, SimpleGrid } from "@chakra-ui/react";
import { IStation } from "../../App";

const Stations: React.FC<{ stations: IStation[] }> = ({ stations }) => {
  // const {
  //   currentStationId,
  //   playerState,
  //   handleActionButtonClick,
  // } = usePlayer();
  return (
    <Flex justifyContent="center">
      <SimpleGrid minChildWidth="340px" spacing="20px" p="20px" w="full">
        {stations.map(({ id, name, song, streamURL }) => {
          return (
            <Station
              key={`radio${id}`}
              id={id}
              name={name}
              song={song}
              streamURL={streamURL}
              // stationName={stationName}
              // cover={cover}
              // songName={songName}
              // artist={artist}
              // streamURL={streamURL}
              // //player props
              // id={id}
              // isActive={currentStationId === id}
              // handleActionButtonClick={handleActionButtonClick}
              // playerState={playerState}
            ></Station>
          );
        })}
      </SimpleGrid>
    </Flex>
  );
};

export default Stations;
