import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { BookingDto } from './dtos/booking.dto';
import { AuthGaurd } from 'src/garuds/auth.gaurd';
import { RolesGuard } from 'src/garuds/roles.gaurd';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { BookingApproverDto } from './dtos/approver-admin.dto';

@Serialize(BookingDto)
@UseGuards(AuthGaurd, RolesGuard)
@Controller('bookings')
export class BookingsController {
  constructor (private bookingsService: BookingsService) {}

  @Get('/')
  async getAllBookings() {
    return await this.bookingsService.findApprovedBookings();
  }

  @Roles(Role.ADMIN, Role.SUPERUSER)
  @Get('/date/:date')
  async getBookingOnDate(@Param('date') date: string) {
    return await this.bookingsService.findBookingByDate(new Date(date));
  }

  @Roles(Role.ADMIN ,Role.ORGANIZER, Role.SUPERUSER)
  @Get('/by-resource/:id')
  async getBookingsByResource(@Param('id') id: string) {
    return await this.bookingsService.findBookingByResourceId(parseInt(id));
  }

  @Get('/by-organizer/:id')
  async getBookingsByOrganizer(@Param('id') id: string) {
    return await this.bookingsService.findBookingByOrganizerId(parseInt(id));
  }

  @Roles(Role.ADMIN, Role.SUPERUSER)
  @Get('/:id')
  async getBooking(@Param('id') id: string) {
    return await this.bookingsService.findBookingById(parseInt(id));
  }

  @Roles(Role.ORGANIZER, Role.SUPERUSER)
  @Post('/')
  async createBooking(@Body() body: CreateBookingDto) {
    return this.bookingsService.createBooking(body);
  }

  @Roles(Role.ADMIN, Role.SUPERUSER)
  @Patch('/:id/approve')
  async approveBooking(@Param('id') id: string, @Body() { approverId }: BookingApproverDto) {
    return await this.bookingsService.approveBooking(parseInt(id), approverId);
  }

  @Roles(Role.ADMIN, Role.SUPERUSER)
  @Patch('/:id/reject')
  async rejectBooking(@Param('id') id: string) {
    return await this.bookingsService.rejectBooking(parseInt(id));
  }

  @Roles(Role.ORGANIZER, Role.SUPERUSER)
  @Patch('/:id')
  async updateBooking(@Param('id') id: string, @Body() body: UpdateBookingDto) {
    return this.bookingsService.updateBooking(parseInt(id), body);
  }

  @Roles(Role.ORGANIZER, Role.SUPERUSER)
  @Delete('/:id')
  async deleteBooking(@Param('id') id: string) {
    return this.bookingsService.deleteBooking(parseInt(id));
  }

}
