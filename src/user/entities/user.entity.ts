import { Exclude } from 'class-transformer';
import { randomUUID } from 'crypto';

export default class UserEntity {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;

  @Exclude()
  password: string;

  constructor(userObj: Partial<UserEntity>) {
    this.id = randomUUID();
    this.login = userObj.login;
    this.password = userObj.password;
    this.version = 1;
    this.createdAt = new Date().getTime();
    this.updatedAt = new Date().getTime();
  }
}
