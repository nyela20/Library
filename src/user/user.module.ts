import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // ✅ modèle Mongoose ici
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // ✅ utile si d'autres modules utilisent UserService
})
export class UserModule {}
