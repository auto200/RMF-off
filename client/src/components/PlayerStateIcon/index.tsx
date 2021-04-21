import React from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import { PLAYER_STATES } from "../../contexts/PlayerContext";
import { IconButton, Icon, keyframes, IconButtonProps } from "@chakra-ui/react";

const spin = keyframes`
    from {transform: rotate(0deg);}
    to {transform: rotate(360deg);}
`;
interface IProps extends IconButtonProps {
  playerState: PLAYER_STATES;
}
const PlayerStateIcon: React.FC<IProps> = ({ playerState, icon, ...props }) => {
  const icons = {
    [PLAYER_STATES.PAUSED]: <FaPlay />,
    [PLAYER_STATES.PLAYING]: <FaPause />,
    [PLAYER_STATES.LOADING]: (
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
