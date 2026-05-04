import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { AuthGaurd } from "src/garuds/auth.gaurd";
import { RolesGuard } from "src/garuds/roles.gaurd";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/users/enums/role.enum";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { CategoryDto } from "./dtos/category.dto";
import { UpdateCategoryDto } from "./dtos/update-category.dto";

@UseGuards(AuthGaurd, RolesGuard)
@Roles(Role.SUPERUSER)
@Serialize(CategoryDto)
@Controller('/resources/category')
export class CategoryController {
  constructor (private categoryService: CategoryService) {}

  // no need to serialize as category initially always empty
  @Post('/')
  async addCategory(@Body() body: CreateCategoryDto) {
    return await this.categoryService.createCategory(body);
  }

  @Get('/')
  async getAllCategories() {
    return await this.categoryService.findAllCategories();
  }

  @Get('/:id')
  async getCategory(@Param('id') id: string) {
    return await this.categoryService.findCategoryById(parseInt(id));
  }

  @Patch('/')
  async editCategory(@Body() body: UpdateCategoryDto) {
    return await this.categoryService.updateCategory(body);
  }

  @Delete('/:id')
  async deleteCategory(@Param('id') id: string) {
    return await this.categoryService.deleteCategory(parseInt(id));
  }

}
