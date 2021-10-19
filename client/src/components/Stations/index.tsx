import { Flex, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { PLAYER_STATES, usePlayer } from "../../contexts/PlayerContext";
import { Station as IStation } from "../../utils/interfaces";
import Station from "./Station";

const Stations: React.FC<{ stations: IStation[] }> = ({ stations }) => {
  const { currentStation, playerState, changeStation, togglePlayerState } =
    usePlayer();

  return (
    <Flex justifyContent="center">
      <SimpleGrid minChildWidth="340px" spacing="20px" p="20px" w="full">
        {stations.map(({ id, name, song, streamURL }) => {
          const isActive = currentStation?.id === id;
          const handleCoverClick = () => {
            if (isActive) {
              if (playerState === PLAYER_STATES.LOADING) {
                return;
              }
              togglePlayerState();
            } else {
              changeStation(id);
            }
          };

          return (
            <Station
              key={id}
              id={id}
              name={name}
              song={song}
              streamURL={streamURL}
              // //player props
              isActive={isActive}
              handleCoverClick={handleCoverClick}
              playerState={playerState}
            ></Station>
          );
        })}
      </SimpleGrid>
    </Flex>
  );
};

export default Stations;
