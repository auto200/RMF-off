import { Box, Text } from "@chakra-ui/layout";
import React from "react";

interface SongNameAndArtistProps {
  songName?: string;
  artist?: string;
}

const SongNameAndArtist: React.FC<SongNameAndArtistProps> = ({
  songName,
  artist,
}) => {
  return (
    <Box px={2} noOfLines={0} flex="1">
      <Text
        my={1}
        m={0}
        fontWeight="bold"
        fontSize="xl"
        color="gray.200"
        noOfLines={0}
      >
        {songName}
      </Text>
      <Text
        my={1}
        m={0}
        fontWeight="bold"
        fontSize="sm"
        color="gray.500"
        noOfLines={0}
      >
        {artist}
      </Text>
    </Box>
  );
};

export default SongNameAndArtist;
