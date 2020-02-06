import React, { createContext, useContext, useState, useEffect } from "react";

const PlayerContext = createContext();

export const playerStates = {
  PAUSED: "PAUSED",
  PLAYING: "PLAYING",
  LOADING: "LOADING"
};

const PlayerContextProvider = ({ children }) => {
  const [station, setStation] = useState({});
  const [currentStationId, setCurrentStationId] = useState("");
  const [playerState, setPlayerState] = useState(playerStates.PAUSED);

  useEffect(() => {
    if (station.id) setCurrentStationId(station.id);
  }, [station]);

  const handleActionButtonClick = (station, isActive) => {
    if (station) {
      setStation(station);
    } else {
      if (playerState === playerStates.LOADING && isActive) return;

      if (playerState === playerStates.PLAYING) {
        setPlayerState(playerStates.PAUSED);
      } else if (playerState === playerStates.PAUSED) {
        setPlayerState(playerStates.PLAYING);
      }
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        station,
        currentStationId,
        playerState,
        setPlayerState,
        handleActionButtonClick
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;

export const usePlayer = () => useContext(PlayerContext);
