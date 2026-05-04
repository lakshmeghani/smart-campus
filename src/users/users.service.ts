import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { In, Repository } from 'typeorm';
import { Role } from './enums/role.enum';
import { UserStatus } from './enums/user-status.enum';
     
@Injectable()
export class UsersService {
  constructor (@InjectRepository(User) private repo: Repository<User>) {}

  async create(data: CreateUserDto) {
    const user = this.repo.create(data);
    if (data.role === Role.USER) {
      Object.assign(user, { status: 'active' })
    }
    if (data.role === Role.SUPERUSER) {
      throw new BadRequestException('can not apply for superuser role');
    }
    return this.repo.save(user);
  }

  async findByEmail(email: string) {
    const user = await this.repo.findOneBy({ email });
    return user;
  }

  async findOneOrThrow(id: number) {
    const user = this.repo.findOneByOrFail({ id });
    return user;
  }

  async findAll() {
    const users = await this.repo.find();
    return users;
  }

  async findPending() {
    const users = await this.repo.findBy({ status: UserStatus.PENDING });
    return users;
  }

  async findUsersByIds(ids: number[]) {
    const users = await this.repo.find({
      where: { 
        id: In(ids),
      },
    })
    return users;
  }

  async approveUser(id: number) {
    const user = await this.findOneOrThrow(id);
    user.status = UserStatus.ACTIVE;
    return await this.repo.save(user);
  }

  async rejectUser(id: number) {
    const user = await this.findOneOrThrow(id);
    user.status = UserStatus.REJECTED;
    return await this.repo.save(user);
  }

  async deleteUser(id: number) {
    return await this.repo.delete(id);
  }

}
