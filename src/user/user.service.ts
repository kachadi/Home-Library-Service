import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isItemExists, isItemExists1 } from 'src/utils/helpers';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import UserEntity from './entities/user.entity';

const USER = 'User';

// @Injectable()
// export class UserService {
//   private users: UserEntity[] = [];

//   findAll() {
//     return this.users;
//   }

//   findOne(id: string) {
//     isItemExists(this.users, id, USER);
//     const user = this.users.find((user) => user.id === id);
//     return user;
//   }

//   create(createUserDto: CreateUserDto) {
//     const newUser = new UserEntity(createUserDto);
//     this.users.push(newUser);
//     return newUser;
//   }

//   update(id: string, updateUserDto: UpdateUserDto) {
//     isItemExists(this.users, id, USER);
//     const existingUser = this.users.find((user) => user.id === id);
//     this.isOldPasswordValid(existingUser, updateUserDto.oldPassword);
//     existingUser.password = updateUserDto.newPassword;
//     existingUser.version += 1;
//     existingUser.updatedAt = new Date().getTime();
//     return existingUser;
//   }

//   remove(id: string) {
//     const existingUserId = this.users.findIndex((user) => user.id === id);
//     isItemExists(this.users, id, USER);
//     this.users.splice(existingUserId, 1);
//   }

//   isOldPasswordValid(user: UserEntity, oldPassword: string) {
//     if (user.password !== oldPassword) {
//       throw new ForbiddenException(`Wrong old password`);
//     }
//   }
// }

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(userId: string) {
    await isItemExists1(this.userRepository, userId, USER);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const createdUser = this.userRepository.create(createUserDto);
    const newUser = await this.userRepository.save(createdUser);
    return newUser;
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    await isItemExists1(this.userRepository, userId, USER);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    this.isOldPasswordValid(user, updateUserDto.oldPassword);
    user.password = updateUserDto.newPassword;
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }

  async remove(userId: string) {
    await isItemExists1(this.userRepository, userId, USER);
    await this.userRepository.delete(userId);
  }

  isOldPasswordValid(user: UserEntity, oldPassword: string) {
    if (user.password !== oldPassword) {
      throw new ForbiddenException(`Wrong old password`);
    }
  }
}
