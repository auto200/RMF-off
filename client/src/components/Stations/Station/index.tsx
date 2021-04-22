import React, { useEffect, useState } from "react";
import PlayerStateIcon from "../../PlayerStateIcon";
import { motion, AnimatePresence } from "framer-motion";
import { FaGoogle, FaYoutube, FaPlay } from "react-icons/fa";
import {
  Box,
  chakra,
  Flex,
  Heading,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useInView } from "react-intersection-observer";
import { BiDotsVerticalRounded, BiLinkExternal } from "react-icons/bi";
import { IStation } from "../../../App";
import { PLAYER_STATES } from "../../../contexts/PlayerContext";

const CoverContainer = chakra(motion.div);

interface IProps extends IStation {
  handleCoverClick: () => void;
  isActive: boolean;
  playerState: PLAYER_STATES;
}

const Station: React.FC<IProps> = ({
  name,
  song,
  playerState,
  isActive,
  handleCoverClick,
}) => {
  const { ref, inView } = useInView();
  const [inViewBackground, setInViewBackground] = useState<string>("");
  const activeTailBackground = useColorModeValue("gray.50", "gray.900");

  const query = encodeURIComponent(`${song.artist} - ${song.name}`);
  console.log("update");
  useEffect(() => {
    if (inView && song.cover !== inViewBackground) {
      setInViewBackground(song.cover);
    }
  }, [inView]);

  return (
    <Flex
      maxW="500px"
      flexDir="column"
      alignItems="center"
      p={1}
      outline={`${isActive ? 4 : 2}px solid`}
      outlineColor={isActive ? "red.400" : "blue.600"}
      bg={isActive ? activeTailBackground : ""}
      transition="background 0.5s"
      ref={ref}
    >
      <Heading isTruncated color="blue.600" maxW="95%" title={name} mb={1}>
        {name}
      </Heading>
      <AnimatePresence exitBeforeEnter>
        <CoverContainer
          key={inViewBackground}
          w="full"
          h="300px"
          pos="relative"
          bgPos="center"
          bgSize="cover"
          bgImage={`url(${inViewBackground})`}
          sx={
            {
              //prevent div flash on tap
              //https://stackoverflow.com/questions/6211959/html5-div-flashes-on-tap
              "-webkit-tap-highlight-color": "rgba(0,0,0,0)",
              //brightness filter
              "&::before": {
                content: "''",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: `rgba(0, 0, 0, ${useColorModeValue(0, 0.3)})`,
                transition: "background-color 0.3s",
              },
            } as React.CSSProperties
          }
          //motion props
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <PlayerStateIcon
            icon={!isActive ? <FaPlay /> : undefined}
            onClick={handleCoverClick}
            playerState={playerState}
            boxSize="full"
            fontSize="70px"
            color="gray.100"
            opacity={isActive ? 0.7 : 0}
            _hover={{ cursor: "pointer", opacity: isActive ? 1 : 0.7 }}
            _focus={{ opacity: 0.7 }}
            transition="opacity 0.3s"
            aria-label={`${isActive ? "Pause" : "Play"} current station`}
          />
        </CoverContainer>
      </AnimatePresence>
      <Flex width="95%">
        <Box flexGrow={1} isTruncated textAlign="center">
          <Text
            fontSize="2xl"
            color={useColorModeValue("gray.700", "gray.300")}
            isTruncated
            py={song.artist ? 0 : 3}
            title={song.name}
          >
            {song.name}
          </Text>
          <Heading
            as="h3"
            fontSize="md"
            color="gray.500"
            isTruncated
            title={song.artist}
          >
            {song.artist}
          </Heading>
        </Box>
        {/* dots menu */}
        <Menu isLazy>
          <MenuButton
            as={IconButton}
            my="auto"
            aria-label="Menu"
            icon={<BiDotsVerticalRounded />}
            isRound={true}
            fontSize="2xl"
            bg="transparent"
          />
          <MenuList py={0}>
            <MenuItem
              as={Link}
              icon={<FaGoogle />}
              h="50px"
              command={((<BiLinkExternal />) as unknown) as string}
              href={`https://www.google.com/search?q=${query}`}
              isExternal
            >
              Szukaj w Google
            </MenuItem>
            <MenuItem
              as={Link}
              icon={<FaYoutube />}
              h="50px"
              command={((<BiLinkExternal />) as unknown) as string}
              href={`https://www.youtube.com/results?search_query=${query}`}
              isExternal
            >
              Szukaj w YouTube
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Station;
