import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistModule } from 'src/artist/artist.module';
import ArtistEntity from 'src/artist/entities/artist.entity';
import { FavsModule } from 'src/favs/favs.module';
import { TrackModule } from 'src/track/track.module';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import AlbumEntity from './entities/album.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlbumEntity, ArtistEntity]),
    forwardRef(() => TrackModule),
    forwardRef(() => ArtistModule),
    forwardRef(() => FavsModule),
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
