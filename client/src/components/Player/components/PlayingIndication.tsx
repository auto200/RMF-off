import { Progress } from "@chakra-ui/react";
import React from "react";

interface PlayingIndicationProps {
  isPlaying: boolean;
}

const PlayingIndication: React.FC<PlayingIndicationProps> = ({ isPlaying }) => {
  return (
    <Progress
      pos="absolute"
      top={-1}
      w="full"
      size="xs"
      hasStripe
      isAnimated={isPlaying}
      value={100}
    />
  );
};

export default PlayingIndication;
