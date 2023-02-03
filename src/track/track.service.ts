import { Injectable } from '@nestjs/common';
import { isItemExists, isItemIdUUID } from 'src/utils/helpers';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import TrackEntity from './entities/track.entity';

@Injectable()
export class TrackService {
  private tracks: TrackEntity[] = [];

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    const track = this.tracks.find((track) => track.id === id);
    isItemExists(this.tracks, id);
    return track;
  }

  create(createTrackDto: CreateTrackDto) {
    const newTrack = new TrackEntity(createTrackDto);
    this.tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    isItemExists(this.tracks, id);
    const existingTrack = this.tracks.find((track) => track.id === id);
    for (const key in existingTrack) {
      if (updateTrackDto[key]) {
        if (key === 'artistId' || key === 'albumId') {
          isItemIdUUID(updateTrackDto[key]);
        }
        existingTrack[key] = updateTrackDto[key];
      }
    }
    return existingTrack;
  }

  remove(id: string) {
    const existingTrackId = this.tracks.findIndex((track) => track.id === id);
    isItemExists(this.tracks, id);
    this.tracks.splice(existingTrackId, 1);
  }
}
