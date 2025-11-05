import React, { useState } from 'react'; // Retrait de useEffect car il n'est pas nécessaire ici
import { useNavigate } from 'react-router-dom';
import '../static/css/Dashboard.css';

const API_BASE = (process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000').trim();

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token.trim()}` }),
    };
};

export default function PredictionTestPage() {
    const navigate = useNavigate();

    // États pour le formulaire de prédiction (utilisés par handleChange et handlePrediction)
    const [formData, setFormData] = useState({
        Type_de_document: 'Roman',
        Auteur: 'Victor Hugo',
        Nombre_de_localisations: 5,
        Nombre_d_exemplaires: 3,
    });
    const [predictionResult, setPredictionResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // NOUVEAUX ÉTATS pour la fonctionnalité Top Livres (utilisés par fetchTopBooks)
    const [showTopBooks, setShowTopBooks] = useState(false); 
    const [topBooks, setTopBooks] = useState([]);
    const [loadingTopBooks, setLoadingTopBooks] = useState(false);
    const [topBooksError, setTopBooksError] = useState(null);

    // 1. Fonction de Gestion du Formulaire (Utilise setFormData)
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value, 10) : value,
        }));
    };

    // 2. Fonction de Prédiction (Utilise setLoading, setError, setPredictionResult)
    const handlePrediction = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setPredictionResult(null);

        const API_URL = `${API_BASE}/predict_loan`.trim();

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const text = await res.text();
                const errorMessage = `Erreur ${res.status}: ${text || 'Erreur lors de la requête de prédiction.'}`;
                throw new Error(errorMessage);
            }

            const data = await res.json();
            const result = typeof data.predicted_loans === 'number' ? Math.round(data.predicted_loans) : data.predicted_loans;
            setPredictionResult(result);

        } catch (err) {
            console.error('Erreur API :', err);
            const isNetworkError = err.message.includes('Failed to fetch') || err.name === 'TypeError';
            const friendlyError = isNetworkError 
                ? "Impossible de contacter l'API. (Vérifiez : 1. API démarrée, 2. CORS configuré pour http://localhost:3001)" 
                : err.message;
            setError(friendlyError);
        } finally {
            setLoading(false);
        }
    };


    // 3. Fonction pour récupérer les données du Top 10 (Utilise setTopBooks, setLoadingTopBooks, setTopBooksError)
    const fetchTopBooks = async () => {
        if (topBooks.length > 0 && showTopBooks) {
            return; 
        }

        if (showTopBooks === false) {
            setLoadingTopBooks(true);
            setTopBooksError(null);
        }
       
        const API_URL = `${API_BASE}/top_loans`.trim();
        
        try {
            const res = await fetch(API_URL, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Erreur ${res.status}: ${text || "Erreur lors de la récupération des tops livres."}`);
            }

            const data = await res.json();
            setTopBooks(data);
        } catch (err) {
            console.error('Erreur API Top Books:', err);
            const friendlyError = err.message.includes('Failed to fetch') 
                ? "Impossible de contacter l'API pour les tops livres." 
                : err.message;
            setTopBooksError(friendlyError);
        } finally {
            setLoadingTopBooks(false);
        }
    };

    // 4. Gestion du clic sur le bouton de bascule
    const handleToggleTopBooks = () => {
        const newState = !showTopBooks;
        setShowTopBooks(newState);
        
        if (newState && topBooks.length === 0) {
            fetchTopBooks();
        }
    };

    // ------------------------------------
    // Composant de rendu (JSX)
    // ------------------------------------

    return (
        <div className="dashboard-layout">
            <div className="dashboard-header">
                <button onClick={() => navigate('/dashboard-personnel')} className="btn-action admin-btn back-btn">
                    ← Retour au Tableau de Bord
                </button>
            </div>

            <div className="dashboard-content prediction-page">
                <h1>Tester le Modèle de Prédiction des Prêts 🧠</h1>
                
                {/* Section 1: Formulaire de Prédiction */}
                <div className="prediction-form">
                    <form onSubmit={handlePrediction}>
                        <div className="form-group">
                            <label htmlFor="Type_de_document">Type de Document</label>
                            <select id="Type_de_document" name="Type_de_document" value={formData.Type_de_document} onChange={handleChange}>
                                <option value="Roman">Roman</option>
                                <option value="Bande dessinée">Bande Dessinée</option>
                                <option value="Périodique">Périodique</option>
                                <option value="Thèse">Thèse</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="Auteur">Auteur</label>
                            <input id="Auteur" type="text" name="Auteur" value={formData.Auteur} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="Nombre_de_localisations">Nombre de localisations</label>
                            <input id="Nombre_de_localisations" type="number" name="Nombre_de_localisations" value={formData.Nombre_de_localisations} onChange={handleChange} min="1" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="Nombre_d_exemplaires">Nombre d'exemplaires</label>
                            <input id="Nombre_d_exemplaires" type="number" name="Nombre_d_exemplaires" value={formData.Nombre_d_exemplaires} onChange={handleChange} min="1" />
                        </div>

                        <button type="submit" disabled={loading} className="btn-action prediction-btn">
                            {loading ? 'Prédiction en cours...' : 'Obtenir la Prédiction'}
                        </button>
                    </form>
                </div>
                
                {/* Affichage de l'erreur / résultat de la prédiction */}
                {error && (
                    <div className="prediction-result-box">
                         <p className="error-message">{error}</p>
                    </div>
                )}
                {predictionResult !== null && !loading && !error && (
                    <div className="prediction-result-box prediction-success">
                        <h3>Résultat de la Prédiction</h3>
                        <p>Le modèle prédit **<strong>{predictionResult}</strong>** prêts pour ce document.</p>
                        <small className="prediction-detail">Cette prédiction est une estimation basée sur le modèle d'apprentissage automatique.</small>
                    </div>
                )}

                {/* --- Séparateur Visuel --- */}
                <hr style={{ margin: '40px auto', maxWidth: '600px', borderTop: '1px dashed #ccc' }} />


                {/* Section 2: Bouton d'Affichage du Top 10 */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <button 
                        onClick={handleToggleTopBooks} 
                        className={`btn-action admin-btn ${showTopBooks ? 'btn-delete' : ''}`}
                    >
                        {showTopBooks ? 'Masquer le Top 10 Prédit 📉' : 'Afficher le Top 10 des Livres Prédits 🏆'}
                    </button>
                </div>
                

                {/* Section 3: Affichage Conditionnel du Tableau du Top 10 */}
                {showTopBooks && (
                    <div className="top-books-display">
                         <h2>Classement Prédit</h2>

                        {loadingTopBooks && <p style={{ textAlign: 'center' }}>Chargement des données du Top 10...</p>}
                        {topBooksError && <p className="error-message">{topBooksError}</p>}
                        
                        {!loadingTopBooks && topBooks.length > 0 && (
                            <div className="user-list-container">
                                <table className="user-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Titre</th>
                                            <th>Auteur</th>
                                            <th>Prêts Réels (2022)</th>
                                            <th style={{ backgroundColor: '#6f42c1', color: 'white' }}>Prêts PRÉDITS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topBooks.map((book, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td><strong>{book.Titre}</strong></td>
                                                <td>{book.Auteur || 'Inconnu'}</td>
                                                <td>{book['Prêts 2022']}</td>
                                                <td><strong style={{ color: '#6f42c1' }}>{book.Predicted_Prêts_2022.toFixed(2)}</strong></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {!loadingTopBooks && topBooks.length === 0 && !topBooksError && (
                            <p style={{ textAlign: 'center' }}>Aucune donnée de top livre disponible.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}