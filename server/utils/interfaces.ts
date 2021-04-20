export interface StationBaseInfo {
  id: number;
  name: string;
  streamURL: string;
  cover: string;
}

interface PlayingSongInfo {
  name?: string;
  utwor?: string;
  cover?: string;
  coverBigUrl?: string;
  artist?: string;
}

export interface Station extends Omit<StationBaseInfo, "cover"> {
  song: Omit<PlayingSongInfo, "utwor" | "coverBigUrl">;
}

export interface PlayingStationsInfo {
  [key: string]: PlayingSongInfo;
}
