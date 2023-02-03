import { Exclude } from 'class-transformer';
import { randomUUID } from 'crypto';

export default class User {
  id: string;
  login: string;
  // password: string;
  version: number;
  createdAt: number;
  updatedAt: number;

  @Exclude()
  password: string;

  // constructor(partial: Partial<UserEntity>) {
  //   Object.assign(this, partial);
  // }

  constructor(userObj: Partial<User>) {
    this.id = randomUUID();
    this.login = userObj.login;
    this.password = userObj.password;
    this.version = 1;
    this.createdAt = new Date().getTime();
    this.updatedAt = new Date().getTime();
  }
}
