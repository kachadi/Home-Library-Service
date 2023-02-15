import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import AlbumEntity from 'src/album/entities/album.entity';
import { ArtistService } from 'src/artist/artist.service';
import ArtistEntity from 'src/artist/entities/artist.entity';
import TrackEntity from 'src/track/entities/track.entity';
import { TrackService } from 'src/track/track.service';
import { ResoursesIdKeys, ResoursesNames } from 'src/utils/constants';
import {
  isItemExists,
  removeItemFromFavs,
  successResponse,
} from 'src/utils/helpers';
import { IFavs } from './models/favs.interface';

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
    const favsResponse: {
      artists: ArtistEntity[] | undefined[];
      albums: AlbumEntity[] | undefined[];
      tracks: TrackEntity[] | undefined[];
    } = {
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
    isItemExists(this.artistService.artists, id, ResoursesNames.ARTIST, true);
    this.favs.artists.push(id);
    return successResponse(ResoursesNames.ARTIST, id);
  }

  addAlbumsToFavs(id: string) {
    isItemExists(this.albumService.albums, id, ResoursesNames.ALBUM, true);
    this.favs.albums.push(id);
    return successResponse(ResoursesNames.ALBUM, id);
  }

  addTracksToFavs(id: string) {
    isItemExists(this.trackService.tracks, id, ResoursesNames.TRACK, true);
    this.favs.tracks.push(id);
    return successResponse(ResoursesNames.TRACK, id);
  }

  removeTrackFromFavs(id: string) {
    removeItemFromFavs(this.favs.tracks, id, ResoursesIdKeys.TRACK_ID, true);
  }

  removeArtistFromFavs(id: string) {
    removeItemFromFavs(this.favs.artists, id, ResoursesIdKeys.ARTIST_ID, true);
  }

  removeAlbumFromFavs(id: string) {
    removeItemFromFavs(this.favs.albums, id, ResoursesIdKeys.ALBUM_ID, true);
  }
}
