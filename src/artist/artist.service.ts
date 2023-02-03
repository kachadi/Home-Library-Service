import { Injectable } from '@nestjs/common';
import { isItemExists } from 'src/utils/helpers';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import ArtistEntity from './entities/artist.entity';

@Injectable()
export class ArtistService {
  private artists: ArtistEntity[] = [];

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    isItemExists(this.artists, id);
    const artist = this.artists.find((artist) => artist.id === id);
    return artist;
  }

  create(createArtistDto: CreateArtistDto) {
    const newArtist = new ArtistEntity(createArtistDto);
    this.artists.push(newArtist);
    return newArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    isItemExists(this.artists, id);
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
    isItemExists(this.artists, id);
    this.artists.splice(existingArtistId, 1);
  }
}
