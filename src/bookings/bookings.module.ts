import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookings } from './booking.entity';
import { ResourcesModule } from 'src/resources/resources.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookings,]),
    ResourcesModule,
    UsersModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService]
})
export class BookingsModule {}
