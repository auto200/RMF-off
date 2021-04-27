import React from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { PLAYER_STATES } from "../../contexts/PlayerContext";
import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { LoadingIcon } from "../../utils/icons";

interface IProps extends IconButtonProps {
  playerState: PLAYER_STATES;
}
const PlayerStateIcon: React.FC<IProps> = ({ playerState, icon, ...props }) => {
  const icons = {
    [PLAYER_STATES.PAUSED]: <FaPlay />,
    [PLAYER_STATES.PLAYING]: <FaPause />,
    [PLAYER_STATES.LOADING]: LoadingIcon,
  };

  return (
    <IconButton
      icon={icon || icons[playerState]}
      bg="transparent"
      _hover={{ bg: "transparent" }}
      _active={{ bg: "transparent" }}
      {...props}
    />
  );
};

export default PlayerStateIcon;
