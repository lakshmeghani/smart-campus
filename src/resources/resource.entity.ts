import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";
import { User } from "src/users/users.entity";

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  capacity: number;

  @Column()
  location: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => User)
  @JoinTable()
  admins: User[];

  @ManyToOne(
    () => Category, 
    (category) => category.resources,
    { onDelete: 'CASCADE'},
  )
  category: Category;

}
