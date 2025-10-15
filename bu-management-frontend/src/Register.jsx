import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // on réutilise ton CSS

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nom, email, motdepasse }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Compte créé avec succès !");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(data.message || "Erreur lors de la création du compte");
      }
    } catch (error) {
      setMessage("Erreur de connexion au serveur");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left-panel">
          <img
            src={`${process.env.PUBLIC_URL}/images/lorraine.png`}
            alt="Université de Lorraine Logo"
            className="university-logo"
          />
          <h2>Bibliothèque Universitaire</h2>
          <p>Rejoignez-nous pour explorer un monde de savoir.</p>
          <button className="btn-home" onClick={() => navigate("/login")}>
            Retour à la connexion
          </button>
        </div>

        <div className="login-right-panel">
          <h3 className="login-heading">Créer un compte</h3>
          <p className="login-subheading">Inscrivez-vous pour accéder à la bibliothèque.</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="nom">Nom complet</label>
              <input
                type="text"
                id="nom"
                className="form-input"
                placeholder="Votre nom complet"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Adresse e-mail universitaire</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="prenom.nom@etu.univ-lorraine.fr"
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
                placeholder="Choisissez un mot de passe"
                value={motdepasse}
                onChange={(e) => setMotdepasse(e.target.value)}
                required
              />
            </div>

            {message && <p className="error-message">{message}</p>}

            <button type="submit" className="btn-submit">
              Créer un compte
            </button>
          </form>

          <div className="login-footer">
            <p>
              Déjà un compte ?{" "}
              <a
                href="/login"
                className="help-link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                Se connecter
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
