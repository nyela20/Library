import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Reservation } from './reservation.schema';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // Créer une réservation
  @Post()
  async create(@Body() data: { idEmprunte: string; idLivre: string }): Promise<Reservation> {
    return this.reservationsService.create(data);
  }

  // Récupérer toutes les réservations
  @Get()
  async findAll(): Promise<Reservation[]> {
    return this.reservationsService.findAll();
  }

  // Récupérer les réservations d’un utilisateur
  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string): Promise<Reservation[]> {
    return this.reservationsService.findByUser(userId);
  }
}
