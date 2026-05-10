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

  @Transform(({ obj }) => {
    return {
      id: obj.resource.id,
      name: obj.resource.name,
    }
  })
  @Expose()
  resource: Resource;

  @Transform(({ obj }) => {
    return {
      id: obj.organizer.id,
      name: obj.organizer.name,
      email: obj.organizer.email,
    }
  })
  @Expose()
  organizer: User;

  @Transform(({ obj }) => {
    if (obj.approvedBy) {
      return {
        id: obj.approvedBy.id,
        name: obj.approvedBy.name,
        email: obj.approvedBy.email,
      }
    }
  })
  @Expose()
  approvedBy: User;

}
