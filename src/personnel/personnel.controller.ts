import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('personnel')
@UseGuards(RolesGuard)
export class PersonnelController {
  @Get('dashboard')
  @Roles('personnel')
  getDashboard() {
    return { message: 'Bienvenue dans le dashboard personnel 👨‍💼' };
  }
}
