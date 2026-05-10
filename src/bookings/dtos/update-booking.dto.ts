import { IsDateString, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateBookingDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startTime?: Date;

  @IsOptional()
  @IsDateString()
  endTime?: Date;

  @IsOptional()
  @IsNumber()
  @Min(1)
  resourceId?: number;
}

