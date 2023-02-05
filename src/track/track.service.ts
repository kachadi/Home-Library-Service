import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { isItemExists, isItemUUIDAndExists } from 'src/utils/helpers';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import TrackEntity from './entities/track.entity';

const TRACK = 'Track';
const ARTIST_ID_KEY = 'artistId';
const ALBUM_ID_KEY = 'albumId';
// const TRACK_ID_KEY = 'trackId';

@Injectable()
export class TrackService {
  tracks: TrackEntity[] = [];

  constructor(
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
  ) {}

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    isItemExists(this.tracks, id, TRACK);
    const track = this.tracks.find((track) => track.id === id);
    return track;
  }

  create(createTrackDto: CreateTrackDto) {
    const newTrack = new TrackEntity(createTrackDto);

    if (newTrack.albumId !== null) {
      isItemUUIDAndExists(
        this.albumService.albums,
        newTrack.albumId,
        ALBUM_ID_KEY,
      );
    }
    if (newTrack.artistId !== null) {
      isItemUUIDAndExists(
        this.artistService.artists,
        newTrack.artistId,
        ARTIST_ID_KEY,
      );
    }

    this.tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    isItemExists(this.tracks, id, TRACK);
    const existingTrack = this.tracks.find((track) => track.id === id);
    for (const key in existingTrack) {
      if (updateTrackDto[key]) {
        if (key === ARTIST_ID_KEY) {
          const artistId = updateTrackDto[key];

          isItemUUIDAndExists(
            this.artistService.artists,
            artistId,
            ARTIST_ID_KEY,
          );
        } else if (key === ALBUM_ID_KEY) {
          const albumId = updateTrackDto[key];

          isItemUUIDAndExists(this.albumService.albums, albumId, ALBUM_ID_KEY);
        }

        existingTrack[key] = updateTrackDto[key];
      }
    }
    return existingTrack;
  }

  remove(id: string) {
    const existingTrackId = this.tracks.findIndex((track) => track.id === id);
    isItemExists(this.tracks, id, TRACK);
    this.tracks.splice(existingTrackId, 1);
  }

  getTracksById(tracksIdsArray: string[]) {
    const tracksArray = [];
    tracksIdsArray.forEach((trackId) => {
      const track = this.tracks.filter((track) => track.id === trackId)[0];
      tracksArray.push({
        name: track.name,
        duration: track.duration,
      });
    });
    return tracksArray;
  }
}
