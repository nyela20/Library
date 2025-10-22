import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, ReservationDocument } from './reservation.schema';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>
  ) {}

  async findAll(): Promise<Reservation[]> {
    return this.reservationModel.find().exec();
  }

  async create(data: { idEmprunte: string; idLivre: string }): Promise<Reservation> {
    const reservation = new this.reservationModel(data);
    return reservation.save();
  }
}
