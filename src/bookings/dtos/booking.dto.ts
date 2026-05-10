import { Expose, Transform } from "class-transformer";
import { BookingStatus } from "../enums/bookingStatus.enum";
import { Resource } from "src/resources/resource.entity";
import { User } from "src/users/users.entity";

export class BookingDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  bookingDate: Date;

  @Expose()
  startTime: Date;

  @Expose()
  endTime: Date;

  @Expose()
  status: BookingStatus;

  @Expose()
  resource: Resource;

  @Expose()
  organizer: User;

  @Expose()
  approvedBy: User;

}
