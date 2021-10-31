import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { IS_DEV, SOCKET_URL } from "utils/constants";
import { SOCKET_EVENTS } from "utils/enums";
import { throwNotImplemented } from "utils/functions";
import { Station } from "utils/interfaces";

interface Store {
  isLoading: boolean;
  fatalError: null | string;
  allStations: Station[];
  searchFilterValue: string;
  setSearchFilterValue: (value: string) => void;
}

const StoreContext = createContext<Store>({
  isLoading: true,
  fatalError: null,
  allStations: [],
  searchFilterValue: "",
  setSearchFilterValue: throwNotImplemented,
});

const StoreContextProvider: React.FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [fatalError, setFatalError] = useState<null | string>(null);
  const [allStations, setAllStations] = useState<Station[]>([]);
  const [searchFilterValue, setSearchFilterValue] = useState("");

  useEffect(() => {
    const socket = io(SOCKET_URL as string);

    socket.on(SOCKET_EVENTS.INITIAL_STATIONS_DATA, (stations: Station[]) => {
      setAllStations(stations);
    });

    socket.on(SOCKET_EVENTS.STATIONS_UPDATE, (changedStations: Station[]) => {
      setAllStations((prevStations) => {
        const newStations = [...prevStations];
        changedStations.forEach((changedStation) => {
          const stationToUpdateIndex = prevStations.findIndex(
            (prevStation) => prevStation.id === changedStation.id
          );
          if (stationToUpdateIndex > -1) {
            newStations[stationToUpdateIndex] = changedStation;
          }
        });
        return newStations;
      });
    });

    socket.on(SOCKET_EVENTS.FATAL_ERROR, (msg: string) => {
      setFatalError(msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (allStations.length === 0) {
      setIsLoading(true);
    }
    setIsLoading(false);
  }, [allStations]);

  //My production server goes to "sleep mode" if no requests are made, (cron job
  //does not help) and there's a cold start, heres a quick dirty fix
  useEffect(() => {
    if (IS_DEV) return;

    setTimeout(() => {
      setAllStations((stations) => {
        if (stations.length === 0) {
          window.location.reload();
        }

        return stations;
      });
    }, 3000);
  }, []);

  const value = {
    isLoading,
    fatalError,
    allStations,
    searchFilterValue,
    setSearchFilterValue,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export default StoreContextProvider;

export const useStore = () => useContext(StoreContext);
