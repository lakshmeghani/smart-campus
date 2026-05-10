import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookings } from './booking.entity';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { ResourcesService } from 'src/resources/resources.service';
import { UsersService } from 'src/users/users.service';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { BookingStatus } from './enums/bookingStatus.enum';

@Injectable()
export class BookingsService {
  constructor (
    @InjectRepository(Bookings) private repo: Repository<Bookings>,
    private resourcesService: ResourcesService,
    private usersService: UsersService,
  ) {}

  async findBookingById(id: number) {
    return await this.repo.findOneOrFail({
      where: { id },
      relations: { resource: true, organizer: true, approvedBy: true },
    });
  }

  async findBookingByDate(date: Date) {
    return await this.repo.findOneOrFail({
      where: { bookingDate: date },
      relations: { resource: true, organizer: true, approvedBy: true },
    })
  }

  async findApprovedBookings() {
    return await this.repo.find({
      where: { status: BookingStatus.APPROVE },
      relations: { resource: true, organizer: true, approvedBy: true },
    })
  }

  async findBookingByResourceId(id: number) {
    return await this.repo.find({
      where: { resource: { id } },
      relations: { resource: true, organizer: true, approvedBy: true },
    })
  }

  async findBookingByOrganizerId(id: number) {
    return await this.repo.find({
      where: { organizer: { id } },
      relations: { resource: true, organizer: true, approvedBy: true },
    })
  }

  async createBooking(data: CreateBookingDto) {
    const booking = this.repo.create(data);
    const resource = await this.resourcesService.findResourceById(data.resourceId);
    const organizer = await this.usersService.findOneOrThrow(data.organizerId);
    const slotBooked = await this.repo.findOne({
      where: { bookingDate: data.bookingDate },
    })
    if ( slotBooked ) {
      throw new BadRequestException('There already exists a slot at this date and time OR is overlapping');
    }
    Object.assign(booking, { resource, organizer });
    return await this.repo.save(booking);
  }

  async updateBooking(bookingId: number, data: UpdateBookingDto) {
    const booking = await this.findBookingById(bookingId);
    Object.assign(booking, data);
    booking.status = BookingStatus.PENDING;
    if (data.resourceId) {
      const updatedResource = await this.resourcesService.findResourceById(data.resourceId);
      booking.resource = updatedResource;
    }
    return await this.repo.save(booking);
  }

  async approveBooking(id: number, approverId: number) {
    const booking = await this.findBookingById(id);
    booking.status = BookingStatus.APPROVE;
    const approver = await this.usersService.findOneOrThrow(approverId);
    booking.approvedBy = approver
    return this.repo.save(booking);
  }

  async rejectBooking(id: number) {
    const booking = await this.findBookingById(id);
    booking.status = BookingStatus.REJECTED;
    return this.repo.save(booking);
  }

  async deleteBooking(id: number) {
    return await this.repo.delete(id);
  }
}
