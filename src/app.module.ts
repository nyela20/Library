import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { EmpruntsModule } from './emprunts/emprunts.module';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://nyelaRal:Nyela2025Mongo@cluster0.1awozsr.mongodb.net/library?retryWrites=true&w=majority'),
    UserModule,
    AuthModule,
    BooksModule,
    EmpruntsModule,
    ReservationsModule,
  ],
  
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
