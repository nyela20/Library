
/*import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.schema'; // ✅ à ajouter

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]) // ✅ important
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}*/

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.schema';
import { JwtModule } from '@nestjs/jwt'; // ✅ bien importé

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'SECRET_KEY',   // clé secrète pour JWT
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
