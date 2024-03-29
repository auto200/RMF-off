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
const getIconAriaLabel = (playerState: PLAYER_STATE) => {
  switch (playerState) {
    case PLAYER_STATE.LOADING: {
      return "Ładowanie";
    }
    case PLAYER_STATE.PLAYING: {
      return "Pauza";
    }
    case PLAYER_STATE.PAUSED: {
      return "Odtwórz";
    }
  }
};

interface IProps extends Omit<IconButtonProps, "aria-label"> {}

const PlayerStateIcon: React.FC<IProps> = ({ icon, ...props }) => {
  const { playerState } = usePlayer();

  return (
    <IconButton
      icon={icon || icons[playerState]}
      bg="transparent"
      _hover={{ bg: "transparent" }}
      _active={{ bg: "transparent" }}
      aria-label={getIconAriaLabel(playerState)}
      {...props}
    />
  );
};

export default PlayerStateIcon;
