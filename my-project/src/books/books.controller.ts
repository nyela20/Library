import { Controller, Delete, Get, Param, HttpException, Body, HttpStatus, Put } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './books.schema';

@Controller('books') // endpoint API = /books
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // GET /books
  @Get()
  async findAll() {
    // On appelle la méthode correcte du service
    return this.booksService.findAllWithStatus();
  }

@Put(':id')
async update(@Param('id') id: string, @Body() updateData: Partial<Book>) {
  const updatedBook = await this.booksService.updateBook(id, updateData);
  if (!updatedBook) {
    throw new HttpException('Impossible de modifier le livre', HttpStatus.BAD_REQUEST);
  }
  return updatedBook;
}

 @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.booksService.remove(id);
    if (!result) {
      throw new HttpException('Livre non trouvé', HttpStatus.NOT_FOUND);
    }
    return { message: 'Livre supprimé avec succès' };
  }
}




/*import { Controller, Get } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books') // URL de base : /books
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get() // GET /books
  async getAllBooks() {
    return this.booksService.findAll();
  }
}*/


