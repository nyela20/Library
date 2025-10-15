/*import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.schema'; // adapte le chemin si besoin

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async login({ email, motdepasse }: { email: string; motdepasse: string }) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    if (user.motdepasse !== motdepasse) {
      throw new UnauthorizedException('Mot de passe incorrect');
    }

    return {
      message: 'Connexion réussie ✅',
      user: {
        id: user._id,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    };
  }
}*/
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}
async login(body: { email: string; motdepasse: string }) {
  console.log('Requête login reçue :', body);

  const user = await this.userModel.findOne({ email: body.email });
  console.log('Utilisateur trouvé :', user);

  if (!user) {
    throw new UnauthorizedException('Email non trouvé'); // 🔹 Email incorrect
  }

  if (user.motdepasse !== body.motdepasse) {
    throw new UnauthorizedException('Mot de passe incorrect'); // 🔹 Mot de passe incorrect
  }

  const payload = { email: user.email, id: user._id };
  const access_token = this.jwtService.sign(payload);

  return { access_token, user };
}

}
