import AlbumEntity from 'src/album/entities/album.entity';
import ArtistEntity from 'src/artist/entities/artist.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class TrackEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  artistId: string | null;

  @Column({ nullable: true })
  albumId: string | null;

  @ManyToOne(() => ArtistEntity, (artist) => artist.tracks, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'artistId', referencedColumnName: 'id' })
  artist: ArtistEntity;

  @ManyToOne(() => AlbumEntity, (album) => album.tracks, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'albumId', referencedColumnName: 'id' })
  album: AlbumEntity;

  @Column('float')
  duration: number;
}
