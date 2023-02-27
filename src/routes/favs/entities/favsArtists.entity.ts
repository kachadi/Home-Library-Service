import { Exclude } from 'class-transformer';
import ArtistEntity from 'src/routes/artist/entities/artist.entity';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class FavsArtistsEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @OneToOne(() => ArtistEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  artist: ArtistEntity;
}
