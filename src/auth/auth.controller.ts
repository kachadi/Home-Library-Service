import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../routes/user/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
  async signUp(@Body() authCredentials: CreateUserDto) {
    return await this.authService.signUp(authCredentials);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() authUserCredentials: CreateUserDto) {
    return await this.authService.login(authUserCredentials);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('refresh')
  async refresh(@Body() authCredentials: CreateUserDto) {
    // return await this.authService.refresh(authCredentials);
  }
}
