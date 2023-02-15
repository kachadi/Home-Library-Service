import { ForbiddenException, Injectable } from '@nestjs/common';
import { isItemExists } from 'src/utils/helpers';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import UserEntity from './entities/user.entity';

const USER = 'User';

@Injectable()
export class UserService {
  private users: UserEntity[] = [];

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    isItemExists(this.users, id, USER);
    const user = this.users.find((user) => user.id === id);
    return user;
  }

  create(createUserDto: CreateUserDto) {
    const newUser = new UserEntity(createUserDto);
    this.users.push(newUser);
    return newUser;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    isItemExists(this.users, id, USER);
    const existingUser = this.users.find((user) => user.id === id);
    this.isOldPasswordValid(existingUser, updateUserDto.oldPassword);
    existingUser.password = updateUserDto.newPassword;
    existingUser.version += 1;
    existingUser.updatedAt = new Date().getTime();
    return existingUser;
  }

  remove(id: string) {
    const existingUserId = this.users.findIndex((user) => user.id === id);
    isItemExists(this.users, id, USER);
    this.users.splice(existingUserId, 1);
  }

  isOldPasswordValid(user: UserEntity, oldPassword: string) {
    if (user.password !== oldPassword) {
      throw new ForbiddenException(`Wrong old password`);
    }
  }
}
