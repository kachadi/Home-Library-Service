import { Exclude } from 'class-transformer';
import AlbumEntity from 'src/album/entities/album.entity';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class FavsAlbumsEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @OneToOne(() => AlbumEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  album: AlbumEntity;
}
