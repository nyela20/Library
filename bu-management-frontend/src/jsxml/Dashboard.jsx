import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../static/css/Dashboard.css';

const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';


function LoadingCard({ title = "Chargement…", subtitle }) {
  return (
    <div className="loading-viewport">
      <div className="loading-card" role="status" aria-live="polite" aria-busy="true">
        <div className="loading-left"><div className="spinner" /></div>
        <div className="loading-body">
          <h2 className="loading-title">{title}</h2>
          {subtitle && <p className="loading-sub">{subtitle}</p>}
          <div className="loading-skeleton">
            <div className="skeleton-row short" />
            <div className="skeleton-row medium" />
            <div className="skeleton-row long" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [reservations, setReservations] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'borrow' ou 'reservation'

  const userId = localStorage.getItem('user_id');
  const userName = localStorage.getItem('user_name');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
    navigate('/');
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [empruntsRes, reservationsRes] = await Promise.all([
          fetch(`${API}/emprunts/user/${userId}`),
          fetch(`${API}/reservations/user/${userId}`)
        ]);

        if (!empruntsRes.ok) throw new Error('Erreur chargement emprunts');
        if (!reservationsRes.ok) throw new Error('Erreur chargement réservations');

        const emprunts = await empruntsRes.json();
        const reservationsData = await reservationsRes.json();

        // --- Récupérer tous les IDs de livres valides ---
        const bookIds = [
          ...new Set([
            ...emprunts.map(e => e.idLivre).filter(Boolean),
            ...reservationsData.map(r => r.idLivre?._id || r.idLivre).filter(Boolean)
          ])
        ];

        // --- Récupérer les détails des livres ---
        const booksRes = await fetch(`${API}/books?ids=${bookIds.join(',')}`);
        const booksData = await booksRes.json();
        const booksMap = {};
        booksData.forEach(book => {
          booksMap[book._id || book.id] = book;
        });

        // --- Traiter emprunts ---
        const empruntsAvecLivres = emprunts
          .filter(e => e.statut === 'En cours')
          .map(e => ({ ...e, book: booksMap[e.idLivre] || null }));

        // --- Traiter réservations ---
        const reservationsAvecLivres = reservationsData.map(r => {
          let book = null;
          // Si idLivre est un objet complet
          if (r.idLivre && typeof r.idLivre === 'object' && r.idLivre._id) {
            book = r.idLivre;
          } else if (r.idLivre) {
            // Sinon récupérer depuis booksMap
            book = booksMap[r.idLivre] || null;
          }
          return { ...r, book };
        });

        setBorrowedBooks(empruntsAvecLivres);
        setReservations(reservationsAvecLivres);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchDashboardData();
  }, [userId]);

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType('');
  };

  if (loading) return <LoadingCard title="Chargement du tableau de bord…" subtitle="Préparation de vos données personnelles et recommandations" />;

  const modalBooks =
    modalType === 'borrow'
      ? borrowedBooks
      : modalType === 'reservation'
      ? reservations
      : [];

  return (
    <div className="dashboard-layout">
      <div className="dashboard-content student-bg">
        <div className="dashboard-header">
          <button onClick={handleLogout} className="btn-logout">Déconnexion</button>
        </div>

        <h1 className="main-heading">Mon Espace Étudiant 🎓</h1>
        <p className="sub-heading">
          Bienvenue {userName || 'étudiant(e)'}, dans votre portail de bibliothèque.
        </p>

        <div className="stats-grid">
          <div className="stat-card orange" onClick={() => openModal('borrow')}>
            <h3>Emprunts Actifs</h3>
            <p className="stat-number">{borrowedBooks.length}</p>
            <small>
              {borrowedBooks.length > 0
                ? `Prochain retour prévu : ${borrowedBooks
                    .map(e => new Date(e.dateRetourPrevu))
                    .sort((a,b)=>a-b)[0].toLocaleDateString()}`
                : 'Aucun emprunt en cours'}
            </small>
          </div>

          <div className="stat-card yellow" onClick={() => openModal('reservation')}>
            <h3>Réservations</h3>
            <p className="stat-number">{reservations.length}</p>
            {reservations.length > 0 && (
              <small>{reservations.map(r => r.book?.titre || 'Titre inconnu').join(', ')}</small>
            )}
          </div>

          <div className="stat-card pink">
            <h3>Suggestions ML</h3>
            <p className="stat-number">5 Nouveaux Titres</p>
            <small>Basé sur vos lectures récentes</small>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Actions Rapides</h2>
          <button className="btn-action" onClick={() => navigate('/catalogue')}>
            Faire une Nouvelle Réservation
          </button>
        </div>

        {/* --- Modal --- */}
        {modalOpen && (
          <div className="modal-backdrop" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="back-btn" onClick={closeModal}>Fermer</button>
              {modalBooks.length === 0 && <p>Aucun livre à afficher.</p>}
              {modalBooks.map((item, i) => {
                const book = item.book;
                if (!book) return null;
                return (
                  <div key={i} className="book-card-detail">
                    <img
                      src={book.urlcover || '/default-cover.jpg'}
                      alt={book.titre}
                      className="book-cover"
                    />
                    <div className="book-info">
                      <h3>{book.titre || 'Titre inconnu'}</h3>
                      <p>Auteur : {book.auteur || 'Inconnu'}</p>
                      {modalType === 'borrow' && item.dateRetourPrevu && (
                        <p style={{ color: new Date(item.dateRetourPrevu) < new Date() ? 'red' : 'black' }}>
                          Retour prévu : {new Date(item.dateRetourPrevu).toLocaleDateString()}
                        </p>                      
                      )}
                      <p>Résumé : {book.resume || 'Aucun résumé disponible.'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
