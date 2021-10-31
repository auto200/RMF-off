import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { usePlayer } from "contexts/PlayerContext";
import React from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { PLAYER_STATE } from "utils/enums";
import { LoadingIcon } from "utils/icons";

const icons = {
  [PLAYER_STATE.PAUSED]: <FaPlay />,
  [PLAYER_STATE.PLAYING]: <FaPause />,
  [PLAYER_STATE.LOADING]: LoadingIcon,
};

interface IProps extends IconButtonProps {}

const PlayerStateIcon: React.FC<IProps> = ({ icon, ...props }) => {
  const { playerState } = usePlayer();

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
