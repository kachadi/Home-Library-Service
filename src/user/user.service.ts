import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import User from './entities/user.entity';
import ResponseUser from './entities/responseUser.entity';

@Injectable()
export class UserService {
  private users: User[] = [];

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    const user = this.users.find((user) => user.id === id);
    this.isUserExist(id);
    // const responseUser = new ResponseUser(user);
    // return responseUser;
    return user;
  }

  create(createUserDto: CreateUserDto) {
    const newUser = new User(createUserDto);
    this.users.push(newUser);
    return newUser;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    this.isUserExist(id);
    const existingUser = this.users.find((user) => user.id === id);
    this.isOldPasswordValid(existingUser, updateUserDto.oldPassword);
    existingUser.password = updateUserDto.newPassword;
    existingUser.version += 1;
    existingUser.updatedAt = new Date().getTime();
    return existingUser;
  }

  remove(id: string) {
    const existingUserId = this.users.findIndex((user) => user.id === id);
    this.isUserExist(id);
    this.users.splice(existingUserId, 1);
  }

  isUserExist(userId: string) {
    const user = this.users.find((user) => user.id === userId);
    if (!user) {
      throw new NotFoundException(`User with #${userId} not found`);
    }
  }

  isOldPasswordValid(user, oldPassword) {
    if (user.password !== oldPassword) {
      throw new ForbiddenException(`Wrong old password`);
    }
  }
}
