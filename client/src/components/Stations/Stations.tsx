import { Flex, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { usePlayer } from "../../contexts/PlayerContext";
import { useStore } from "../../contexts/StoreContext";
import { PLAYER_STATE } from "../../utils/enums";
import Station from "./Station";

const Stations: React.FC = () => {
  const { filtredStations } = useStore();
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
        {filtredStations.map(({ id, name, song, streamURL }) => {
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
            />
          );
        })}
      </SimpleGrid>
    </Flex>
  );
};

export default Stations;
