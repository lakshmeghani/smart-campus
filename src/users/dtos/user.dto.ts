import { Expose } from "class-transformer";
import { Role } from "../enums/role.enum";
import { UserStatus } from "../enums/user-status.enum";

export class UserDto {
  @Expose()
  id: number;
  
  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  role: Role;

  @Expose()
  status: UserStatus;
}
