import React from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import { playerStates } from "../../contexts/PlayerContext";
import PropTypes from "prop-types";
import { IconButton, Icon, keyframes } from "@chakra-ui/react";

const spin = keyframes`
    from {transform: rotate(0deg);}
    to {transform: rotate(360deg);}
`;
const PlayerStateIcon = ({ playerState, icon, ...props }) => {
  const icons = {
    [playerStates.PAUSED]: <FaPlay />,
    [playerStates.PLAYING]: <FaPause />,
    [playerStates.LOADING]: (
      <Icon as={AiOutlineLoading} animation={`${spin} 2s linear infinite`} />
    ),
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

PlayerStateIcon.propTypes = {
  playerState: PropTypes.oneOf([
    playerStates.PLAYING,
    playerStates.LOADING,
    playerStates.PAUSED,
  ]).isRequired,
};
