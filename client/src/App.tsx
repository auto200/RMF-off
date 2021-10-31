import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import Favicon from "react-favicon";
import "typeface-quicksand";
import Header from "./components/Header";
import Player from "./components/Player";
import Stations from "./components/Stations";
import PlayerContext from "./contexts/PlayerContext";
import { useStore } from "./contexts/StoreContext";
import { HERADER_HEIGHT } from "./utils/constants";
import { LoadingIcon } from "./utils/icons";
import jammingFavicon from "./utils/jammingFavicon";

const App = () => {
  const { isLoading, fatalError } = useStore();
  console.log("app changed lol");

  if (fatalError) {
    return (
      <Box fontSize="6xl" color="red.500" textAlign="center">
        {fatalError}
      </Box>
    );
  }

  return (
    <>
      <Favicon url={jammingFavicon} animated={true} animationDelay={50} />
      <Header />
      {isLoading ? (
        <Flex
          h={`calc(100vh - ${HERADER_HEIGHT}px - 200px)`}
          justifyContent="center"
          alignItems="center"
          fontSize="80px"
          mt="24"
        >
          {LoadingIcon}
        </Flex>
      ) : (
        <PlayerContext>
          <Stations />
          <Player />
        </PlayerContext>
      )}
    </>
  );
};

export default App;
