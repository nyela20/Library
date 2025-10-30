import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminBookList.css';

export default function AdminBookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // --- Récupérer tous les livres depuis le backend ---
  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/books', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error('Erreur de récupération des livres:', err);
      setError('Impossible de charger le catalogue. Vérifiez la connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // --- Supprimer un livre ---
  const handleDelete = async (_id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) return;

    try {
      const response = await fetch(`http://localhost:3000/books/${_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      setBooks(books.filter(book => book._id !== _id));
      alert('Livre supprimé avec succès !');
    } catch (err) {
      console.error('Erreur lors de la suppression :', err);
      alert('Impossible de supprimer le livre. Vérifiez le serveur.');
    }
  };

  // --- Modifier un livre (exemple : titre et auteur) ---
  const handleEdit = async (book) => {
    const newTitle = prompt('Nouveau titre :', book.titre);
    if (!newTitle) return;
    const newAuthor = prompt('Nouvel auteur :', book.auteur);
    if (!newAuthor) return;

    try {
      const response = await fetch(`http://localhost:3000/books/${book._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ titre: newTitle, auteur: newAuthor })
      });

      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const updatedBook = await response.json();
      setBooks(books.map(b => (b._id === updatedBook._id ? updatedBook : b)));
      alert('Livre modifié avec succès !');
    } catch (err) {
      console.error('Erreur lors de la modification :', err);
      alert('Impossible de modifier le livre. Vérifiez le serveur.');
    }
  };

  // --- Filtrer les livres par titre ou auteur ---
  const filteredBooks = books.filter(book =>
    book.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.auteur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="admin-page-container"><h1>Chargement du catalogue...</h1></div>;
  if (error) return (
    <div className="admin-page-container">
      <h1 style={{color:'red'}}>Erreur de chargement</h1>
      <p>{error}</p>
      <button onClick={fetchBooks}>Réessayer</button>
    </div>
  );

  return (
    <div className="admin-page-container">
      <header className="admin-header">
        <h1 className="admin-title">Gestion du Catalogue de Livres ({books.length})</h1>
        <div className="admin-actions">
          <button className="btn-back" onClick={() => navigate('/admin/dashboard')}>&larr; Tableau de bord</button>
          <button className="btn-add" onClick={() => navigate('/admin/add-book')}>+ Ajouter un livre</button>
        </div>
      </header>

      <div className="admin-search-bar">
        <input
          type="text"
          placeholder="Rechercher par titre ou auteur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search-input"
        />
      </div>

      <div className="book-table-wrapper">
        <table className="book-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre & Auteur</th>
              <th>Année</th>
              <th>Catégorie</th>
              <th>Stock Total</th>
              <th>Disponible</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length > 0 ? filteredBooks.map(book => (
              <tr key={book._id}>
                <td>{book.idLivre}</td>
                <td><strong>{book.titre}</strong><br/><small>{book.auteur}</small></td>
                <td>{book.anneePublication}</td>
                <td>{book.genre}</td>
                <td>{book.copiesTotales}</td>
                <td>{book.copiesDisponibles}</td>
                <td>
                  <button className="btn-action-icon edit" onClick={() => handleEdit(book)}>Modifier</button>
                  <button className="btn-action-icon delete" onClick={() => handleDelete(book._id)}>Supprimer</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="no-results">Aucun livre trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
