import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';
import { FavsService } from './favs.service';

@Controller('favs')
@UseGuards(JwtGuard)
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  async findAll() {
    return await this.favsService.findAll();
  }

  @Post('artist/:uuid')
  async addArtistToFavs(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return await this.favsService.addArtistToFavs(uuid);
  }

  @Post('album/:uuid')
  async addAlbumsToFavs(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return await this.favsService.addAlbumsToFavs(uuid);
  }

  @Post('track/:uuid')
  async addTracksToFavs(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return await this.favsService.addTracksToFavs(uuid);
  }

  @Delete('track/:uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrackFromFavs(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return await this.favsService.removeTrackFromFavs(uuid);
  }

  @Delete('artist/:uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtistFromFavs(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return await this.favsService.removeArtistFromFavs(uuid);
  }

  @Delete('album/:uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbumFromFavs(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return await this.favsService.removeAlbumFromFavs(uuid);
  }
}
