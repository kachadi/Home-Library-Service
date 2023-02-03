import { randomUUID } from 'crypto';

export default class TrackEntity {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;

  constructor(trackObj) {
    this.id = randomUUID();
    this.name = trackObj.name;
    this.artistId = null;
    this.albumId = null;
    this.duration = trackObj.duration;
  }
}
