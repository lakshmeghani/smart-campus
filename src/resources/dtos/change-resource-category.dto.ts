import { IsNumber } from "class-validator";

export class ChangeResourceCategoryDto {
  @IsNumber()
  categoryId: number;
}
