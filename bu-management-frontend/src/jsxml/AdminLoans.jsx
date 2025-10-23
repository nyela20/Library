import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../static/css/AdminLoans.css';

const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

export default function AdminLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  // Charger tous les emprunts
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await fetch(`${API}/emprunts`);
        if (!res.ok) throw new Error('Erreur lors du chargement des emprunts');
        const data = await res.json();
        setLoans(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  // Valider un emprunt (retour de livre)
  const handleValidate = async (loan) => {
    if (processingId) return;
    setProcessingId(loan._id);

    try {
      const res = await fetch(`${API}/emprunts/${loan._id}/return`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error('Erreur lors de la validation');

      // Mise à jour locale
      setLoans(prev => prev.map(l =>
        l._id === loan._id ? { ...l, statut: 'Rendu', idLivre: { ...l.idLivre, copiesDisponibles: (l.idLivre?.copiesDisponibles ?? 0) + 1 } } : l
      ));
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
                <th>Emprunt ID</th>
                <th>Utilisateur</th>
                <th>Livre</th>
                <th>Statut</th>
                <th>Date d'emprunt</th>
                <th>Date retour prévue</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((l) => {
                const bookTitle = typeof l.idLivre === 'object' ? l.idLivre.titre : l.idLivre;
                const userEmail = typeof l.idEmprunte === 'object' ? l.idEmprunte.email || l.idEmprunte.name : l.idEmprunte;

                return (
                  <tr key={l._id}>
                    <td>{l._id}</td>
                    <td>{userEmail}</td>
                    <td className="book-title-cell">
                      <strong>{bookTitle}</strong>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          l.statut === 'En cours'
                            ? 'zero'
                            : 'available'
                        }`}
                      >
                        {l.statut}
                      </span>
                    </td>
                    <td>{new Date(l.dateEmprunt).toLocaleDateString()}</td>
                    <td>{l.dateRetourPrevu ? new Date(l.dateRetourPrevu).toLocaleDateString() : '-'}</td>
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
