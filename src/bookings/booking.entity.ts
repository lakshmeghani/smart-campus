import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BookingStatus } from "./enums/bookingStatus.enum";
import { Resource } from "src/resources/resource.entity";
import { User } from "src/users/users.entity";

@Entity()
export class Bookings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'date' })
  bookingDate: Date;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ default: BookingStatus.PENDING })
  status: BookingStatus;

  @ManyToOne(() => Resource, (resource) => resource.booking)
  resource: Resource;

  @ManyToOne(() => User)
  organizer: User;

  @ManyToOne(() => User)
  approvedBy: User;

  @CreateDateColumn({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP(6)' 
  })
  createdAt: Date;

  @UpdateDateColumn({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)'
  })
  updatedAt: Date;
}
