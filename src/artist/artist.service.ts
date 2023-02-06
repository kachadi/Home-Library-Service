import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { FavsService } from 'src/favs/favs.service';
import { TrackService } from 'src/track/track.service';
import { ResoursesIdKeys, ResoursesNames } from 'src/utils/constants';
import {
  isItemExists,
  nullifyItemFromOtherCollections,
  removeItemFromFavs,
} from 'src/utils/helpers';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import ArtistEntity from './entities/artist.entity';

@Injectable()
export class ArtistService {
  artists: ArtistEntity[] = [];

  constructor(
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
  ) {}

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    isItemExists(this.artists, id, ResoursesNames.ARTIST);
    const artist = this.artists.find((artist) => artist.id === id);
    return artist;
  }

  create(createArtistDto: CreateArtistDto) {
    const newArtist = new ArtistEntity(createArtistDto);
    this.artists.push(newArtist);
    return newArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    isItemExists(this.artists, id, ResoursesNames.ARTIST);

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

    isItemExists(this.artists, id, ResoursesNames.ARTIST);

    this.artists.splice(existingArtistId, 1);

    nullifyItemFromOtherCollections(
      [this.trackService.tracks, this.albumService.albums],
      ResoursesIdKeys.ARTIST_ID,
      id,
    );

    removeItemFromFavs(
      this.favsService.favs.artists,
      id,
      ResoursesIdKeys.ARTIST_ID,
    );
  }

  getArtistsById(artistIdsArray: string[]) {
    const artistsArray = [];

    artistIdsArray.forEach((artistId) => {
      console.log(artistId);
      const artist = this.artists.filter((artist) => artist.id === artistId)[0];
      artistsArray.push(artist);
    });

    return artistsArray;
  }
}
