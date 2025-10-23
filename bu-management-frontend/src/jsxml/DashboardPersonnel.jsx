import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../static/css/Dashboard.css'; 

const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

export default function DashboardPersonnel() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState(null);

    // Statistiques dynamiques
    const [lateCount, setLateCount] = useState(0);
    const [stockTotal, setStockTotal] = useState(0);
    const [stockDispo, setStockDispo] = useState(0);

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
        else setUserName("Personnel");
    }, []);

    // Récupération des données dynamiques
    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 1. Livres en retard
                const resLoans = await fetch(`${API}/emprunts`);
                const loans = await resLoans.json();
                const now = new Date();
                const late = loans.filter(l => l.statut === 'En cours' && new Date(l.dateRetourPrevu) < now).length;
                setLateCount(late);

                // 2. Stock total
                const resBooks = await fetch(`${API}/books`);
                const books = await resBooks.json();
                const totalCopies = books.reduce((acc, b) => acc + (b.copiesTotales ?? 0), 0);
                const availableCopies = books.reduce((acc, b) => acc + (b.copiesDisponibles ?? 0), 0);
                setStockTotal(totalCopies);
                setStockDispo(availableCopies);

            } catch (err) {
                console.error("Erreur récupération stats :", err);
            }
        };

        fetchStats();
    }, []);

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
                    <div className="stat-card red">
                        <h3>Livres en Retard</h3>
                        <p className="stat-number">{lateCount}</p>
                        <small>Nécessite une relance urgente</small>
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
        </div>
    );
}
