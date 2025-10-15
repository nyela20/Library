import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function EditBook() {
  const { state } = useLocation(); // Récupère le livre passé via navigate
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const navigate = useNavigate();

  const [titre, setTitre] = useState(state?.book?.titre || '');
  const [auteur, setAuteur] = useState(state?.book?.auteur || '');
  const [genre, setGenre] = useState(state?.book?.genre || '');
  const [anneePublication, setAnneePublication] = useState(state?.book?.anneePublication || '');
  const [copiesTotales, setCopiesTotales] = useState(state?.book?.copiesTotales || 0);

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ titre, auteur, genre, anneePublication, copiesTotales })
      });

      if (!response.ok) throw new Error('Erreur HTTP: ' + response.status);

      alert('Livre mis à jour avec succès !');
      navigate('/admin/books'); // Retour au catalogue
    } catch (err) {
      console.error(err);
      alert('Impossible de mettre à jour le livre.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Modifier le Livre</h1>
      <div>
        <label>Titre:</label>
        <input value={titre} onChange={(e) => setTitre(e.target.value)} />
      </div>
      <div>
        <label>Auteur:</label>
        <input value={auteur} onChange={(e) => setAuteur(e.target.value)} />
      </div>
      <div>
        <label>Genre:</label>
        <input value={genre} onChange={(e) => setGenre(e.target.value)} />
      </div>
      <div>
        <label>Année:</label>
        <input value={anneePublication} onChange={(e) => setAnneePublication(e.target.value)} />
      </div>
      <div>
        <label>Copies totales:</label>
        <input value={copiesTotales} onChange={(e) => setCopiesTotales(e.target.value)} type="number" />
      </div>
      <button onClick={handleSave}>Enregistrer</button>
      <button onClick={() => navigate('/admin/books')}>Annuler</button>
    </div>
  );
}
