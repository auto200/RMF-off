import React from "react";
import styled from "styled-components";
import { FaPlay, FaPause } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import { playerStates } from "../../contexts/PlayerContext";
import PropTypes from "prop-types";

const LoadingButton = styled(AiOutlineLoading)`
  animation: rotate 2s linear infinite;

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
const ActionButton = ({ playerState, ...props }) => {
  let Button;

  if (playerState === playerStates.PAUSED) {
    Button = FaPlay;
  } else if (playerState === playerStates.PLAYING) {
    Button = FaPause;
  } else if (playerState === playerStates.LOADING) {
    Button = LoadingButton;
  }

  return <Button {...props} />;
};

export default ActionButton;

ActionButton.propTypes = {
  playerState: PropTypes.oneOf([
    playerStates.PLAYING,
    playerStates.LOADING,
    playerStates.PAUSED
  ]).isRequired
};
