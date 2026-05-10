import { IsNumber, Min } from "class-validator";

export class BookingApproverDto {
  @IsNumber()
  @Min(1)
  approverId: number;
}
