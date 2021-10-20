import React, { createContext, useContext, useEffect, useState } from "react";
import { PLAYER_STATE } from "../utils/enums";
import { Station } from "../utils/interfaces";

const throwNotImplemented = () => {
  throw new Error("Function not implemented");
};

const PlayerContext = createContext<{
  currentStation: Station | null;
  playerState: PLAYER_STATE;
  setPlayerState: (state: PLAYER_STATE) => void;
  changeStation: (stationId: number) => void;
  togglePlayerState: () => void;
}>({
  currentStation: null,
  playerState: PLAYER_STATE.PAUSED,
  setPlayerState: () => throwNotImplemented,
  changeStation: () => throwNotImplemented,
  togglePlayerState: () => throwNotImplemented,
});

const PlayerContextProvider: React.FC<{ stations: Station[] }> = ({
  children,
  stations,
}) => {
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [playerState, setPlayerState] = useState(PLAYER_STATE.PAUSED);

  useEffect(() => {
    if (!currentStation) return;
    const newStationData = stations.find((s) => s.id === currentStation.id);
    if (newStationData) {
      setCurrentStation(newStationData);
    }
  }, [currentStation, stations]);

  const changeStation = (stationId: number) => {
    if (stationId === currentStation?.id) {
      return;
    }
    const newStation = stations.find(({ id }) => id === stationId);
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
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

export default PlayerContextProvider;

export const usePlayer = () => useContext(PlayerContext);
