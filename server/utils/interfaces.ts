export interface StationBase {
  id: number;
  name: string;
  streamURL: string;
  cover: string;
}

interface Song {
  name?: string;
  utwor?: string;
  cover?: string;
  coverBigUrl?: string;
  artist?: string;
}

export interface Station extends StationBase {
  song: Omit<Song, "utwor" | "coverBigUrl">;
}

export interface RadioIdToPlayingSongMap {
  [key: string]: Song;
}
