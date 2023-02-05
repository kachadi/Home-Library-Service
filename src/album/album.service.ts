import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';
import {
  isItemExists,
  isItemUUIDAndExists,
  nullifyItemFromOtherCollections,
} from 'src/utils/helpers';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import AlbumEntity from './entities/album.entity';

const ALBUM = 'Album';
const ARTIST_ID_KEY = 'artistId';
const ALBUM_ID_KEY = 'albumId';

@Injectable()
export class AlbumService {
  albums: AlbumEntity[] = [];

  constructor(
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
  ) {}

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    isItemExists(this.albums, id, ALBUM);
    const album = this.albums.find((album) => album.id === id);
    return album;
  }

  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = new AlbumEntity(createAlbumDto);

    if (newAlbum.artistId !== null) {
      isItemUUIDAndExists(
        this.artistService.artists,
        newAlbum.artistId,
        ARTIST_ID_KEY,
      );
    }

    this.albums.push(newAlbum);
    return newAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    isItemExists(this.albums, id, ALBUM);
    const existingAlbum = this.albums.find((album) => album.id === id);
    for (const key in existingAlbum) {
      if (updateAlbumDto[key]) {
        if (key === ARTIST_ID_KEY) {
          const artistId = updateAlbumDto[key];

          isItemUUIDAndExists(
            this.artistService.artists,
            artistId,
            ARTIST_ID_KEY,
          );
        }
        existingAlbum[key] = updateAlbumDto[key];
      }
    }
    return existingAlbum;
  }

  remove(id: string) {
    const existingAlbumId = this.albums.findIndex((album) => album.id === id);
    isItemExists(this.albums, id, ALBUM);
    this.albums.splice(existingAlbumId, 1);
    nullifyItemFromOtherCollections(
      [this.trackService.tracks],
      ALBUM_ID_KEY,
      id,
    );
  }
}
