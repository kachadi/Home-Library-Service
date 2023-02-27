import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { IPayload } from './models/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;
    const hashedPassword = await this.createHashedPassword(password);

    const user = await this.userService.create({
      login,
      password: hashedPassword,
    });

    return user;
  }

  async login(authUserCredentialDto: CreateUserDto) {
    const { login, password } = authUserCredentialDto;
    const user = await this.userService.findOneByLogin(login);

    const isPasswordsMatches = await this.comparePasswords(
      user.password,
      password,
    );

    if (!user || !isPasswordsMatches) {
      throw new ForbiddenException(
        'Authorization failed. Please, check your credentials',
      );
    }

    const payload: IPayload = { login };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  async createHashedPassword(password: string) {
    const salt = +process.env.CRYPT_SALT;
    return await bcrypt.hash(password, salt);
  }

  async comparePasswords(passwordInDb: string, passwordFromRequest: string) {
    return await bcrypt.compare(passwordFromRequest, passwordInDb);
  }
}