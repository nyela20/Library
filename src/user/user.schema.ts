import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type UserDocument = User & Document;

@Schema({ collection: 'user' }) //  correspond au nom exact de ta collection
export class User extends Document {

 //  correspond à ta collection exacte
  @Prop({ type: Number })
  userId: number;

  @Prop({ required: true })
  nom: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  motdepasse: string;

@Prop({ required: true, default: 'utilisateur' })

  role: string;
}


export const UserSchema = SchemaFactory.createForClass(User);
