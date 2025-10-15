import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Catalogue.css';

// Données de livres simulées pour l'affichage
const mockBooks = [
  { id: 1, title: "L'intelligence Artificielle pour les Nuls", author: "A. Dupont", status: "Disponible", category: "Science", year: 2023 },
  { id: 2, title: "Algorithmes et Structures de Données", author: "B. Martin", status: "Réservé (3 en attente)", category: "Informatique", year: 2020 },
  { id: 3, title: "Histoire de la Lorraine Médiévale", author: "C. Dubois", status: "Disponible", category: "Histoire", year: 2018 },
  { id: 4, title: "La Théorie des Contrats", author: "D. Petit", status: "Disponible", category: "Droit", year: 2022 },
  { id: 5, title: "Physique Quantique : Une Introduction", author: "E. Leroy", status: "Emprunté", category: "Science", year: 2019 },
];

export default function Catalogue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [books, setBooks] = useState(mockBooks);
  const navigate = useNavigate();

  // Fonction pour simuler la recherche et le filtrage
  useEffect(() => {
    const filtered = mockBooks.filter(book => {
      // Filtrer par terme de recherche
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            book.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtrer par catégorie
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
    setBooks(filtered);
  }, [searchTerm, selectedCategory]);

  const handleBookAction = (book) => {
    // Logique pour Emprunter ou Réserver
    if (book.status === 'Disponible') {
        alert(`Vous avez initié l'emprunt de : ${book.title}`);
        // Normalement, ici vous feriez une requête API pour enregistrer l'emprunt
    } else {
        alert(`Vous avez réservé : ${book.title}. Vous êtes en position 3.`);
        // Requête API pour enregistrer la réservation
    }
  };

  return (
    <div className="catalogue-page">
      <header className="catalogue-header">
        <h1 className="catalogue-title">Catalogue de la Bibliothèque 📚</h1>
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          &larr; Retour au Tableau de Bord
        </button>
      </header>

      <div className="search-controls-bar">
        {/* Barre de Recherche */}
        <input
          type="text"
          placeholder="Rechercher par titre, auteur ou ISBN..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {/* Filtre par Catégorie */}
        <select 
          className="category-select" 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">Toutes les Catégories</option>
          <option value="Science">Science</option>
          <option value="Informatique">Informatique</option>
          <option value="Histoire">Histoire</option>
          <option value="Droit">Droit</option>
        </select>
      </div>

      <div className="book-list-container">
        {books.length > 0 ? (
          books.map(book => (
            <div key={book.id} className="book-card">
              <div className="book-details">
                <h3 className="book-title">{book.title} ({book.year})</h3>
                <p className="book-author">Auteur : {book.author}</p>
                <span className={`book-category ${book.category.toLowerCase()}`}>{book.category}</span>
              </div>
              
              <div className="book-actions">
                <span className={`book-status ${book.status.split(' ')[0].toLowerCase()}`}>
                  {book.status}
                </span>
                <button 
                  className={`btn-action-book ${book.status === 'Disponible' ? 'available' : 'reserve'}`}
                  onClick={() => handleBookAction(book)}
                  disabled={book.status.includes('Emprunté')}
                >
                  {book.status === 'Disponible' ? 'Emprunter' : 'Réserver'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">Aucun livre trouvé correspondant à votre recherche.</p>
        )}
      </div>
    </div>
  );
}