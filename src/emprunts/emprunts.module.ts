import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmpruntsController } from './emprunts.controller';
import { EmpruntsService } from './emprunts.service';
import { Emprunt, EmpruntSchema } from './emprunts.schema';
import { Book, BookSchema } from '../books/books.schema'; // important pour décrémenter copiesDisponibles

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Emprunt.name, schema: EmpruntSchema },
      { name: Book.name, schema: BookSchema },
    ]),
  ],
  controllers: [EmpruntsController],
  providers: [EmpruntsService],
  exports: [EmpruntsService],
})
export class EmpruntsModule {}
