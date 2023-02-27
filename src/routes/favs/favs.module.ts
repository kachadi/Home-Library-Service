import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AlbumModule } from 'src/routes/album/album.module';
import { ArtistModule } from 'src/routes/artist/artist.module';
import { TrackModule } from 'src/routes/track/track.module';
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
    forwardRef(() => AuthModule),
  ],
  controllers: [FavsController],
  providers: [FavsService],
  exports: [FavsService],
})
export class FavsModule {}
