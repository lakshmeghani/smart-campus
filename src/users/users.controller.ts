import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthGaurd } from '../garuds/auth.gaurd';
import { Roles } from '../decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { RolesGuard } from 'src/garuds/roles.gaurd';

@UseGuards(AuthGaurd, RolesGuard)
@Roles(Role.SUPERUSER)
@Serialize(UserDto)
@Controller('users')
export class UsersController {
  constructor (private usersService: UsersService) {}

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    return this.usersService.findOneOrThrow(parseInt(id));
  }

  @Get('/')
  async findAllUsers() {
    return this.usersService.findAll();
  }

  @Get('/pending')
  async findPendingUsers() {
    return this.usersService.findPending();
  }

  @Patch('/approve/:id')
  async approveUser(@Param('id') id: string) {
    return this.usersService.approveUser(parseInt(id));
  }

  @Patch('/reject/:id')
  async rejectUser(@Param('id') id: string) {
    return this.usersService.rejectUser(parseInt(id));
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(parseInt(id));
  }
}
