import { chakra, Flex, Heading, useColorModeValue } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import { Station as IStation } from "../../../utils/interfaces";
import PlayerStateIcon from "../../PlayerStateIcon";
import { ArtistAndTitle, Menu } from "./components";

const CoverContainer = chakra(motion.div);
const darkModeCoverFilter = {
  //prevent div flash on tap
  //https://stackoverflow.com/questions/6211959/html5-div-flashes-on-tap
  WebkitTapHighlightColor: "rgba(0,0,0,0)",
  //brightness filter
  "&::before": {
    content: "''",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: `rgba(0, 0, 0, 0.3)`,
    transition: "background-color 0.3s",
  },
};

interface IProps extends IStation {
  play: () => void;
  isActive: boolean;
}

const Station: React.FC<IProps> = ({ name, song, isActive, play }) => {
  const { ref, inView } = useInView();
  const stationActiveBackground = useColorModeValue("gray.50", "gray.900");
  const coverFilter = useColorModeValue(undefined, darkModeCoverFilter);
  const [coverSrc, setCoverSrc] = useState("");

  //trigger animation for the first time that cover is in view and every time
  //cover source changes
  useEffect(() => {
    if (inView && song.cover !== coverSrc) {
      setCoverSrc(song.cover);
    }
  }, [inView, song.cover, coverSrc]);

  return (
    <Flex
      maxW="500px"
      h="410px"
      flexDir="column"
      alignItems="center"
      p={1}
      outline={`${isActive ? 4 : 2}px solid`}
      outlineColor={isActive ? "red.400" : "blue.600"}
      bg={isActive ? stationActiveBackground : ""}
      transition="background 0.5s"
    >
      <Heading isTruncated color="blue.600" maxW="95%" title={name} mb={1}>
        {name}
      </Heading>
      <AnimatePresence exitBeforeEnter>
        <CoverContainer
          key={coverSrc}
          ref={ref}
          w="full"
          h="300px"
          pos="relative"
          bgPos="center"
          bgSize="cover"
          style={{ backgroundImage: `url(${coverSrc})` }}
          sx={coverFilter}
          //motion props
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <PlayerStateIcon
            icon={!isActive ? <FaPlay /> : undefined}
            onClick={play}
            boxSize="full"
            fontSize="70px"
            color="gray.100"
            cursor="pointer"
            opacity={isActive ? 0.7 : 0}
            _hover={{ opacity: isActive ? 1 : 0.7 }}
            _focus={{ opacity: 0.7 }}
            transition="opacity 0.3s"
            aria-label={`${isActive ? "Pause" : "Play"} current station`}
          />
        </CoverContainer>
      </AnimatePresence>
      <Flex width="95%">
        <ArtistAndTitle song={song} />
        <Menu searchTerm={`${song.artist} - ${song.name}`} />
      </Flex>
    </Flex>
  );
};

export default Station;
