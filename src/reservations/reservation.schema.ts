import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
  idLivre: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  idEmprunte: Types.ObjectId;

  @Prop({ default: Date.now })
  dateReservation: Date;

  @Prop({ default: 'En attente' })
  statut: string;

  get idReservation() {
    return this._id;
  }
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
