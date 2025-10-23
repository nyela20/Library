import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../static/css/Dashboard.css'; // utilise le même fichier CSS que personnel

export default function DashboardMembre() {
    const navigate = useNavigate();
    const [userName] = useState("Membre"); // tu peux récupérer le nom depuis le token si tu veux

    // Déconnexion
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
        navigate('/login');
    };

    // Vérification du token et du rôle
    useEffect(() => {}, [navigate]);

    return (
        <div className="dashboard-layout">
            <div className="dashboard-header">
                <button onClick={handleLogout} className="btn-logout">
                    Déconnexion
                </button>
            </div>

            <div className="dashboard-content member-bg">
                <h1 className="main-heading">Tableau de Bord Membre 📖</h1>
                <p className="sub-heading">
                    Bienvenue, <strong>{userName}</strong> ! Suivez vos emprunts, réservations et activités.
                </p>

                <div className="stats-grid">
                    <div className="stat-card blue">
                        <h3>Livres Empruntés</h3>
                        <p className="stat-number">5</p>
                        <small>Vous avez des retours à effectuer</small>
                    </div>
                    <div className="stat-card green" onClick={() => navigate('/membre/reservations')}>
                        <h3>Mes Réservations</h3>
                        <p className="stat-number">3</p>
                        <small>Voir vos réservations en cours</small>
                    </div>
                    <div className="stat-card orange" onClick={() => navigate('/membre/historique')}>
                        <h3>Historique</h3>
                        <p className="stat-number">12</p>
                        <small>Voir votre historique d'emprunts</small>
                    </div>
                </div>

                <div className="quick-actions">
                    <h2>Actions Rapides</h2>
                    <button className="btn-action member-btn" onClick={() => navigate('/membre/nouveautes')}>
                        Découvrir les Nouveautés
                    </button>
                    <button className="btn-action member-btn" onClick={() => navigate('/membre/notifications')}>
                        Mes Notifications
                    </button>
                </div>
            </div>
        </div>
    );
}
