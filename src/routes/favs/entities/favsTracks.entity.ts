import { Exclude } from 'class-transformer';
import TrackEntity from 'src/routes/track/entities/track.entity';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class FavsTracksEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @OneToOne(() => TrackEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  track: TrackEntity;
}
