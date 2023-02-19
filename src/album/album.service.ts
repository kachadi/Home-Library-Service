import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistService } from 'src/artist/artist.service';
import { FavsService } from 'src/favs/favs.service';
import { TrackService } from 'src/track/track.service';
import { ResoursesIdKeys, ResoursesNames } from 'src/utils/constants';
import { isItemExists, isItemIdUUID } from 'src/utils/helpers';
import { Repository } from 'typeorm';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import AlbumEntity from './entities/album.entity';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumEntity)
    private albumRepository: Repository<AlbumEntity>,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
  ) {}

  async findAll() {
    return await this.albumRepository.find();
  }

  async findOne(albumId: string) {
    await isItemExists(this.albumRepository, albumId, ResoursesNames.ALBUM);
    const album = await this.albumRepository.findOne({
      where: { id: albumId },
    });
    return album;
  }

  async create(createAlbumDto: CreateAlbumDto) {
    const createdAlbum = this.albumRepository.create(createAlbumDto);

    if (createdAlbum.artistId !== null) {
      await this.artistService.checkArtistExists(createdAlbum.artistId);
    }
    const newAlbum = await this.albumRepository.save(createdAlbum);
    return newAlbum;
  }

  async update(albumId: string, updateAlbumDto: UpdateAlbumDto) {
    await isItemExists(this.albumRepository, albumId, ResoursesNames.ALBUM);
    const album = await this.albumRepository.findOne({
      where: { id: albumId },
    });

    for (const key in album) {
      if (updateAlbumDto[key]) {
        if (key === ResoursesIdKeys.ARTIST_ID) {
          const artistId = updateAlbumDto[key];
          isItemIdUUID(artistId);
          await this.artistService.checkArtistExists(artistId);
        }
        album[key] = updateAlbumDto[key];
      }
    }

    const updatedAlbum = await this.albumRepository.save(album);

    return updatedAlbum;
  }

  async remove(albumId: string) {
    await isItemExists(this.albumRepository, albumId, ResoursesNames.ALBUM);
    await this.albumRepository.delete(albumId);
  }

  async getAlbumsById(albumsIdsArray: string[]) {
    const albumsArray = [];

    albumsIdsArray.forEach(async (albumId) => {
      const album = await this.albumRepository.find({
        where: { id: albumId },
      })[0];
      albumsArray.push(album);
    });

    return albumsArray;
  }

  async checkAlbumExists(albumId: string, isFavs = false) {
    await isItemExists(
      this.albumRepository,
      albumId,
      ResoursesNames.ALBUM,
      isFavs,
    );
  }
}
