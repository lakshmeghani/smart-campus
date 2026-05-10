import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookings } from './booking.entity';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { ResourcesService } from 'src/resources/resources.service';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/users/enums/role.enum';

@Injectable()
export class BookingsService {
  constructor (
    @InjectRepository(Bookings) private repo: Repository<Bookings>,
    private resourcesService: ResourcesService,
    private usersService: UsersService,
  ) {}

  async createBooking(data: CreateBookingDto) {
    const booking = this.repo.create(data);
    const resource = await this.resourcesService.findResourceById(data.resourceId);
    const organizer = await this.usersService.findOneOrThrow(data.organizerId);
    const approvedBy = await this.usersService.findOneOrThrow(data.approvedById);
    if (approvedBy.role !== Role.ADMIN) {
      throw new ForbiddenException(`Approved by user: user ${data.approvedById} is not an admin`)
    }
    Object.assign(booking, { resource, organizer, approvedBy })
    return await this.repo.save(booking);
  }
}
