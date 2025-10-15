import { Controller, Get } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books') // URL de base : /books
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get() // GET /books
  async getAllBooks() {
    return this.booksService.findAll();
  }
}


