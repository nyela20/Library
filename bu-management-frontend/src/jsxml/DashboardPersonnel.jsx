// src/jsxml/DashboardPersonnel.jsx  (ou où tu as ton fichier)
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../static/css/DashboardPersonnel.css';

const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

export default function DashboardPersonnel() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);

  // Statistiques dynamiques
  const [lateCount, setLateCount] = useState(0);
  const [stockTotal, setStockTotal] = useState(0);
  const [stockDispo, setStockDispo] = useState(0);

  // Modal retards
  const [lateModalOpen, setLateModalOpen] = useState(false);
  const [lateLoading, setLateLoading] = useState(false);
  const [lateItems, setLateItems] = useState([]); // éléments : { loan, book, daysLate }

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    navigate('/');
  };

  // Récupération du nom
  useEffect(() => {
    const storedUserName = localStorage.getItem('user_name');
    if (storedUserName) setUserName(storedUserName);
    else setUserName('Personnel');
  }, []);

  // Récupération des données dynamiques (count, stocks)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. Livres en retard (on récupère les emprunts)
        const resLoans = await fetch(`${API}/emprunts`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        if (!resLoans.ok) throw new Error('Erreur récupération emprunts');
        const loans = await resLoans.json();
        const now = new Date();
        const lateLoans = loans.filter(l => l.statut === 'En cours' && new Date(l.dateRetourPrevu) < now);
        setLateCount(lateLoans.length);

        // 2. Stock total
        const resBooks = await fetch(`${API}/books`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        if (!resBooks.ok) throw new Error('Erreur récupération livres');
        const books = await resBooks.json();
        const totalCopies = books.reduce((acc, b) => acc + (b.copiesTotales ?? 0), 0);
        const availableCopies = books.reduce((acc, b) => acc + (b.copiesDisponibles ?? 0), 0);
        setStockTotal(totalCopies);
        setStockDispo(availableCopies);

      } catch (err) {
        console.error('Erreur récupération stats :', err);
      }
    };

    fetchStats();
  }, []);

  // Ouvrir le modal et charger les détails de retards
  const openLateModal = async () => {
    setLateModalOpen(true);
    setLateLoading(true);
    setLateItems([]);
    try {
      // 1) récupérer tous les emprunts
      const resLoans = await fetch(`${API}/emprunts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      if (!resLoans.ok) throw new Error('Erreur récupération emprunts');
      const loans = await resLoans.json();

      // 2) filtrer ceux en retard
      const now = new Date();
      const lateLoans = loans.filter(l => l.statut === 'En cours' && new Date(l.dateRetourPrevu) < now);

      if (lateLoans.length === 0) {
        setLateItems([]);
        setLateLoading(false);
        return;
      }

      // 3) récupérer les livres correspondants (optimisation : ids uniques)
      const uniqueBookIds = [...new Set(lateLoans.map(l => (typeof l.idLivre === 'object' ? l.idLivre._id : l.idLivre)).filter(Boolean))];
      let booksMap = {};
      if (uniqueBookIds.length > 0) {
        const resBooks = await fetch(`${API}/books?ids=${uniqueBookIds.join(',')}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        if (resBooks.ok) {
          const books = await resBooks.json();
          books.forEach(b => {
            const key = b._id || b.id || b.idLivre;
            booksMap[key] = b;
          });
        } else {
          console.warn('Impossible de récupérer détails des livres pour les retards');
        }
      }

      // 4) combiner et calculer daysLate
      const items = lateLoans.map(loan => {
        const bookId = typeof loan.idLivre === 'object' ? loan.idLivre._id : loan.idLivre;
        const book = booksMap[bookId] || (loan.idLivre && typeof loan.idLivre === 'object' ? loan.idLivre : null);
        const dateRetour = new Date(loan.dateRetourPrevu);
        const diffMs = new Date().getTime() - dateRetour.getTime();
        const daysLate = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return { loan, book, daysLate };
      });

      setLateItems(items);
    } catch (err) {
      console.error('Erreur chargement retards :', err);
      setLateItems([]);
    } finally {
      setLateLoading(false);
    }
  };

  const closeLateModal = () => {
    setLateModalOpen(false);
    setLateItems([]);
  };

  // helper: format date
  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return iso || '—';
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-content staff-bg">
        <div className="dashboard-header">
          <button onClick={handleLogout} className="btn-logout">Déconnexion</button>
        </div>

        <h1 className="main-heading">Tableau de Bord Personnel 📚👩‍💼</h1>
        <p className="sub-heading">
          Bienvenue, <strong>{userName || 'Chargement...'}</strong>. Outils de gestion et statistiques avancées de la BU.
        </p>

        <div className="stats-grid">
          <div className="stat-card red" onClick={openLateModal} style={{ cursor: 'pointer' }}>
            <h3>Livres en Retard</h3>
            <p className="stat-number">{lateCount}</p>
            <small>Nécessite une relance urgente — cliquer pour voir</small>
          </div>

          <div className="stat-card purple" onClick={() => navigate('/admin/gestion-livres')}>
            <h3>Stock Total</h3>
            <p className="stat-number">{stockDispo} / {stockTotal}</p>
            <small>Copies disponibles / totales</small>
          </div>

          <div className="stat-card teal" onClick={() => navigate('/admin/predictions')}>
            <h3>Prédictions ML</h3>
            <p className="stat-number">Voir l'Analyse</p>
            <small>Tendances d'emprunt pour le mois prochain</small>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Gestion du Jour</h2>
          <button className="btn-action admin-btn" onClick={() => navigate('/AdminLoans')}>Valider les Retours & Emprunts</button>
          <button className="btn-action admin-btn" onClick={() => navigate('/usermanagement')}>Gérer les Comptes Utilisateurs</button>
          <button className="btn-action admin-btn" onClick={() => navigate('/predictions')}>Tester le Modèle de Prédiction 🚀</button>
          <button className="btn-action admin-btn" onClick={() => navigate('/AdminBookList')}>Parcourir le Catalogue</button>
        </div>
      </div>

      {/* === Modal Livres en retard === */}
      {lateModalOpen && (
        <div className="modal-backdrop" onClick={closeLateModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <header className="modal-header">
              <h3>Livres en retard ({lateItems.length})</h3>
              <button className="modal-close" onClick={closeLateModal} aria-label="Fermer">✕</button>
            </header>

            <div className="modal-body">
              {lateLoading ? (
                <p>Chargement des retards...</p>
              ) : lateItems.length === 0 ? (
                <p>Aucun emprunt en retard pour le moment.</p>
              ) : (
                <table className="late-table">
                  <thead>
                    <tr>
                      <th>Titre</th>
                      <th>Emprunteur</th>
                      <th>Retour prévu</th>
                      <th>Jours de retard</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lateItems.map(({ loan, book, daysLate }, i) => (
                      <tr key={i}>
                        <td style={{ minWidth: 220 }}>
                          <strong>{book?.titre || loan.titre || 'Titre inconnu'}</strong>
                          <div style={{ fontSize: 12, color: '#6b7280' }}>{book?.auteur || loan.auteur || ''}</div>
                        </td>
                        <td>{loan.utilisateurEmail || loan.utilisateurNom || loan.utilisateur || 'Inconnu'}</td>
                        <td>{formatDate(loan.dateRetourPrevu)}</td>
                        <td style={{ color: daysLate > 7 ? '#b91c1c' : '#f97316' }}>{daysLate} j</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <footer className="modal-footer">
              <button className="btn-secondary" onClick={closeLateModal}>Fermer</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
