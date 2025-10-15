import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; 
export default function Login() {
  const [email, setEmail] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, motdepasse }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/dashboard");
      } else {
        setMessage(data.message || "Identifiants invalides");
      }
    } catch (error) {
      setMessage("Erreur de connexion au serveur");
    }
  };

  return (
    // Le conteneur principal de la page de connexion
    <div className="login-page">
      <div className="login-container">
        {/* Partie gauche: Informations et branding */}
        <div className="login-left-panel">
          <img
            // J'ai mis un lien de logo plus générique pour éviter les erreurs, mais vous pouvez mettre le vôtre
            src={`${process.env.PUBLIC_URL}/images/lorraine.png`}
            alt="Université de Lorraine Logo"
            className="university-logo"
          />
          <h2>Bienvenue à la Bibliothèque Universitaire</h2>
          <p>Votre portail pour explorer un monde de savoir.</p>
          <button className="btn-home" onClick={() => navigate("/")}>
            Retour à l'accueil
          </button>
        </div>

        {/* Partie droite: Formulaire de connexion */}
        <div className="login-right-panel">
          <h3 className="login-heading">Connexion Étudiant</h3>
          <p className="login-subheading">Accédez à vos ressources.</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Adresse e-mail universitaire</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="ex: prenom.nom@etu.univ-lorraine.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="Votre mot de passe"
                value={motdepasse}
                onChange={(e) => setMotdepasse(e.target.value)}
                required
              />
            </div>

            {message && <p className="error-message">{message}</p>}

            <button type="submit" className="btn-submit">
              Se connecter
            </button>
          </form>

          <div className="login-footer">
            <p>
              Besoin d'aide ?{" "}
              {/* CORRECTION ESLINT: Remplacé "#" par un chemin de route valide */}
              <a href="/support" className="help-link" onClick={(e) => {e.preventDefault(); navigate('/support');}}>
                Contactez le support
              </a>
            </p>
            <small>© 2025 Bibliothèque Universitaire de Lorraine</small>
          </div>
        </div>
      </div>
    </div>
  );
}