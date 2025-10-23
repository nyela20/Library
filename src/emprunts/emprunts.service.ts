import { Injectable,  NotFoundException, BadRequestException, InternalServerErrorException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Emprunt } from './emprunts.schema';
import { Book } from '../books/books.schema'; 


@Injectable()
export class EmpruntsService {
  constructor(
    @InjectModel(Emprunt.name) private empruntModel: Model<Emprunt>,
    @InjectModel(Book.name) private bookModel: Model<Book>,
  ) {}

  // Créer un nouvel emprunt
  async createEmprunt(idLivre: string, idEmprunte: string) {
    // validation id
    if (!Types.ObjectId.isValid(idLivre) || !Types.ObjectId.isValid(idEmprunte)) {
      throw new BadRequestException('ID invalide');
    }

    const objectIdLivre = new Types.ObjectId(idLivre);
    const objectIdEmprunte = new Types.ObjectId(idEmprunte);

    try {
      // findOneAndUpdate atomique : décrémente si copiesDisponibles > 0
      const updatedBook = await this.bookModel.findOneAndUpdate(
        { _id: objectIdLivre, copiesDisponibles: { $gt: 0 } },
        { $inc: { copiesDisponibles: -1 } },
        { new: true }
      ).exec();

      if (!updatedBook) {
        const exists = await this.bookModel.exists({ _id: objectIdLivre });
        if (!exists) throw new NotFoundException('Livre introuvable');
        throw new BadRequestException('Aucune copie disponible');
      }

      // crée l'emprunt (utilise create pour plus simple)
      const emprunt = await this.empruntModel.create({
        idLivre: objectIdLivre,
        idEmprunte: objectIdEmprunte,
        dateEmprunt: new Date(),
        dateRetourPrevu: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        statut: 'En cours',
      });

      return emprunt;
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof BadRequestException) throw err;
      // log here si tu veux (console.error ou logger)
      throw new InternalServerErrorException(err.message || 'Erreur lors de la création de l\'emprunt');
    }
  }

  // Récupérer tous les emprunts
  async findAll() {
    return this.empruntModel.find().populate('idLivre').exec();
  }

  // retrouver les emprunts par userId
  async findByUser(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('ID utilisateur invalide');
    }
    // Convertir en ObjectId
    const userObjectId = new Types.ObjectId(userId);
    return this.empruntModel.find({ idEmprunte: userObjectId }).exec();
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
    emprunt.statut = 'Rendu';
    return emprunt.save();
  }

  // Supprimer un emprunt
  async delete(id: string) {
    return this.empruntModel.findByIdAndDelete(id);
  }
}
