import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../static/css/UserManagement.css';

const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requesting, setRequesting] = useState(null); // id de l'utilisateur en action

  // --- Charger les utilisateurs depuis le backend ---
  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/users`);
        if (!res.ok) throw new Error('Erreur lors du chargement des utilisateurs');
        const data = await res.json();
        if (mounted) setUsers(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Erreur inconnue');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchUsers();
    return () => { mounted = false; };
  }, []);

  // --- Changer le rôle d’un utilisateur ---
  const handleChangeRole = async (userId, currentRole) => {
    const newRole = currentRole === 'membre' ? 'personnel' : 'membre';
    if (!window.confirm(`Voulez-vous changer le rôle à "${newRole.toUpperCase()}" ?`)) return;

    setRequesting(userId);
    try {
      const res = await fetch(`${API}/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error('Erreur serveur lors du changement de rôle');
      // Mise à jour locale
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert(err.message);
    } finally {
      setRequesting(null);
    }
  };

  // --- Supprimer un utilisateur ---
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer "${userName}" ?`)) return;

    setRequesting(userId);
    try {
      const res = await fetch(`${API}/users/${userId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setUsers(users.filter(u => u.id !== userId));
      alert(`Utilisateur "${userName}" supprimé ✅`);
    } catch (err) {
      alert(err.message);
    } finally {
      setRequesting(null);
    }
  };

  // --- Rendu ---
  if (loading) {
    return <div className="dashboard-content" style={{ padding: '50px' }}>Chargement des utilisateurs...</div>;
  }

  if (error && users.length === 0) {
    return <div className="dashboard-content error-message" style={{ padding: '50px' }}>{error}</div>;
  }

  return (
    <div className="dashboard-layout">
      <div className="dashboard-header">
        <button 
          onClick={() => navigate('/dashboard-personnel')}
          className="btn-action admin-btn back-btn"
        >
          ← Retour au Tableau de Bord
        </button>
      </div>

      <div className="dashboard-content user-management-page">
        <h1 className="main-heading">
          Gestion des Comptes Utilisateurs ⚙️
          {error && <span style={{ color: '#dc3545', fontSize: '0.9rem', marginLeft: '15px' }}>({error})</span>}
        </h1>
        <p className="sub-heading">
          Visualisez, modifiez les rôles et gérez l'accès des membres et du personnel.
        </p>

        <div className="user-list-container">
          {users.length === 0 ? (
            <p style={{ padding: '20px', textAlign: 'center' }}>Aucun utilisateur trouvé.</p>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id || user._id}>
                    <td>{user.id || user._id}</td>
                    <td>{user.name || user.nom || 'Inconnu'}</td>
                    <td>{user.email}</td>
                    <td className={`role-${user.role}`}>{(user.role || 'membre').toUpperCase()}</td>
                    <td className={`status-${(user.status || 'Actif').toLowerCase()}`}>{user.status || 'Actif'}</td>
                    <td>
                      <button 
                        onClick={() => handleChangeRole(user.id || user._id, user.role)}
                        className="btn-action btn-role-toggle"
                        disabled={requesting === user.id}
                      >
                        {user.role === 'membre' ? 'Promouvoir' : 'Rétrograder'}
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id || user._id, user.name)}
                        className="btn-action btn-delete"
                        disabled={requesting === user.id}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table >
          )}
        </div>
      </div>
    </div>
  );
}
