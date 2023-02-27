import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumService } from 'src/routes/album/album.service';
import { FavsService } from 'src/routes/favs/favs.service';
import { TrackService } from 'src/routes/track/track.service';
import { ResoursesNames } from 'src/utils/constants';
import { isItemExists } from 'src/utils/helpers';
import { Repository } from 'typeorm';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import ArtistEntity from './entities/artist.entity';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(ArtistEntity)
    private artistRepository: Repository<ArtistEntity>,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
  ) {}

  async findAll() {
    return await this.artistRepository.find();
  }

  async findOne(artistId: string) {
    await isItemExists(this.artistRepository, artistId, ResoursesNames.ARTIST);

    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
    });

    return artist;
  }

  async create(createArtistDto: CreateArtistDto) {
    const createdAlbum = this.artistRepository.create(createArtistDto);

    const newArtist = await this.artistRepository.save(createdAlbum);
    return newArtist;
  }

  async update(artistId: string, updateArtistDto: UpdateArtistDto) {
    await isItemExists(this.artistRepository, artistId, ResoursesNames.ARTIST);

    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
    });

    for (const key in artist) {
      if (updateArtistDto.grammy === false) {
        artist.grammy = updateArtistDto.grammy;
      } else if (updateArtistDto[key]) {
        artist[key] = updateArtistDto[key];
      }
    }

    const updatedArtist = await this.artistRepository.save(artist);

    return updatedArtist;
  }

  async remove(artistId: string) {
    await isItemExists(this.artistRepository, artistId, ResoursesNames.ARTIST);
    await this.artistRepository.delete(artistId);
  }

  async getArtistsById(artistIdsArray: string[]) {
    const artistsArray = [];

    artistIdsArray.forEach(async (artistId) => {
      const artist = await this.artistRepository.find({
        where: { id: artistId },
      })[0];
      artistsArray.push(artist);
    });

    return artistsArray;
  }

  async checkArtistExists(artistId: string, isFavs = false) {
    await isItemExists(
      this.artistRepository,
      artistId,
      ResoursesNames.ARTIST,
      isFavs,
    );
  }
}
