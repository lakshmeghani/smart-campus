import { IsArray, IsNumber, Min } from "class-validator";

export class AssignAdminsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  adminIds: number[];
}
