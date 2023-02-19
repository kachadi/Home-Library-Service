import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumModule } from 'src/album/album.module';
import { ArtistModule } from 'src/artist/artist.module';
import { TrackModule } from 'src/track/track.module';
import FavsAlbumsEntity from './entities/favsAlbums.entity';
import FavsArtistsEntity from './entities/favsArtists.entity';
import FavsTracksEntity from './entities/favsTracks.entity';
import { FavsController } from './favs.controller';
import { FavsService } from './favs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FavsArtistsEntity,
      FavsAlbumsEntity,
      FavsTracksEntity,
    ]),
    forwardRef(() => ArtistModule),
    forwardRef(() => AlbumModule),
    forwardRef(() => TrackModule),
  ],
  controllers: [FavsController],
  providers: [FavsService],
  exports: [FavsService],
})
export class FavsModule {}
