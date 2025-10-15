import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminBookList.css'; // Assurez-vous que le CSS est là

export default function AdminBookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // --- 1. FONCTION DE RÉCUPÉRATION DES DONNÉES ---
  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      // URL de votre API Backend
      const response = await fetch("http://localhost:3000/books", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('authToken')}` 
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setBooks(data); // Met à jour l'état avec les livres de MongoDB
    } catch (err) {
      console.error("Erreur de récupération des livres:", err);
      setError("Impossible de charger le catalogue. Vérifiez la connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // --- Fonctions de gestion (simulées) ---
  // Utilisation de book.idLivre pour identifier le livre
  const handleDelete = (idLivre) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce livre du catalogue ?")) {
      // TODO: Implémenter la requête DELETE API ici en utilisant idLivre
      setBooks(books.filter(book => book.idLivre !== idLivre)); 
    }
  };

  const handleEdit = (book) => {
    alert(`Modification de : ${book.titre}.`);
    // Redirection vers un formulaire d'édition: navigate('/admin/edit-book/' + book.idLivre)
  };

  // Filtrage basé sur les propriétés 'titre' et 'auteur'
  const filteredBooks = books.filter(book => 
    book.titre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    book.auteur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- 2. GESTION DE L'AFFICHAGE DU STATUT (LOADING / ERREUR) ---
  if (loading) {
    return (
      <div className="admin-page-container loading-state">
        <h1 className="admin-title">Chargement du Catalogue...</h1>
        <p>Récupération des données depuis MongoDB en cours.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page-container error-state">
        <h1 className="admin-title" style={{color: 'var(--danger-red)'}}>Erreur de Chargement</h1>
        <p>{error}</p>
        <button className="btn-add" onClick={fetchBooks}>Réessayer</button>
      </div>
    );
  }

  // --- 3. AFFICHAGE PRINCIPAL ---
  return (
    <div className="admin-page-container">
      <header className="admin-header">
        <h1 className="admin-title">Gestion du Catalogue de Livres ({books.length} titres)</h1>
        <div className="admin-actions">
          <button className="btn-back" onClick={() => navigate('/admin/dashboard')}>
            &larr; Tableau de Bord
          </button>
          <button className="btn-add" onClick={() => navigate('/admin/add-book')}>
            + Ajouter un Nouveau Livre
          </button>
        </div>
      </header>

      <div className="admin-search-bar">
        <input
          type="text"
          placeholder="Rechercher par titre ou auteur..."
          className="admin-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
            {filteredBooks.length > 0 ? (
              filteredBooks.map(book => (
                // ATTENTION: Utilisation de book.idLivre comme clé
                <tr key={book.idLivre}> 
                  <td>{book.idLivre}</td>
                  <td className="book-title-cell">
                    <strong>{book.titre}</strong>
                    <br />
                    <small>{book.auteur}</small>
                  </td>
                  <td>{book.anneePublication}</td>
                  <td><span className={`tag-category ${book.genre ? book.genre.toLowerCase() : 'default'}`}>{book.genre}</span></td>
                  <td>{book.copiesTotales}</td>
                  <td>
                    {/* Utilisation de book.copiesDisponibles */}
                    <span className={`status-badge ${book.copiesDisponibles > 0 ? 'available' : 'zero'}`}>
                      {book.copiesDisponibles}
                    </span>
                  </td>
                  <td>
                    <button className="btn-action-icon edit" onClick={() => handleEdit(book)}>Modifier</button>
                    <button className="btn-action-icon delete" onClick={() => handleDelete(book.idLivre)}>Supprimer</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">Aucun livre trouvé correspondant aux critères de recherche.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}