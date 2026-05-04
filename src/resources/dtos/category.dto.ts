import { Expose, Transform } from "class-transformer";
import { Resource } from "../resource.entity";

export class CategoryDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Transform(({ obj }) => {
    if (Array.isArray(obj.resources)) {
      return obj.resources.map((resource: Resource) => {
        return {
          id: resource.id,
          name: resource.name,
        }
      })
    }
  })
  @Expose()
  resources: Resource[];

}
