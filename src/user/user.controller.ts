import { Controller, Get, Post, Put, Delete, Patch, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 🔹 Récupérer tous les utilisateurs
  @Get()
  async getAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // 🔹 Créer un utilisateur
  @Post()
  async create(@Body() userData: Partial<User>): Promise<User> {
    return this.userService.createUser(userData);
  }

  // 🔹 Récupérer un utilisateur par ID
  @Get(':id')
  async getById(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  // 🔹 Mettre à jour le rôle d’un utilisateur
  @Patch(':id/role')
  async updateRole(@Param('id') id: string, @Body() body: { role: string }): Promise<User> {
    return this.userService.updateUser(id, { role: body.role });
  }

  // 🔹 Supprimer un utilisateur
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }
}



/*import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';

@Controller('users') // correspond à la route API : /users
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET /users — récupérer tous les utilisateurs
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  // GET /users/:id — récupérer un utilisateur par son ID
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  // POST /users créer un nouvel utilisateur
  @Post()
  async createUser(@Body() userData: Partial<User>): Promise<User> {
    return this.userService.createUser(userData);
  }

  //  PUT /users/:id — mettre à jour un utilisateur
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateData: Partial<User>): Promise<User> {
    return this.userService.updateUser(id, updateData);
  }

  //  DELETE /users/:id — supprimer un utilisateur
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
*/