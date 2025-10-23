import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../static/css/Login.css'; // Design complet de l'université

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [motdepasse, setMotdepasse] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, motdepasse }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Stocker les informations utilisateur
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user_role', data.user.role);
        localStorage.setItem('user_name', data.user.nom);
        localStorage.setItem('user_id', data.user._id)

        // 🚀 Redirection selon le rôle
        switch (data.user.role) {
          case 'personnel':
            navigate('/dashboard-personnel');
            break;
          case 'membre':
            navigate('/dashboard-membre');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        setError(data.message || 'Email ou mot de passe incorrect.');
      }
    } catch (err) {
      console.error(err);
      setError('Erreur de connexion. Veuillez réessayer.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Partie gauche : Branding */}
        <div className="login-left-panel">
          <img
            src={`${process.env.PUBLIC_URL}/images/lorraine.png`}
            alt="Université de Lorraine"
            className="university-logo"
          />
          <h2>Université de Lorraine</h2>
          <p>Accédez à votre espace personnel pour gérer vos activités.</p>
          <button className="btn-home" onClick={() => navigate('/')}>
            Retour à l'accueil
          </button>
        </div>

        {/* Partie droite : Formulaire */}
        <div className="login-right-panel">
          <h3 className="login-heading">Connexion</h3>
          <p className="login-subheading">Veuillez entrer vos identifiants.</p>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Adresse e-mail</label>
              <input
                id="email"
                type="email"
                placeholder="prenom.nom@etu.univ-lorraine.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                placeholder="Votre mot de passe"
                value={motdepasse}
                onChange={(e) => setMotdepasse(e.target.value)}
                required
                className="form-input"
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="btn-submit">
              Se connecter
            </button>
          </form>

          <div className="login-footer">
            <p>
              Pas encore de compte ?{' '}
              <a
                href="/register"
                className="help-link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/register');
                }}
              >
                Créer un compte
              </a>
            </p>
            <small>© 2025 Bibliothèque Universitaire de Lorraine</small>
          </div>
        </div>
      </div>
    </div>
  );
}
