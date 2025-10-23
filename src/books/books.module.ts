import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book, BookSchema } from './books.schema';
import { Reservation, ReservationSchema } from '../reservations/reservation.schema';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    AuthModule,  // <-- Import du module qui fournit JwtService
  ],
  controllers: [BooksController],
  providers: [BooksService, RolesGuard],
})
export class BooksModule {}
