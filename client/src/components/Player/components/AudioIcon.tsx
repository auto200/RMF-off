import { FaVolumeDown, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

interface AudioIconProps {
  volume: number;
}

const AudioIcon: React.FC<AudioIconProps> = ({ volume }) => {
  if (volume === 0) {
    return <FaVolumeMute />;
  } else if (volume > 0 && volume < 51) {
    return <FaVolumeDown />;
  } else {
    return <FaVolumeUp />;
  }
};

export default AudioIcon;
