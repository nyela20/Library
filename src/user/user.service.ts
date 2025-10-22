import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  // Créer un nouvel utilisateur
  async createUser(userData: Partial<User>): Promise<User> {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  //  Récupérer tous les utilisateurs
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

 
  async findById(id: string): Promise<User> { // Enlève le "| null"
  const user = await this.userModel.findById(id).exec();
  if (!user) throw new NotFoundException('Utilisateur non trouvé');
  return user;
}

async updateUser(id: string, updateData: Partial<User>): Promise<User> {
  const updatedUser = await this.userModel
    .findByIdAndUpdate(id, updateData, { new: true })
    .exec();
  if (!updatedUser) throw new NotFoundException('Utilisateur non trouvé');
  return updatedUser;
}


  //  Récupérer un utilisateur par email (pour le login)
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

 

  //  Supprimer un utilisateur
  async deleteUser(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Utilisateur non trouvé');
  }
}



