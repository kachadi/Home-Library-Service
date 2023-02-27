import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AlbumModule } from 'src/routes/album/album.module';
import { FavsModule } from 'src/routes/favs/favs.module';
import { TrackModule } from 'src/routes/track/track.module';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import ArtistEntity from './entities/artist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArtistEntity]),
    forwardRef(() => TrackModule),
    forwardRef(() => AlbumModule),
    forwardRef(() => FavsModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
