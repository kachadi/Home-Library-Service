import { Injectable } from '@nestjs/common';
import { isItemExists, isItemIdUUID } from 'src/utils/helpers';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import AlbumEntity from './entities/album.entity';

@Injectable()
export class AlbumService {
  private albums: AlbumEntity[] = [];

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    isItemExists(this.albums, id);
    const album = this.albums.find((album) => album.id === id);
    return album;
  }

  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = new AlbumEntity(createAlbumDto);
    this.albums.push(newAlbum);
    return newAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    isItemExists(this.albums, id);
    const existingAlbum = this.albums.find((album) => album.id === id);
    for (const key in existingAlbum) {
      if (updateAlbumDto[key]) {
        if (key === 'artistId') {
          isItemIdUUID(updateAlbumDto[key]);
        }
        existingAlbum[key] = updateAlbumDto[key];
      }
    }
    return existingAlbum;
  }

  remove(id: string) {
    const existingAlbumId = this.albums.findIndex((album) => album.id === id);
    isItemExists(this.albums, id);
    this.albums.splice(existingAlbumId, 1);
  }
}
