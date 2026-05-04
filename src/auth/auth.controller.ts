import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UserDto } from '../users/dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { LoginDto } from './dtos/user-login.dto';

@Serialize(UserDto)
@Controller('auth')
export class AuthController {
  constructor (private authService: AuthService) {}

  @Post('/register')
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Post('/login')
  async login(@Body() body: LoginDto, @Session() session: any) {
    const user = await this.authService.login(body);
    session.userData = {
      id: user.id,
      role: user.role
    }
    return user;
  }

  @Get('/whoami')
  async whoami(@Session() session: any) {
    const userId = session.userData.id;
    return this.authService.whoami(userId);
  }

  @Post('/logout')
  async logout(@Session() session: any) {
    session.userData = null;
    return {
      status: "logged out successfully",
    }
  }

}
