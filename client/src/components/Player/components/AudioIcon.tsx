import { IconButton } from "@chakra-ui/button";
import { FaVolumeDown, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const icons = {
  high: FaVolumeUp,
  mid: FaVolumeDown,
  muted: FaVolumeMute,
};

type AudioIconProps = {
  volume: number;
} & any;

const AudioIcon: React.FC<AudioIconProps> = ({ volume, ...rest }) => {
  let Icon = icons.mid;

  if (volume > 50) Icon = icons.high;
  else if (volume > 0) Icon = icons.mid;
  else Icon = icons.muted;

  return (
    <IconButton
      icon={<Icon cursor="pointer" />}
      aria-label="Przełącz wyciszenie"
      bg="transparent"
      _hover={{ bg: "transparent" }}
      _active={{ bg: "transparent" }}
      fontSize="4xl"
      {...rest}
    />
  );
};

export default AudioIcon;
