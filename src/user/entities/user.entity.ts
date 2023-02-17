import { Exclude, Transform } from 'class-transformer';
import { randomUUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

// export default class UserEntity {
//   id: string;
//   login: string;
//   version: number;
//   createdAt: number;
//   updatedAt: number;

//   @Exclude()
//   password: string;

//   constructor(userObj: Partial<UserEntity>) {
//     this.id = randomUUID();
//     this.login = userObj.login;
//     this.password = userObj.password;
//     this.version = 1;
//     this.createdAt = new Date().getTime();
//     this.updatedAt = new Date().getTime();
//   }
// }

@Entity()
export default class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @VersionColumn()
  version: number;

  @CreateDateColumn({ type: 'timestamp' })
  @Transform((param) => +param.value)
  createdAt: number;

  @UpdateDateColumn({ type: 'timestamp' })
  @Transform((param) => +param.value)
  updatedAt: number;

  @Column()
  @Exclude()
  password: string;
}
