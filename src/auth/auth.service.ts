import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2'
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { LoginDto } from './dtos/user-login.dto';

@Injectable()
export class AuthService {
  constructor (private usersService: UsersService) {}

  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async comparePassword(hash: string, password: string): Promise<boolean> {
    return await argon2.verify(hash, password);
  }

  async register(userData: CreateUserDto) {
    const hash = await this.hashPassword(userData.password);
    Object.assign(userData, { password: hash });
    return await this.usersService.create(userData);
  }

  async login(userData: LoginDto) {
    const user = await this.usersService.findByEmail(userData.email);

    if(!user) {
      throw new NotFoundException('user not found')
    }

    if(!await this.comparePassword(user.password, userData.password)) {
      throw new BadRequestException('wrong password')
    } else {
      return user;
    }
  }

  async whoami(id: string) {
    return this.usersService.findOneOrThrow(parseInt(id));
  }
}
