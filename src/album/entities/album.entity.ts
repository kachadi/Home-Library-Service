import ArtistEntity from 'src/artist/entities/artist.entity';
import TrackEntity from 'src/track/entities/track.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class AlbumEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  artistId: string | null;

  @ManyToOne(() => ArtistEntity, (artist) => artist.id, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'artistId', referencedColumnName: 'id' })
  artist: ArtistEntity;

  @OneToMany(() => TrackEntity, (track) => track.album)
  tracks: TrackEntity[];
}
