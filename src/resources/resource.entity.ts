import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";
import { User } from "src/users/users.entity";
import { Bookings } from "src/bookings/booking.entity";

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

  @OneToMany(() => Bookings, (booking) => booking.resource)
  booking: Bookings;

  @ManyToOne(
    () => Category, 
    (category) => category.resources,
    { onDelete: 'CASCADE'},
  )
  category: Category;

}
