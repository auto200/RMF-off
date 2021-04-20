import React from "react";
import PlayerStateIcon from "../../PlayerStateIcon";
import { motion, AnimatePresence } from "framer-motion";
import { FaGoogle, FaYoutube, FaPlay } from "react-icons/fa";
import PropTypes from "prop-types";
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

const CoverContainer = chakra(motion.div);

const Tail: React.FC<IStation> = ({
  name,
  song,
  streamURL,
  //player props
  // id,
  // isActive,
  // handleActionButtonClick,
  // playerState,
}) => {
  // const { ref, inView } = useInView();
  const activeTailBackground = useColorModeValue("gray.50", "gray.900");

  // const handleCoverClick = () => {
  //   if (isActive) {
  //     handleActionButtonClick(null, true);
  //   } else {
  //     handleActionButtonClick({
  //       id,
  //       stationName,
  //       cover,
  //       songName,
  //       artist,
  //       streamURL,
  //     });
  //   }
  // };

  const query = encodeURIComponent(`${song.artist} - ${song.name}`);

  const isActive = false; // DELETE ME
  return (
    <Flex
      maxW="500px"
      pos="relative"
      flexDir="column"
      alignItems="center"
      p={1}
      // m={5}
      outline={`${isActive ? 4 : 2}px solid`}
      outlineColor={isActive ? "red.400" : "blue.600"}
      // bg={isActive && activeTailBackground}
      transition="background 0.5s"
      // ref={ref}
    >
      <Heading
        isTruncated
        color="blue.600"
        maxW="95%"
        title={name}
        mb={1}
        style={{ opacity: 1 }}
      >
        {name}
      </Heading>
      <AnimatePresence exitBeforeEnter>
        <CoverContainer
          // key={inView && song.name} // TODO: use `cover` as a key
          w="full"
          h="300px"
          pos="relative"
          bgPos="center"
          bgSize="cover"
          //brightness filter
          sx={{
            // backgroundImage: inView ? `url(${cover})` : "",
            backgroundImage: `url(${song.cover})`,
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
          }}
          //motion props
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* <PlayerStateIcon
            icon={!isActive && <FaPlay />}
            onClick={handleCoverClick}
            playerState={playerState}
            boxSize="full"
            fontSize="70px"
            color="gray.100"
            opacity={isActive ? 0.7 : 0}
            _hover={{ cursor: "pointer", opacity: !isActive && 0.7 }}
            _focus={{ opacity: 0.7 }}
            transition="opacity 0.3s"
          /> */}
        </CoverContainer>
      </AnimatePresence>
      <Flex width="95%">
        <Box flexGrow={1} isTruncated textAlign="center">
          <Text
            fontSize="2xl"
            color={useColorModeValue("gray.700", "gray.300")}
            isTruncated
            py={!song.artist ? 3 : 0}
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
        {/* <Menu bg="gray.600" isLazy> */}
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

export default Tail;
