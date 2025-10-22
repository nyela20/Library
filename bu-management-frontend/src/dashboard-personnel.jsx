import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; 

export default function DashboardPersonnel() {
    const navigate = useNavigate();
    //  Initialiser le nom à null ou une chaîne vide
    const [userName, setUserName] = useState(null); 

    // Déconnexion (Inchangé, toujours correct)
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
        // Supprimer le nom aussi
        localStorage.removeItem('user_name'); 
        navigate('/login');
    };

    //  Vérification de l'authentification et du rôle + Récupération du nom
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const role = localStorage.getItem('user_role');
        // Récupérer le nom de l'utilisateur stocké
        const storedUserName = localStorage.getItem('user_name'); 

        if (!token || role !== 'personnel') {
            navigate('/login');
        } else {
            //  Mettre à jour l'état si le nom est trouvé
            if (storedUserName) {
                setUserName(storedUserName);
            } else {
                //  si le nom manque, on affiche un rôle générique
                setUserName("Personnel"); 
            }
        }
    }, [navigate]);

    return (
        <div className="dashboard-layout">
            {}
            
            

            <div className="dashboard-content staff-bg">
                <div className="dashboard-header">
                <button 
                    onClick={handleLogout} 
                    className="btn-logout"
                >
                    Déconnexion
                </button>
            </div>
                <h1 className="main-heading">Tableau de Bord Personnel 📚👩‍💼</h1>
                <p className="sub-heading">
                    {/* affichage conditionnel du nom */}
                    Bienvenue, <strong>{userName || 'Chargement...'}</strong>. Outils de gestion et statistiques avancées de la BU.
                </p>

                {/* Le reste du code est inchangé */}
                <div className="stats-grid">
                    <div className="stat-card red">
                        <h3>Livres en Retard</h3>
                        <p className="stat-number">42</p>
                        <small>Nécessite une relance urgente</small>
                    </div>
                    <div className="stat-card purple" onClick={() => navigate('/admin/gestion-livres')}>
                        <h3>Stock Total</h3>
                        <p className="stat-number">15 890</p>
                        <small>Gérer le catalogue et les inventaires</small>
                    </div>
                    <div className="stat-card teal" onClick={() => navigate('/admin/predictions')}>
                        <h3>Prédictions ML</h3>
                        <p className="stat-number">Voir l'Analyse</p>
                        <small>Tendances d'emprunt pour le mois prochain</small>
                    </div>
                </div>

                <div className="quick-actions">
                    <h2>Gestion du Jour</h2>
                    <button className="btn-action admin-btn" onClick={() => navigate('/predictions')}>Valider les Retours & Emprunts</button>
                    <button className="btn-action admin-btn" onClick={() => navigate('/usermanagement')}>Gérer les Comptes Utilisateurs</button>
                    
                    <button 
                        className="btn-action admin-btn" 
                        onClick={() => navigate('/predictions')}
                    >
                        Tester le Modèle de Prédiction 🚀
                    </button>
                </div>
            </div>
        </div>
    );
}