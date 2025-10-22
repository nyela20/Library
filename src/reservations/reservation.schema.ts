import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
  @Prop({ required: true })
  idEmprunte: string;

  @Prop({ required: true })
  idLivre: string;

  @Prop({ default: Date.now })
  dateReservation: Date;

  @Prop({ default: 'En attente' })
  statut: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
