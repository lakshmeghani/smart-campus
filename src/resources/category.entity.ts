import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Resource } from "./resource.entity";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Resource, (resource) => resource.category)
  resources: Resource[];

}
