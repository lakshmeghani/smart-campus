import { BookingStatus } from "../enums/bookingStatus.enum";
import { IsDateString, IsEnum, IsNumber, IsString, Min } from "class-validator";

export class CreateBookingDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  bookingDate: Date;

  @IsDateString()
  startTime: Date;

  @IsDateString()
  endTime: Date;

  @IsEnum(BookingStatus)
  status: BookingStatus;

  @IsNumber()
  @Min(1)
  resourceId: number;

  @IsNumber()
  @Min(1)
  organizerId: number;

  @IsNumber()
  @Min(1)
  approvedById: number;

}
