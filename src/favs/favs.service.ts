import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';
import { isItemExists } from 'src/utils/helpers';
import { IFavs } from './models/favs.interface';

const ARTIST_ID_KEY = 'artistId';
const ALBUM_ID_KEY = 'albumId';
const TRACK_ID_KEY = 'trackId';
const SUCCESS_MSG = 'Successfully added to favorites😊';

@Injectable()
export class FavsService {
  favs: IFavs = {
    artists: [],
    albums: [],
    tracks: [],
  };

  constructor(
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
  ) {}

  findAll() {
    const favsResponse = {
      artists: [],
      albums: [],
      tracks: [],
    };

    favsResponse.artists = this.artistService.getArtistsById(this.favs.artists);
    favsResponse.albums = this.albumService.getAlbumsById(this.favs.albums);
    favsResponse.tracks = this.trackService.getTracksById(this.favs.tracks);

    return favsResponse;
  }

  addArtistToFavs(id: string) {
    isItemExists(this.artistService.artists, id, ARTIST_ID_KEY, true);
    this.favs.artists.push(id);
    return SUCCESS_MSG;
  }

  addAlbumsToFavs(id: string) {
    isItemExists(this.albumService.albums, id, ALBUM_ID_KEY, true);
    this.favs.albums.push(id);
    return SUCCESS_MSG;
  }

  addTracksToFavs(id: string) {
    isItemExists(this.trackService.tracks, id, TRACK_ID_KEY, true);
    this.favs.tracks.push(id);
    return SUCCESS_MSG;
  }
}
