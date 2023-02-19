import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { FavsService } from 'src/favs/favs.service';
import { ResoursesIdKeys, ResoursesNames } from 'src/utils/constants';
import { isItemExists, isItemIdUUID } from 'src/utils/helpers';
import { Repository } from 'typeorm';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import TrackEntity from './entities/track.entity';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(TrackEntity)
    private trackRepository: Repository<TrackEntity>,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
  ) {}

  async findAll() {
    return await this.trackRepository.find();
  }

  async findOne(trackId: string) {
    await isItemExists(this.trackRepository, trackId, ResoursesNames.TRACK);
    const track = await this.trackRepository.findOne({
      where: { id: trackId },
    });
    return track;
  }

  async create(createTrackDto: CreateTrackDto) {
    const createdTrack = this.trackRepository.create(createTrackDto);

    if (createdTrack.albumId !== null) {
      await this.albumService.checkAlbumExists(createdTrack.albumId);
    }
    if (createdTrack.artistId !== null) {
      await this.artistService.checkArtistExists(createdTrack.artistId);
    }

    const newTrack = await this.trackRepository.save(createdTrack);

    return newTrack;
  }

  async update(trackId: string, updateTrackDto: UpdateTrackDto) {
    await isItemExists(this.trackRepository, trackId, ResoursesNames.TRACK);

    const track = await this.trackRepository.findOne({
      where: { id: trackId },
    });

    for (const key in track) {
      if (updateTrackDto[key]) {
        if (key === ResoursesIdKeys.ARTIST_ID) {
          const artistId = updateTrackDto[key];
          isItemIdUUID(artistId);
          await this.artistService.checkArtistExists(artistId);
        } else if (key === ResoursesIdKeys.ALBUM_ID) {
          const albumId = updateTrackDto[key];
          isItemIdUUID(albumId);
          await this.albumService.checkAlbumExists(albumId);
        }

        track[key] = updateTrackDto[key];
      }
    }

    const updatedTrack = await this.trackRepository.save(track);

    return updatedTrack;
  }

  async remove(trackId: string) {
    await isItemExists(this.trackRepository, trackId, ResoursesNames.TRACK);
    await this.trackRepository.delete(trackId);
  }

  async getTracksById(tracksIdsArray: string[]) {
    const tracksArray = [];

    tracksIdsArray.forEach(async (trackId) => {
      const track = await this.trackRepository.find({
        where: { id: trackId },
      })[0];
      tracksArray.push(track);
    });

    return tracksArray;
  }

  async checkTrackExists(trackId: string, isFavs = false) {
    await isItemExists(
      this.trackRepository,
      trackId,
      ResoursesNames.TRACK,
      isFavs,
    );
  }
}
