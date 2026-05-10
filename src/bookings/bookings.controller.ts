import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { BookingDto } from './dtos/booking.dto';
import { AuthGaurd } from 'src/garuds/auth.gaurd';
import { RolesGuard } from 'src/garuds/roles.gaurd';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';

@Serialize(BookingDto)
@UseGuards(AuthGaurd, RolesGuard)
@Controller('bookings')
export class BookingsController {
  constructor (private bookingsService: BookingsService) {}

  @Roles(Role.ORGANIZER)
  @Post('/')
  async createBooking(@Body() body: CreateBookingDto) {
    return this.bookingsService.createBooking(body);
  }
}
