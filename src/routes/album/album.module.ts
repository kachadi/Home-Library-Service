import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ArtistModule } from 'src/routes/artist/artist.module';
import ArtistEntity from 'src/routes/artist/entities/artist.entity';
import { FavsModule } from 'src/routes/favs/favs.module';
import { TrackModule } from 'src/routes/track/track.module';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import AlbumEntity from './entities/album.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlbumEntity, ArtistEntity]),
    forwardRef(() => TrackModule),
    forwardRef(() => ArtistModule),
    forwardRef(() => FavsModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
