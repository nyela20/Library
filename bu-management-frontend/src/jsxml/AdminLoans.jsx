import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../static/css/AdminLoans.css';

const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

export default function AdminLoans() {
  const [loans, setLoans] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('access_token');

  useEffect(() => {
    const fetchLoansAndUsers = async () => {
      try {
        setLoading(true);
        const token = getToken();

        // --- 1. Récupération des emprunts
        const resLoans = await fetch(`${API}/emprunts`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!resLoans.ok) throw new Error('Erreur lors du chargement des emprunts');
        const loansData = await resLoans.json();

        // --- 2. Récupérer les utilisateurs pour afficher leur email
        const resUsers = await fetch(`${API}/users`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const usersData = await resUsers.json();

        const map = {};
        usersData.forEach((u) => {
          map[u._id] = u.email || u.nom || 'Utilisateur inconnu';
        });

        setUsersMap(map);
        setLoans(loansData);
      } catch (err) {
        console.error('Erreur récupération données :', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoansAndUsers();
  }, []);

  const handleValidate = async (loan) => {
    if (processingId) return;
    setProcessingId(loan._id);

    try {
      const token = getToken();
      const res = await fetch(`${API}/emprunts/${loan._id}/return`, {
        method: 'PATCH',
        headers: token
          ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
          : { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Erreur lors de la validation');

      setLoans((prev) =>
        prev.map((l) =>
          l._id === loan._id ? { ...l, statut: 'Rendu' } : l
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message || 'Erreur serveur');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="no-results">Chargement des emprunts...</div>;

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h1 className="admin-title">Gestion des Emprunts</h1>
        <button className="btn-back" onClick={() => navigate('/dashboard-personnel')}>
          &larr; Retour au Dashboard
        </button>
      </div>

      <div className="book-table-wrapper">
        {loans.length === 0 ? (
          <p className="no-results">Aucun emprunt trouvé.</p>
        ) : (
          <table className="book-table">
            <thead>
              <tr>
                <th>Livre</th>
                <th>Emprunteur</th>
                <th>Statut</th>
                <th>Date d'emprunt</th>
                <th>Date retour prévue</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((l) => {
                const bookTitle =
                  typeof l.idLivre === 'object'
                    ? l.idLivre.titre
                    : l.idLivre || 'Titre inconnu';

                const borrowerEmail = usersMap[l.idEmprunte] || 'Inconnu';
                const returnDate = l.dateRetourPrevu
                  ? new Date(l.dateRetourPrevu)
                  : null;
                const isLate =
                  l.statut === 'En cours' &&
                  returnDate &&
                  returnDate < new Date();

                return (
                  <tr
                    key={l._id}
                    className={isLate ? 'late-row' : ''}
                    title={isLate ? 'Emprunt en retard !' : ''}
                  >
                    <td className="book-title-cell">
                      <strong>{bookTitle}</strong>
                      {isLate && (
                        <span className="late-badge">En retard</span>
                      )}
                    </td>
                    <td>{borrowerEmail}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          l.statut === 'En cours' ? 'zero' : 'available'
                        }`}
                      >
                        {l.statut}
                      </span>
                    </td>
                    <td>
                      {l.dateEmprunt
                        ? new Date(l.dateEmprunt).toLocaleDateString()
                        : '-'}
                    </td>
                    <td
                      style={{
                        color: isLate ? '#dc2626' : 'inherit',
                        fontWeight: isLate ? 'bold' : 'normal',
                      }}
                    >
                      {returnDate ? returnDate.toLocaleDateString() : '-'}
                    </td>
                    <td>
                      {l.statut === 'En cours' && (
                        <button
                          onClick={() => handleValidate(l)}
                          disabled={processingId === l._id}
                          className="btn-action-icon edit"
                        >
                          {processingId === l._id ? 'En cours...' : 'Terminer'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
