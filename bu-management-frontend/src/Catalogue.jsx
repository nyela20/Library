import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Catalogue.css';

const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

// Helper pour transformer le livre du backend au format affichage
function mapBook(b) {
  // backend peut utiliser titre/auteur ou title/author — on normalise
  return {
    id: b._id || b.id,
    title: b.titre || b.title || 'Sans titre',
    author: b.auteur || b.author || 'Inconnu',
    year: b.anneePublication || b.year || '',
    category: b.genre || b.category || 'Autre',
    copiesDisponibles: b.copiesDisponibles ?? b.availableCopies ?? 0,
    copiesTotales: b.copiesTotales ?? b.totalCopies ?? 1,
    // status dérivé
    status: (b.copiesDisponibles ?? 0) > 0 ? 'Disponible' : 'Emprunté',
    raw: b, // garde le doc complet si besoin
  };
}

export default function Catalogue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [books, setBooks] = useState([]); // chargé depuis backend
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(null); // id du livre en cours d'action
  const navigate = useNavigate();

  // Récupérer userId (ex: depuis le localStorage, token, contexte...)
  const userId = localStorage.getItem('userId') || '670c9e0a77bbf9ab98f8b123';

  // 1) charger les livres depuis l'API
  useEffect(() => {
    let mounted = true;
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/books`);
        if (!res.ok) throw new Error('Erreur récupération livres');
        const data = await res.json();
        if (mounted) {
          const mapped = data.map(mapBook);
          setBooks(mapped);
        }
      } catch (err) {
        console.error(err);
        // tu peux afficher une alerte jolie ici
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchBooks();
    return () => { mounted = false; };
  }, []);

  // Filtrage local (search + category)
  const visibleBooks = books.filter(book => {
    const matchesSearch = (book.title + ' ' + book.author).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Fonction pour emprunter ou réserver
  const handleBookAction = async (book) => {
    if (requesting) return; // éviter double clic
    setRequesting(book.id);

    try {
      if (book.copiesDisponibles > 0) {
        // Emprunter
        const res = await fetch(`${API}/emprunts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idLivre: book.id, idEmprunte: userId }),
        });
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || 'Erreur lors de l’emprunt');
        }
        const emprunt = await res.json();

        // Mise à jour UI (optimistic) : décrémente copiesDisponibles
        setBooks(prev => prev.map(b => {
          if (b.id === book.id) {
            const newCopies = (b.copiesDisponibles ?? 0) - 1;
            return { ...b, copiesDisponibles: newCopies, status: newCopies > 0 ? 'Disponible' : 'Emprunté' };
          }
          return b;
        }));

        alert(`Vous avez emprunté "${book.title}" ✅`);
      } else {
        // Réserver
        const res = await fetch(`${API}/reservations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idLivre: book.id, idEmprunte: userId }),
        });
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || 'Erreur lors de la réservation');
        }
        const reservation = await res.json();

        // Optionnel : marquer qu'il y a une réservation (UI simple)
        setBooks(prev => prev.map(b => b.id === book.id ? { ...b, reserved: true } : b));
        alert(`Réservation enregistrée pour "${book.title}" 📚`);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Erreur serveur');
    } finally {
      setRequesting(null);
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
        <input
          type="text"
          placeholder="Rechercher par titre, auteur ou ISBN..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

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
        {loading ? (
          <p className="no-results">Chargement des livres...</p>
        ) : visibleBooks.length > 0 ? (
          visibleBooks.map(book => (
            <div key={book.id} className="book-card">
              <div className="book-details">
                <h3 className="book-title">{book.title} ({book.year})</h3>
                <p className="book-author">Auteur : {book.author}</p>
                <p>Copies disponibles : {book.copiesDisponibles}</p>
                <span className={`book-category ${book.category.toLowerCase()}`}>{book.category}</span>
              </div>

              <div className="book-actions">
                <span className={`book-status ${book.status.split(' ')[0].toLowerCase()}`}>
                  {book.status}
                </span>
                <button
                  className={`btn-action-book ${book.copiesDisponibles > 0 ? 'available' : 'reserve'}`}
                  onClick={() => handleBookAction(book)}
                  disabled={requesting === book.id}
                >
                  {requesting === book.id ? 'En cours...' : (book.copiesDisponibles > 0 ? 'Emprunter' : 'Réserver')}
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
