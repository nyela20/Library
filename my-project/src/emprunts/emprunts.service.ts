import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Emprunt } from './emprunts.schema';
import { Book } from '../books/books.schema'; // Assure-toi que le chemin est correct vers ton schema Book

@Injectable()
export class EmpruntsService {
  constructor(
    @InjectModel(Emprunt.name) private empruntModel: Model<Emprunt>,
    @InjectModel(Book.name) private bookModel: Model<Book>,
  ) {}

  // Créer un nouvel emprunt
  async createEmprunt(idLivre: string, idEmprunte: string) {
    // Récupérer le livre
    const book = await this.bookModel.findById(idLivre);
    if (!book) throw new Error('Livre introuvable');
    if (book.copiesDisponibles <= 0) throw new Error('Aucune copie disponible !');

    // Diminuer le nombre de copies disponibles
    book.copiesDisponibles -= 1;
    await book.save();

    // Créer un nouvel emprunt
    const emprunt = new this.empruntModel({
      idLivre,
      idEmprunte,
      dateEmprunt: new Date(),
      dateRetourPrevu: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // +14 jours
      statut: 'En cours',
    });

    return emprunt.save();
  }

  // Récupérer tous les emprunts
  async findAll() {
    return this.empruntModel.find().populate('idLivre').exec();
  }

  // Récupérer un emprunt par ID
  async findById(id: string) {
    return this.empruntModel.findById(id).populate('idLivre').exec();
  }

  // Marquer un emprunt comme "retourné"
  async returnBook(id: string) {
    const emprunt = await this.empruntModel.findById(id);
    if (!emprunt) throw new Error('Emprunt introuvable');

    // Récupérer le livre correspondant
    const book = await this.bookModel.findById(emprunt.idLivre);
    if (!book) throw new Error('Livre introuvable');

    // Incrémenter les copies disponibles
    book.copiesDisponibles += 1;
    await book.save();

    // Mettre à jour l’emprunt
    emprunt.dateRetourReel = new Date();
    emprunt.statut = 'Terminé';
    return emprunt.save();
  }

  // Supprimer un emprunt
  async delete(id: string) {
    return this.empruntModel.findByIdAndDelete(id);
  }
}
