import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  idEmprunte: string;

  @Prop({ type: Types.ObjectId, ref: 'Book' })
  idLivre: string;

  @Prop()
  dateReservation?: Date;

  @Prop()
  dateEmprunt?: Date;

  @Prop()
  dateRetourPrevu?: Date;

  @Prop()
  dateRetourReel?: Date;

  @Prop()
  statut: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
