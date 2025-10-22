import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Emprunt extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
  idLivre: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  idEmprunte: string;

  @Prop({ default: Date.now })
  dateEmprunt: Date;

  @Prop()
  dateRetourPrevu: Date;

  @Prop()
  dateRetourReel: Date;

  @Prop({ default: 'En cours' })
  statut: string;

  get idEmprunt() {
    return this._id;
  }
}

export const EmpruntSchema = SchemaFactory.createForClass(Emprunt);
