import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';

@Module({
  imports: [AlbumModule, ArtistModule, TrackModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
