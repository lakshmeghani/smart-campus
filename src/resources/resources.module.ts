import { Module } from '@nestjs/common';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Resource } from './resource.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Resource]), UsersModule],
  controllers: [ResourcesController, CategoryController,],
  providers: [ResourcesService, CategoryService,],
  exports: [ResourcesService],
})
export class ResourcesModule {}
