export enum RMFON_ENDPOINTS {
  STATIONS_BASE = "http://rmfon.pl/json/app.txt",
  CURRENTLY_PLAYING = "https://www.rmfon.pl/stacje/ajax_playing_main.txt",
}

export const FETCH_CURRENTLY_PLAYING_SONGS_INTERVAL = 15000;

export enum SOCKET_EVENTS {
  INITIAL_STATIONS_DATA = "INITIAL_STATIONS_DATA",
  STATIONS_UPDATE = "STATIONS_UPDATE",
  FATAL_ERROR = "FATAL_ERROR",
}
