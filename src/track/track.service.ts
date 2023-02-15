import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { FavsService } from 'src/favs/favs.service';
import { ResoursesIdKeys, ResoursesNames } from 'src/utils/constants';
import {
  isItemExists,
  isItemUUIDAndExists,
  removeItemFromFavs,
} from 'src/utils/helpers';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import TrackEntity from './entities/track.entity';

@Injectable()
export class TrackService {
  tracks: TrackEntity[] = [];

  constructor(
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
  ) {}

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    isItemExists(this.tracks, id, ResoursesNames.TRACK);
    const track = this.tracks.find((track) => track.id === id);
    return track;
  }

  create(createTrackDto: CreateTrackDto) {
    const newTrack = new TrackEntity(createTrackDto);

    if (newTrack.albumId !== null) {
      isItemUUIDAndExists(
        this.albumService.albums,
        newTrack.albumId,
        ResoursesIdKeys.ALBUM_ID,
      );
    }
    if (newTrack.artistId !== null) {
      isItemUUIDAndExists(
        this.artistService.artists,
        newTrack.artistId,
        ResoursesIdKeys.ARTIST_ID,
      );
    }

    this.tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    isItemExists(this.tracks, id, ResoursesNames.TRACK);

    const existingTrack = this.tracks.find((track) => track.id === id);

    for (const key in existingTrack) {
      if (updateTrackDto[key]) {
        if (key === ResoursesIdKeys.ARTIST_ID) {
          const artistId = updateTrackDto[key];

          isItemUUIDAndExists(
            this.artistService.artists,
            artistId,
            ResoursesIdKeys.ARTIST_ID,
          );
        } else if (key === ResoursesIdKeys.ALBUM_ID) {
          const albumId = updateTrackDto[key];

          isItemUUIDAndExists(
            this.albumService.albums,
            albumId,
            ResoursesIdKeys.ALBUM_ID,
          );
        }

        existingTrack[key] = updateTrackDto[key];
      }
    }
    return existingTrack;
  }

  remove(id: string) {
    const existingTrackId = this.tracks.findIndex((track) => track.id === id);

    isItemExists(this.tracks, id, ResoursesNames.TRACK);

    this.tracks.splice(existingTrackId, 1);

    removeItemFromFavs(
      this.favsService.favs.tracks,
      id,
      ResoursesIdKeys.TRACK_ID,
    );
  }

  getTracksById(tracksIdsArray: string[]) {
    const tracksArray = [];

    tracksIdsArray.forEach((trackId) => {
      const track = this.tracks.filter((track) => track.id === trackId)[0];
      tracksArray.push(track);
    });

    return tracksArray;
  }
}
