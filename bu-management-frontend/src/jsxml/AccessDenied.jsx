// src/pages/AccessDenied.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../static/css/AccessDenied.css'; 

export default function AccessDenied() {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message || "Vous n'avez pas les droits pour accéder à cette page.";

  return (
    <div className="access-denied-page">
      <h1>🚫 Accès refusé</h1>
      <p>{message}</p>
      <button className="btn-back" onClick={() => navigate(-1)}>
        Revenir en arrière 
      </button>
    </div>
  );
}
