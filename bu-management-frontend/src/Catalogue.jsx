import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Catalogue.css';

const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

function mapBook(b) {
  return {
    id: b._id || b.id,
    title: b.titre || b.title || 'Sans titre',
    author: b.auteur || b.author || 'Inconnu',
    year: b.anneePublication || b.year || '',
    category: b.genre || b.category || 'Autre',
    copiesDisponibles: b.copiesDisponibles ?? b.availableCopies ?? 0,
    copiesTotales: b.copiesTotales ?? b.totalCopies ?? 1,
    status: (b.copiesDisponibles ?? 0) > 0 ? 'Disponible' : 'Emprunté',
    urlcover: b.urlcover || '', // l'attribut image
    raw: b,
  };
}

export default function Catalogue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null); // modal
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId') || '670c9e0a77bbf9ab98f8b123';

  // Charger livres depuis backend
  useEffect(() => {
    let mounted = true;
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/books`);
        if (!res.ok) throw new Error('Erreur récupération livres');
        const data = await res.json();
        if (mounted) setBooks(data.map(mapBook));
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchBooks();
    return () => { mounted = false; };
  }, []);

  const visibleBooks = books.filter(book => {
    const matchesSearch = (book.title + ' ' + book.author).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBookAction = async (book) => {
    if (requesting) return;
    setRequesting(book.id);

    try {
      if (book.copiesDisponibles > 0) {
        const res = await fetch(`${API}/emprunts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idLivre: book.id, idEmprunte: userId }),
        });
        if (!res.ok) throw new Error(await res.text() || 'Erreur emprunt');

        setBooks(prev => prev.map(b => b.id === book.id
          ? { ...b, copiesDisponibles: (b.copiesDisponibles ?? 0) - 1, status: (b.copiesDisponibles ?? 1) - 1 > 0 ? 'Disponible' : 'Emprunté' }
          : b
        ));
        alert(`Vous avez emprunté "${book.title}" ✅`);
      } else {
        const res = await fetch(`${API}/reservations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idLivre: book.id, idEmprunte: userId }),
        });
        if (!res.ok) throw new Error(await res.text() || 'Erreur réservation');
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
            <div key={book.id} className="book-card" onClick={() => setSelectedBook(book)}>
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
                  onClick={(e) => { e.stopPropagation(); handleBookAction(book); }}
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

      {/* --- Modal infos --- */}
      {selectedBook && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedBook(null)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff', padding: 20, borderRadius: 8,
              maxWidth: 800, width: '90%', maxHeight: '90%', overflowY: 'auto',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            }}
          >
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>{selectedBook.title} <small style={{ fontSize: 14, color: '#666' }}>— {selectedBook.author}</small></h2>
            </header>

            <section style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              <img
                src={selectedBook.urlcover || '/default-cover.jpg'}
                alt={`${selectedBook.title} couverture`}
                style={{ width: 160, height: 'auto', objectFit: 'cover', borderRadius: 4 }}
              />
              <div style={{ flex: 1 }}>
                <p><strong>Catégorie :</strong> {selectedBook.category}</p>
                <p><strong>Année :</strong> {selectedBook.year}</p>
                <p><strong>Status :</strong> {selectedBook.status}</p>
                <p><strong>Copies disponibles :</strong> {selectedBook.copiesDisponibles}</p>
                <p><strong>Résumé :</strong> {selectedBook.raw.resume || 'Aucun résumé disponible.'}</p>
              </div>
            </section>

            <footer style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12, gap: 12 }}>
              <button
                className={`btn-action-book ${selectedBook.copiesDisponibles > 0 ? 'available' : 'reserve'}`}
                onClick={() => handleBookAction(selectedBook)}
                disabled={requesting === selectedBook.id}
              >
                {requesting === selectedBook.id ? 'En cours...' : (selectedBook.copiesDisponibles > 0 ? 'Emprunter' : 'Réserver')}
              </button>
              <button onClick={() => setSelectedBook(null)} className="btn-add">Fermer</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
