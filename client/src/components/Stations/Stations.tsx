import { Flex, SimpleGrid } from "@chakra-ui/react";
import { usePlayer } from "contexts/PlayerContext";
import { useStore } from "contexts/StoreContext";
import Fuse from "fuse.js";
import React, { useEffect, useState } from "react";
import { PLAYER_STATE } from "utils/enums";
import { Station as IStation } from "utils/interfaces";
import Station from "./Station";

const getFiltredStations = (stations: IStation[], searchTerm: string) => {
  return new Fuse(stations, {
    keys: ["name", "song.name", "song.atrtist"],
  })
    .search(searchTerm)
    .map(({ item }) => item);
};

const Stations: React.FC = () => {
  const {
    currentStation,
    playerState,
    changeStation,
    togglePlayerState,
    activeStationElementRef,
  } = usePlayer();
  const { searchFilterValue, allStations } = useStore();

  const [filtredStations, setFiltredStations] = useState(allStations);

  useEffect(() => {
    const filtredStations = searchFilterValue
      ? getFiltredStations(allStations, searchFilterValue)
      : allStations;

    setFiltredStations(filtredStations);
  }, [searchFilterValue, allStations]);

  //fuse search returns most approximate results first, so if user has
  //scrolled the page we have to focus on top results
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchFilterValue]);

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
              activeStationRef={isActive ? activeStationElementRef : undefined}
            />
          );
        })}
      </SimpleGrid>
    </Flex>
  );
};

export default Stations;
