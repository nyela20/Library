import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { EmpruntsService } from './emprunts.service';

@Controller('emprunts')
export class EmpruntsController {
  constructor(private readonly empruntsService: EmpruntsService) {}

  // Créer un emprunt
  @Post()
  async create(@Body() body: { idLivre: string; idEmprunte: string }) {
    return this.empruntsService.createEmprunt(body.idLivre, body.idEmprunte);
  }

  // Récupérer tous les emprunts
  @Get()
  async findAll() {
    return this.empruntsService.findAll();
  }

  // Récupérer un emprunt spécifique
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.empruntsService.findById(id);
  }

  // Retourner un livre (changer le statut à "Terminé")
  @Patch(':id/return')
  async returnBook(@Param('id') id: string) {
    return this.empruntsService.returnBook(id);
  }

  // récupérer les emprunts d'un utilisateur
  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.empruntsService.findByUser(userId);
  }

  // Supprimer un emprunt
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.empruntsService.delete(id);
  }
}
