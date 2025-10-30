import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book, BookSchema } from './books.schema';
import { Reservation, ReservationSchema } from '../reservations/reservation.schema'; // <- importer

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: Reservation.name, schema: ReservationSchema } // <- ajouter ici
    ]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}



/*import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book, BookSchema } from './books.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]), // le model
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}*/
