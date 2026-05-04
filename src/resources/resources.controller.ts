import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { AuthGaurd } from '../garuds/auth.gaurd';
import { RolesGuard } from '../garuds/roles.gaurd';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { CreateResourceDto } from './dtos/create-resource.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ResourceDto } from './dtos/resource.dto';
import { UpdateResourceDto } from './dtos/update-resource.dto';
import { ChangeResourceCategoryDto } from './dtos/change-resource-category.dto';
import { AssignAdminsDto } from './dtos/assign-admin.dto';

@UseGuards(AuthGaurd, RolesGuard)
@Roles(Role.SUPERUSER)
@Serialize(ResourceDto)
@Controller('resources')
export class ResourcesController {
  constructor (private resourcesService: ResourcesService) {}

  @Post('/')
  async addResource(@Body() body: CreateResourceDto) {
    return await this.resourcesService.createResource(body);
  }

  @Post('/:id/admins')
  async assignAdmin(@Param('id') id: string ,@Body() body: AssignAdminsDto) {
    return await this.resourcesService.assignAdminsToResource(parseInt(id), body);
  }

  @Get('/')
  async getAllResources() {
    return await this.resourcesService.findAll();
  }

  @Get('/active')
  async getActiveResources() {
    return await this.resourcesService.findActiveResources();
  }

  @Get('/by-category/:id')
  async getResourceByCategory(@Param() id: string) {
    return this.resourcesService.findResourcesByCategory(parseInt(id));
  }

  @Get('/by-admin/:id')
  async getResourcesBydAdmin(@Param('id') id: string) {
    return this.resourcesService.findResourcesByAdminId(parseInt(id));
  }

  @Get('/:id/admins')
  async getAdminsByResource(@Param('id') id: string) {
    return this.resourcesService.findAdminsByResourceId(parseInt(id));
  }

  @Get('/:id')
  async getResource(@Param('id') id: string) {
    const resource = await this.resourcesService.findResourcesByIds([ parseInt(id) ]);
    return resource[0];
  }

  @Patch('/:id')
  async editResource(@Param('id') id: string ,@Body() body: UpdateResourceDto) {
    return await this.resourcesService.updateResource(parseInt(id), body);
  }

  @Patch('/:id/toggle')
  async toggleState(@Param('id') id: string) {
    return await this.resourcesService.toggleResourceState(parseInt(id));
  }

  @Patch('/:id/category')
  async changeResourceCategory(@Param('id') id: string ,@Body() body: ChangeResourceCategoryDto) {
    return await this.resourcesService.changeResourceCategory(parseInt(id), body.categoryId);
  }

  @Delete('/:id')
  async deleteResource(@Param('id') id: string) {
    return await this.resourcesService.deleteResource(parseInt(id));
  }

  @Delete('/:id/admin/:adminId')
  async revokeAdmin(@Param('id') resourceId: string, @Param('adminId') adminId: string) {
    return this.resourcesService.revokeAdminFromResource(parseInt(adminId), parseInt(resourceId));
  }

}
