import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import {
  isItemExists,
  nullifyItemFromOtherCollections,
} from 'src/utils/helpers';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import ArtistEntity from './entities/artist.entity';

const ARTIST = 'Artist';
const ARTIST_ID_KEY = 'artistId';

@Injectable()
export class ArtistService {
  artists: ArtistEntity[] = [];

  constructor(
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
  ) {}

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    isItemExists(this.artists, id, ARTIST);
    const artist = this.artists.find((artist) => artist.id === id);
    return artist;
  }

  create(createArtistDto: CreateArtistDto) {
    const newArtist = new ArtistEntity(createArtistDto);
    this.artists.push(newArtist);
    return newArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    isItemExists(this.artists, id, ARTIST);
    const existingArtist = this.artists.find((artist) => artist.id === id);
    for (const key in existingArtist) {
      if (updateArtistDto.grammy === false) {
        existingArtist.grammy = updateArtistDto.grammy;
      } else if (updateArtistDto[key]) {
        existingArtist[key] = updateArtistDto[key];
      }
    }
    return existingArtist;
  }

  remove(id: string) {
    const existingArtistId = this.artists.findIndex(
      (artist) => artist.id === id,
    );
    isItemExists(this.artists, id, ARTIST);
    this.artists.splice(existingArtistId, 1);
    nullifyItemFromOtherCollections(
      [this.trackService.tracks, this.albumService.albums],
      ARTIST_ID_KEY,
      id,
    );
  }
}
