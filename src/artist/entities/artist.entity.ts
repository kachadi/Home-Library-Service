import { randomUUID } from 'crypto';

export default class ArtistEntity {
  id: string;
  name: string;
  grammy: boolean;

  constructor(artistObj) {
    this.id = randomUUID();
    this.name = artistObj.name;
    this.grammy = artistObj.grammy;
  }
}
