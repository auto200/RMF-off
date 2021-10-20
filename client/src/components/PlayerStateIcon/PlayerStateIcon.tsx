import { IconButton, IconButtonProps } from "@chakra-ui/react";
import React from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { usePlayer } from "../../contexts/PlayerContext";
import { PLAYER_STATE } from "../../utils/enums";
import { LoadingIcon } from "../../utils/icons";

interface IProps extends IconButtonProps {}

const PlayerStateIcon: React.FC<IProps> = ({ icon, ...props }) => {
  const { playerState } = usePlayer();
  const icons = {
    [PLAYER_STATE.PAUSED]: <FaPlay />,
    [PLAYER_STATE.PLAYING]: <FaPause />,
    [PLAYER_STATE.LOADING]: LoadingIcon,
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
