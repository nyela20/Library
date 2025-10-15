import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema()
export class Book {
  @Prop({ required: true })
  idLivre: number;

  @Prop({ required: true })
  titre: string;

  @Prop({ required: true })
  auteur: string;

  @Prop()
  genre: string;

  @Prop()
  anneePublication: number;

  @Prop()
  resume: string;

  @Prop()
  copiesTotales: number;

  @Prop()
  copiesDisponibles: number;

  @Prop()
  popularite: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);
