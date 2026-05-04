import { Expose, Transform, } from "class-transformer";
import { Category } from "../category.entity";
import { User } from "src/users/users.entity";

export class ResourceDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  capacity: number;

  @Expose()
  location: string;

  @Expose()
  isActive: boolean;

  @Transform(({ obj }) => {
    if (Array.isArray(obj.admins)) {
      return obj.admins.map((admin: User) => {
        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        }
      })
    }
  })
  @Expose()
  admins: User[];

  @Transform(({ obj }) => {
    if (obj.category) {
      return {
        id: obj.category.id,
        name: obj.category.name,
      }
    }
  })
  @Expose()
  category: Category;
}
