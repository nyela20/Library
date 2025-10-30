import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './books.schema';
import { Reservation, ReservationDocument } from '../reservations/reservation.schema';
@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>,
  ) {}

  async findAllWithStatus(): Promise<any[]> {
    const books = await this.bookModel.find().lean(); // lean() pour un objet JS simple

    const booksWithStatus = await Promise.all(
      books.map(async (book) => {
        const activeReservations = await this.reservationModel.countDocuments({
          idLivre: book._id,
          statut: 'En cours',
        });

        const status =
          book.copiesDisponibles > 0
            ? 'Disponible'
            : activeReservations > 0
            ? `Réservé (${activeReservations} en attente)`
            : 'Emprunté';

        return {
          ...book,
          status,
        };
      }),
    );

    return booksWithStatus;
  }
async updateBook(id: string, updateData: Partial<Book>): Promise<Book | null> {
    return this.bookModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }
  
   async remove(id: string): Promise<boolean> {
    const result = await this.bookModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

}