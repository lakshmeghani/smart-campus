import { IsArray, IsBoolean, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateResourceDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @Min(0)
  @Max(500)
  @IsNumber()
  capacity: number;

  @IsString()
  location: string;

  @IsBoolean()
  isActive: boolean;

  @IsNumber()
  categoryId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  adminIds: number[];

}
