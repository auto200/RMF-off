import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { PLAYER_STATE } from "utils/enums";
import { throwNotImplemented } from "utils/functions";
import { Station } from "utils/interfaces";
import { useStore } from "./StoreContext";

const PlayerContext = createContext<{
  currentStation: Station | null;
  playerState: PLAYER_STATE;
  setPlayerState: (state: PLAYER_STATE) => void;
  changeStation: (stationId: number) => void;
  togglePlayerState: () => void;
  activeStationElementRef: React.RefObject<HTMLDivElement>;
}>({
  currentStation: null,
  playerState: PLAYER_STATE.PAUSED,
  setPlayerState: () => throwNotImplemented,
  changeStation: () => throwNotImplemented,
  togglePlayerState: () => throwNotImplemented,
  activeStationElementRef: (() => throwNotImplemented) as any,
});

const PlayerContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { allStations } = useStore();
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [playerState, setPlayerState] = useState(PLAYER_STATE.PAUSED);
  const activeStationElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentStation) return;
    const newStationData = allStations.find((s) => s.id === currentStation.id);
    if (newStationData) {
      setCurrentStation(newStationData);
    }
  }, [currentStation, allStations]);

  const changeStation = (stationId: number) => {
    if (stationId === currentStation?.id) {
      return;
    }
    const newStation = allStations.find(({ id }) => id === stationId);
    if (newStation) {
      setCurrentStation(newStation);
      setPlayerState(PLAYER_STATE.LOADING);
    }
  };

  const togglePlayerState = () => {
    if (playerState === PLAYER_STATE.PLAYING) {
      setPlayerState(PLAYER_STATE.PAUSED);
    } else if (playerState === PLAYER_STATE.PAUSED) {
      setPlayerState(PLAYER_STATE.PLAYING);
    }
  };

  const value = {
    currentStation,
    playerState,
    setPlayerState,
    changeStation,
    togglePlayerState,
    activeStationElementRef,
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

export default PlayerContextProvider;

export const usePlayer = () => useContext(PlayerContext);
