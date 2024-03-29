import { Box, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { Station } from "utils/interfaces";

interface ArtistAndTitleProps {
  song: Station["song"];
}

export const ArtistAndTitle: React.FC<ArtistAndTitleProps> = ({ song }) => {
  const songTitleColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Box flexGrow={1} textAlign="center">
      <Text
        fontSize="2xl"
        color={songTitleColor}
        noOfLines={1}
        py={song.artist ? 0 : 3}
        title={song.name}
      >
        {song.name}
      </Text>
      <Heading
        as="h3"
        fontSize="md"
        color="gray.500"
        noOfLines={1}
        title={song.artist}
      >
        {song.artist}
      </Heading>
    </Box>
  );
};
