import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResoursesNames } from 'src/utils/constants';
import { isItemExists } from 'src/utils/helpers';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import UserEntity from './entities/user.entity';

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
    await isItemExists(this.userRepository, userId, ResoursesNames.USER);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const createdUser = this.userRepository.create(createUserDto);
    const newUser = await this.userRepository.save(createdUser);
    return newUser;
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    await isItemExists(this.userRepository, userId, ResoursesNames.USER);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    this.isOldPasswordValid(user, updateUserDto.oldPassword);
    user.password = updateUserDto.newPassword;
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }

  async remove(userId: string) {
    await isItemExists(this.userRepository, userId, ResoursesNames.USER);
    await this.userRepository.delete(userId);
  }

  isOldPasswordValid(user: UserEntity, oldPassword: string) {
    if (user.password !== oldPassword) {
      throw new ForbiddenException(`Wrong old password`);
    }
  }

  async findOneByLogin(login: string) {
    return await this.userRepository.findOne({ where: { login: login } });
  }
}
