import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from './resource.entity';
import { In, Repository } from 'typeorm';
import { CreateResourceDto } from './dtos/create-resource.dto';
import { CategoryService } from './category.service';
import { UpdateResourceDto } from './dtos/update-resource.dto';
import { UsersService } from '../users/users.service';
import { Role } from 'src/users/enums/role.enum';
import { UserStatus } from 'src/users/enums/user-status.enum';
import { AssignAdminsDto } from './dtos/assign-admin.dto';

@Injectable()
export class ResourcesService {
  constructor (
    @InjectRepository(Resource) private repo: Repository<Resource>,
    private categoryService: CategoryService,
    private usersService: UsersService,
  ) {}

  async findAll() {
    return this.repo.find();
  }

  async findResourcesByIds(ids: Number[]) {
    const resources = await this.repo.find({
      where: {
        id: In(ids),
      },
      relations: { category: true },
    });
    if (resources.length === 0) {
      throw new NotFoundException('no resources found')
    }

    return resources;
  }

  async findResourceById(id: number) {
    const resource = await this.repo.findOneOrFail({
      where: { id },
      relations: { category: true },
    })
    return resource;
  }

  async findResourcesByCategory(id: number) {
    const resources = await this.repo.find({
      where: { category: { id } },
    })
    return resources;
  }

  async findResourcesByAdminId(id: number) {
    const resources = await this.repo.find({
      where: {
        admins: { id },
      },
      relations: { category: true },
    })
    console.log(resources);
    return resources;
  }

  async findAdminsByResourceId(id: number) {
    const resource = await this.repo.findOneOrFail({
      where: {
        id,
      },
      relations: { admins: true },
    })
    return resource.admins;
  }

  async findActiveResources() {
    return await this.repo.find({
      where: { isActive: true },
    })
  }

  async createResource(data: CreateResourceDto) {
    const resourceCategory = await this.categoryService.findCategoryById(data.categoryId);
    const users = await this.usersService.findUsersByIds(data.adminIds);
    const admins = users.filter(user => user.role === Role.ADMIN && user.status === UserStatus.ACTIVE);
    if (admins.length !== data.adminIds.length) {
      const extractedAdminIds = admins.map(admin => admin.id);
      const nonAdminIds = data.adminIds.filter(id => !extractedAdminIds.includes(id));
      throw new ForbiddenException(`IDs: ${nonAdminIds} are not admins`);
    }
    const resource = this.repo.create(data);
    Object.assign(resource, { 
      category: resourceCategory,
      admins,
    });
    return this.repo.save(resource);
  }

  async updateResource(resourceId: number, data: UpdateResourceDto) {
    const resource = await this.repo.findOneByOrFail({ id: resourceId });
    Object.assign(resource, data);
    return this.repo.save(resource);
  }

  async toggleResourceState(id: number) {
    const resource = await this.repo.findOneByOrFail({ id });
    return this.updateResource(id, {
      isActive: !resource.isActive,
    })
  }

  async deleteResource(id: number) {
    return await this.repo.delete({ id });
  }

  async changeResourceCategory(id: number, categoryId: number) {
    const resource = await this.repo.findOneByOrFail({ id });
    const category = await this.categoryService.findCategoryById(categoryId);
    resource.category = category;
    return this.repo.save(resource);
  }

  async assignAdminsToResource(resourceId: number, data: AssignAdminsDto) {
    const resource = await this.repo.findOneOrFail({
      where: { id: resourceId },
      relations: { admins: true },
    });
    const users = await this.usersService.findUsersByIds(data.adminIds);
    const admins = users.filter(user => user.role === Role.ADMIN && user.status === UserStatus.ACTIVE);
    if (admins.length !== data.adminIds.length) {
      const extractedAdminIds = admins.map(admin => admin.id);
      const nonAdminIds = data.adminIds.filter(id => !extractedAdminIds.includes(id));
      throw new ForbiddenException(`IDs: ${nonAdminIds} are not admins`);
    }
    resource.admins.push(...admins);
    // duplicate relations are swallowed by postgres
    return this.repo.save(resource);
  }

  async revokeAdminFromResource(adminId: number, resourceId: number) {
    const resource = await this.repo.findOneOrFail({
      where: { id: resourceId },
      relations: { admins: true },
    });
    const assignedAdmins = resource.admins.filter(admin => admin.id !== adminId);
    if (assignedAdmins.length === 0) {
      throw new BadRequestException('cannot have resource without any admin');
    }
    resource.admins = assignedAdmins;
    return await this.repo.save(resource);
  }

}
