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
  coverBig?: string;
  artist?: string;
}
export interface PlayingStationsInfo {
  [key: string]: PlayingSongInfo;
}

export interface Station extends StationBaseInfo {
  song: Omit<PlayingSongInfo, "utwor" | "coverBig">;
}
