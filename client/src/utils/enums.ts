export enum SOCKET_EVENTS {
  INITIAL_STATIONS_DATA = "INITIAL_STATIONS_DATA",
  STATIONS_UPDATE = "STATIONS_UPDATE",
  FATAL_ERROR = "FATAL_ERROR",
}

export enum searchFilters {
  STATION_NAME = "STATION_NAME",
  ARTIST = "ARTIST",
  SONG_NAME = "SONG_NAME",
}

export enum PLAYER_STATE {
  PAUSED,
  PLAYING,
  LOADING,
}
