import { Flex, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { usePlayer } from "../../contexts/PlayerContext";
import { PLAYER_STATE } from "../../utils/enums";
import { Station as IStation } from "../../utils/interfaces";
import Station from "./Station";

const Stations: React.FC<{ stations: IStation[] }> = ({ stations }) => {
  const { currentStation, playerState, changeStation, togglePlayerState } =
    usePlayer();

  return (
    <Flex justifyContent="center">
      <SimpleGrid
        templateColumns="repeat(auto-fit, minmax(350px, max-content))"
        justifyContent="center"
        spacing="20px"
        p="20px"
        w="full"
      >
        {stations.map(({ id, name, song, streamURL }) => {
          const isActive = currentStation?.id === id;
          const playStation = () => {
            if (isActive) {
              if (playerState === PLAYER_STATE.LOADING) {
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
              isActive={isActive}
              play={playStation}
            ></Station>
          );
        })}
      </SimpleGrid>
    </Flex>
  );
};

export default Stations;
