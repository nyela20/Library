import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.schema'; // 👈 Assure-toi que ce chemin est correct

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  //  Route de connexion
  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body);
  }

  //  Route d'inscription
  @Post('register')
  async register(@Body() createUserDto: any) {
    const { nom, email, motdepasse } = createUserDto;

    // Vérifier les champs
    if (!nom || !email || !motdepasse) {
      throw new BadRequestException('Tous les champs sont obligatoires');
    }

    // Vérifier si l’utilisateur existe déjà
    const userExist = await this.userModel.findOne({ email });
    if (userExist) {
      throw new BadRequestException('Cet e-mail est déjà utilisé');
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(motdepasse, 10);

    // Créer et enregistrer le nouvel utilisateur
    const newUser = new this.userModel({
      nom,
      email,
      motdepasse: hashedPassword,
    });

    await newUser.save();

    return { message: 'Utilisateur créé avec succès', user: newUser };
  }
}
