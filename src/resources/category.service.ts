import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { Repository } from "typeorm";
import { UpdateCategoryDto } from "./dtos/update-category.dto";
import { CreateCategoryDto } from "./dtos/create-category.dto";

Injectable()
export class CategoryService {
  constructor (
    @InjectRepository(Category) private repo: Repository<Category>,
  ) {}

  async findAllCategories() {
    return await this.repo.find();
  }

  async findCategoryById(id: number) {
    const resourceCategory = await this.repo.findOneOrFail({
      where: { id },
      relations: { resources: true },
    });
    return resourceCategory;
  }

  async createCategory(data: CreateCategoryDto) {
    const resourceCategory = this.repo.create(data);
    return await this.repo.save(resourceCategory);
  }

  async updateCategory(data: UpdateCategoryDto) {
    const resourceCategory = await this.repo.findOneByOrFail({ id: data.id });
    Object.assign(resourceCategory, data);
    return await this.repo.save(resourceCategory);
  }

  async deleteCategory(id: number) {
    return await this.repo.delete(id);
  }
  
}
