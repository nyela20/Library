import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reservation, ReservationDocument } from './reservation.schema';
import { Book } from '../books/books.schema'; 

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>,
    @InjectModel(Book.name) private bookModel: Model<Book>,
  ) {}

  async findAll(): Promise<Reservation[]> {
    return this.reservationModel.find().exec();
  }

  async create(data: { idEmprunte: string; idLivre: string }): Promise<Reservation> {
    const { idEmprunte, idLivre } = data;

    // Validation des ObjectId
    if (!Types.ObjectId.isValid(idEmprunte) || !Types.ObjectId.isValid(idLivre)) {
      throw new BadRequestException('ID invalide');
    }

    const objectIdLivre = new Types.ObjectId(idLivre);
    const objectIdEmprunte = new Types.ObjectId(idEmprunte);

    try {
      // Vérifier que le livre existe
      const bookExists = await this.bookModel.exists({ _id: objectIdLivre });
      if (!bookExists) throw new NotFoundException('Livre introuvable');

      // Créer la réservation
      const reservation = await this.reservationModel.create({
        idLivre: objectIdLivre,
        idEmprunte: objectIdEmprunte,
        dateReservation: new Date(),
        statut: 'En attente',
      });

      return reservation;
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException(err.message || 'Erreur lors de la création de la réservation');
    }
  }

  async findByUser(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('ID utilisateur invalide');
    }

    const userObjectId = new Types.ObjectId(userId);
    return this.reservationModel.find({ idEmprunte: userObjectId }).populate('idLivre').exec();
  }
}
