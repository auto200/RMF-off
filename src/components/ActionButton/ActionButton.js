import React from "react";
import styled from "styled-components";
import { FaPlay, FaPause } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import { usePlayer, playerStates } from "../../contexts/PlayerContext";

const Wrapper = styled.span`
  animation: ${({ spin }) => spin && "rotate 2s linear infinite"};
  margin: 0;
  padding: 0;
  display: grid;
  place-items: center;
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
const ActionButton = ({ isActive = true }) => {
  const { playerState } = usePlayer();

  const isLoading = playerState === playerStates.LOADING;
  let Component = FaPlay;
  if (!isActive) {
    Component = FaPlay;
  } else if (playerState === playerStates.PLAYING) {
    Component = FaPause;
  } else if (playerState === playerStates.LOADING) {
    Component = AiOutlineLoading;
  }

  return (
    <Wrapper spin={isLoading && isActive}>
      <Component />
    </Wrapper>
  );
};

export default ActionButton;
