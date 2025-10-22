import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Créez ce fichier pour le style

// --- Composant spécifique pour l'étudiant ---
// MODIFICATION CLÉ: Accepte 'navigate' en prop
const StudentDashboard = ({ navigate }) => (
  <div className="dashboard-content student-bg">
    <h1 className="main-heading">Mon Espace Étudiant 🎓</h1>
    <p className="sub-heading">Bienvenue dans votre portail de bibliothèque. Gérez vos ressources en un coup d'œil.</p>
    
    <div className="stats-grid">
      <div className="stat-card blue">
        <h3>Emprunts Actifs</h3>
        <p className="stat-number">3</p>
        <small>Livres à rendre avant le 20/10/2025</small>
      </div>
      <div className="stat-card gold">
        <h3>Réservations</h3>
        <p className="stat-number">1</p>
        <small>Votre position : 2ème pour "L'Étranger"</small>
      </div>
      <div className="stat-card green">
        <h3>Suggestions ML</h3>
        <p className="stat-number">5 Nouveaux Titres</p>
        <small>Basé sur vos lectures récentes</small>
      </div>
    </div>
    
    <div className="quick-actions">
      <h2>Actions Rapides</h2>
      
      {/* CORRECTION: 'navigate' est maintenant utilisable ici */}
      <button className="btn-action" onClick={() => navigate('/catalogue')}>Faire une Nouvelle Réservation</button>
      
      <button className="btn-action" onClick={() => navigate('/AdminBookList')}>Parcourir le Catalogue</button>
    </div>
  </div>
);

// --- Composant spécifique pour le personnel/gestionnaire ---
const StaffDashboard = ({ navigate }) => (
  <div className="dashboard-content staff-bg">
    <h1 className="main-heading">Tableau de Bord Administration 🛠️</h1>
    <p className="sub-heading">Outils de gestion et statistiques avancées de la BU.</p>
    
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
      <button className="btn-action admin-btn" onClick={() => navigate('/admin/emprunts')}>Valider les Retours & Emprunts</button>
      <button className="btn-action admin-btn" onClick={() => navigate('/admin/utilisateurs')}>Gérer les Comptes Utilisateurs</button>
    </div>
  </div>
);


// --- Composant Principal Dashboard ---
export default function Dashboard() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Définition de navigate ici

  useEffect(() => {
    // 1. SIMULATION DE RÉCUPÉRATION DU RÔLE
    const storedRole = localStorage.getItem('userRole') || 'etudiant'; 
    
    if (!storedRole) {
      navigate('/login');
      return;
    }

    setUserRole(storedRole);
    setLoading(false);
  }, [navigate]);

  // Correction Warning: Enlève le commentaire non-JSX
  if (loading) {
    return <div className="loading-screen">Chargement du tableau de bord...</div>;
  }

  return (
    <div className="dashboard-layout">
      {/* CORRECTION: Passage de la prop 'navigate' au StudentDashboard */}
      {userRole === 'etudiant' && <StudentDashboard navigate={navigate} />}
      {userRole === 'personnel' && <StaffDashboard navigate={navigate} />}
      
      {userRole !== 'etudiant' && userRole !== 'personnel' && (
        <div className="error-message">Rôle utilisateur invalide.</div>
      )}
    </div>
  );
}