import { Controller, UseGuards, Delete, Get, Param, HttpException, Body, HttpStatus, Put } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './books.schema';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('books') // endpoint API = /books
@UseGuards(RolesGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // GET /books
  @Get()
  async findAll() {
    // On appelle la méthode correcte du service
    return this.booksService.findAllWithStatus();
  }

  @Put(':id')
  @Roles('personnel')
  async update(@Param('id') id: string, @Body() updateData: Partial<Book>) {
    const updatedBook = await this.booksService.updateBook(id, updateData);
    if (!updatedBook) {
      throw new HttpException('Impossible de modifier le livre', HttpStatus.BAD_REQUEST);
    }
    return updatedBook;
  }

 @Delete(':id')
 @Roles('personnel')
  async remove(@Param('id') id: string) {
    const result = await this.booksService.remove(id);
    if (!result) {
      throw new HttpException('Livre non trouvé', HttpStatus.NOT_FOUND);
    }
    return { message: 'Livre supprimé avec succès' };
  }
}

