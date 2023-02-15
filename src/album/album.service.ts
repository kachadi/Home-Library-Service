import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ArtistService } from 'src/artist/artist.service';
import { FavsService } from 'src/favs/favs.service';
import { TrackService } from 'src/track/track.service';
import { ResoursesIdKeys, ResoursesNames } from 'src/utils/constants';
import {
  isItemExists,
  isItemUUIDAndExists,
  nullifyItemFromOtherCollections,
  removeItemFromFavs,
} from 'src/utils/helpers';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import AlbumEntity from './entities/album.entity';

@Injectable()
export class AlbumService {
  albums: AlbumEntity[] = [];

  constructor(
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
  ) {}

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    isItemExists(this.albums, id, ResoursesNames.ALBUM);
    const album = this.albums.find((album) => album.id === id);
    return album;
  }

  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = new AlbumEntity(createAlbumDto);

    if (newAlbum.artistId !== null) {
      isItemUUIDAndExists(
        this.artistService.artists,
        newAlbum.artistId,
        ResoursesIdKeys.ARTIST_ID,
      );
    }

    this.albums.push(newAlbum);
    return newAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    isItemExists(this.albums, id, ResoursesNames.ALBUM);

    const existingAlbum = this.albums.find((album) => album.id === id);

    for (const key in existingAlbum) {
      if (updateAlbumDto[key]) {
        if (key === ResoursesIdKeys.ARTIST_ID) {
          const artistId = updateAlbumDto[key];

          isItemUUIDAndExists(
            this.artistService.artists,
            artistId,
            ResoursesIdKeys.ARTIST_ID,
          );
        }
        existingAlbum[key] = updateAlbumDto[key];
      }
    }

    return existingAlbum;
  }

  remove(id: string) {
    const existingAlbumId = this.albums.findIndex((album) => album.id === id);

    isItemExists(this.albums, id, ResoursesNames.ALBUM);

    this.albums.splice(existingAlbumId, 1);

    nullifyItemFromOtherCollections(
      [this.trackService.tracks],
      ResoursesIdKeys.ALBUM_ID,
      id,
    );

    removeItemFromFavs(
      this.favsService.favs.albums,
      id,
      ResoursesIdKeys.ALBUM_ID,
    );
  }

  getAlbumsById(albumsIdsArray: string[]) {
    const albumsArray = [];

    albumsIdsArray.forEach((albumId) => {
      const album = this.albums.filter((album) => album.id === albumId)[0];
      albumsArray.push(album);
    });

    return albumsArray;
  }
}
