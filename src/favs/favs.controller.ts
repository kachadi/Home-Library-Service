import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  findAll() {
    return this.favsService.findAll();
  }

  @Post('artist/:uuid')
  addArtistToFavs(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.favsService.addArtistToFavs(uuid);
  }

  @Post('album/:uuid')
  addAlbumsToFavs(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.favsService.addAlbumsToFavs(uuid);
  }

  @Post('track/:uuid')
  addTracksToFavs(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.favsService.addTracksToFavs(uuid);
  }
}
