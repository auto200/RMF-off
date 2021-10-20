export interface Station {
  id: number;
  name: string;
  streamURL: string;
  song: {
    name?: string;
    cover: string;
    artist?: string;
  };
}
