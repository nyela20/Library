import { useState } from "react";
// 👈 Importation de Link pour l'accessibilité
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // Utilisation du même CSS pour l'alignement visuel

export default function Register() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  
  // Rôle par défaut (utilisateur simple), setRole est omis car non utilisé.
  const [role] = useState("utilisateur"); 
  
  // États pour un feedback clair
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); 
    setIsSuccess(false);

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, email, motdepasse, role }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Succès
        setMessage("✅ Compte créé avec succès. Redirection vers la connexion...");
        setIsSuccess(true);
        
        setTimeout(() => {
          navigate("/login");
        }, 1500); 
        
      } else {
        // Échec (Email déjà pris, validation, etc.)
        setMessage(data.message || "Erreur lors de la création du compte.");
        setIsSuccess(false);
      }
    } catch (err) {
      // Erreur réseau (serveur éteint ou injoignable)
      setMessage("❌ Erreur de connexion au serveur. Vérifiez que l'API est lancée.");
      setIsSuccess(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        
        {/* Panneau de Gauche (Info et Branding) */}
        <div className="login-left-panel">
          {/* 👈 IMAGE AJOUTÉE ICI pour être cohérent avec Login.jsx */}
          <img
            src={`${process.env.PUBLIC_URL}/images/lorraine.png`}
            alt="Université de Lorraine Logo"
            className="university-logo"
          />
          <h2>Créer votre Compte Étudiant</h2>
          <p>
            Inscrivez-vous pour accéder à la gestion de vos emprunts et réservations.
          </p>
          {/* Le bouton renvoie vers la page de connexion */}
          <button className="btn-home" onClick={() => navigate("/login")}>
            J'ai déjà un compte
          </button>
        </div>

        {/* Panneau de Droite (Formulaire) */}
        <div className="login-right-panel">
          <h3 className="login-heading">Inscription Étudiant</h3>
          <p className="login-subheading">Rejoignez notre communauté de lecteurs.</p>

          <form onSubmit={handleSubmit} className="login-form">
            
            {/* Champ Nom complet */}
            <div className="form-group">
              <label htmlFor="nom">Nom complet</label>
              <input
                id="nom"
                type="text"
                className="form-input"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </div>
            
            {/* Champ Email */}
            <div className="form-group">
              <label htmlFor="email">Adresse e-mail universitaire</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="ex: prenom.nom@etu.univ-lorraine.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            {/* Champ Mot de passe */}
            <div className="form-group">
              <label htmlFor="motdepasse">Mot de passe</label>
              <input
                id="motdepasse"
                type="password"
                className="form-input"
                placeholder="Créez votre mot de passe"
                value={motdepasse}
                onChange={(e) => setMotdepasse(e.target.value)}
                required
              />
            </div>

            {/* Champ Rôle (Masqué) */}
            <div className="form-group" style={{ display: 'none' }}>
              <label htmlFor="role">Rôle</label>
              <input id="role" type="text" value={role} readOnly className="form-input" />
            </div>


            {/* Affichage des messages (avec classes conditionnelles) */}
            {message && (
              <p className={isSuccess ? "success-message" : "error-message"}>
                {message}
              </p>
            )}
            
            <button type="submit" className="btn-submit">
              Créer le compte
            </button>
          </form>

          <div className="login-footer">
             <p>
                Déjà inscrit ? 
                {/* Utilisation de <Link> pour l'accessibilité */}
                <Link to="/login" className="help-link">
                   Connectez-vous ici.
                </Link>
             </p>
             <small>© 2025 Bibliothèque Universitaire de Lorraine</small>
          </div>
        </div>
      </div>
    </div>
  );
}




/*import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Register() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, email, motdepasse }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        navigate("/login");
      } else {
        setMessage(data.message || "Impossible de créer le compte");
      }
    } catch (err) {
      setMessage("Erreur de connexion au serveur");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-right-panel">
          <h3>Créer un compte</h3>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Nom complet</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Mot de passe</label>
              <input
                type="password"
                value={motdepasse}
                onChange={(e) => setMotdepasse(e.target.value)}
                required
              />
            </div>
            {message && <p style={{ color: "red" }}>{message}</p>}
            <button type="submit">Créer le compte</button>
          </form>
        </div>
      </div>
    </div>
  );
}*/
