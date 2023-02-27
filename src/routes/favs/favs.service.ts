import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumService } from 'src/routes/album/album.service';
import AlbumEntity from 'src/routes/album/entities/album.entity';
import { ArtistService } from 'src/routes/artist/artist.service';
import ArtistEntity from 'src/routes/artist/entities/artist.entity';
import TrackEntity from 'src/routes/track/entities/track.entity';
import { TrackService } from 'src/routes/track/track.service';
import { ResoursesNames } from 'src/utils/constants';
import { successResponse } from 'src/utils/helpers';
import { Repository } from 'typeorm';
import FavsAlbumsEntity from './entities/favsAlbums.entity';
import FavsArtistsEntity from './entities/favsArtists.entity';
import FavsTracksEntity from './entities/favsTracks.entity';

@Injectable()
export class FavsService {
  constructor(
    @InjectRepository(FavsArtistsEntity)
    private favsArtistsRepository: Repository<FavsArtistsEntity>,
    @InjectRepository(FavsAlbumsEntity)
    private favsAlbumsRepository: Repository<FavsAlbumsEntity>,
    @InjectRepository(FavsTracksEntity)
    private favsTracksRepository: Repository<FavsTracksEntity>,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
  ) {}

  async findAll() {
    const favsResponse: {
      artists: ArtistEntity[] | undefined[];
      albums: AlbumEntity[] | undefined[];
      tracks: TrackEntity[] | undefined[];
    } = {
      artists: [],
      albums: [],
      tracks: [],
    };

    const artists = await this.favsArtistsRepository.find();
    const albums = await this.favsAlbumsRepository.find();
    const tracks = await this.favsTracksRepository.find();

    favsResponse.artists = artists.map((el) => el.artist);
    favsResponse.albums = albums.map((el) => el.album);
    favsResponse.tracks = tracks.map((el) => el.track);

    return favsResponse;
  }

  async addArtistToFavs(id: string) {
    await this.artistService.checkArtistExists(id, true);
    const artist = await this.artistService.findOne(id);
    const createdFavsArtist = this.favsArtistsRepository.create({ artist });
    await this.favsArtistsRepository.save(createdFavsArtist);
    return successResponse(ResoursesNames.ARTIST, id);
  }

  async addAlbumsToFavs(id: string) {
    await this.albumService.checkAlbumExists(id, true);
    const album = await this.albumService.findOne(id);
    const createdFavsAlbum = this.favsAlbumsRepository.create({ album });
    await this.favsAlbumsRepository.save(createdFavsAlbum);
    return successResponse(ResoursesNames.ALBUM, id);
  }

  async addTracksToFavs(id: string) {
    await this.trackService.checkTrackExists(id, true);

    const track = await this.trackService.findOne(id);
    const createdFavsTrack = this.favsTracksRepository.create({ track });
    await this.favsTracksRepository.save(createdFavsTrack);
    return successResponse(ResoursesNames.TRACK, id);
  }

  async removeTrackFromFavs(id: string) {
    await this.trackService.checkTrackExists(id, true);
    const favTrackId = await this.findTrackInFavs(id);
    await this.favsTracksRepository.delete(favTrackId);
  }

  async removeArtistFromFavs(id: string) {
    await this.artistService.checkArtistExists(id, true);
    const favArtistId = await this.findArtistInFavs(id);
    await this.favsArtistsRepository.delete(favArtistId);
  }

  async removeAlbumFromFavs(id: string) {
    await this.albumService.checkAlbumExists(id, true);
    const favAlbumId = await this.findAlbumInFavs(id);
    await this.favsAlbumsRepository.delete(favAlbumId);
  }

  async findArtistInFavs(id: string) {
    const favArtists = await this.favsArtistsRepository.findOne({
      where: { artist: { id: id } },
    });
    return favArtists.id;
  }

  async findAlbumInFavs(id: string) {
    const favAlbum = await this.favsAlbumsRepository.findOne({
      where: { album: { id: id } },
    });
    return favAlbum.id;
  }

  async findTrackInFavs(id: string) {
    const favTrack = await this.favsTracksRepository.findOne({
      where: { track: { id: id } },
    });
    return favTrack.id;
  }
}
