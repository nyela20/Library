import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Utilise les mêmes styles que Dashboard et UserManagement

// 🚨 RÉCUPÉRATION DE L'URL API (comme dans Catalogue.jsx)
const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

// Fonction pour récupérer le token et générer les headers (Sécurité)
const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '', 
    };
};

export default function PredictionTestPage() {
    const navigate = useNavigate();
    
    // État pour les données du formulaire (basé sur des caractéristiques typiques d'un modèle de prêt)
    const [formData, setFormData] = useState({
        typeDocument: 'Livre', 
        pretsPrecedents: 100, // Ex: Prêts 2022
        nombreLocalisations: 5, // Ex: Nombre de localisations
        anneePublication: new Date().getFullYear() - 5, // Ex: Année de publication
    });

    const [predictionResult, setPredictionResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) : value,
        }));
    };

    const handlePrediction = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPredictionResult(null);
        setError(null);

        try {
            // 🚨 ENDPOINT HYPOTHÉTIQUE : POST /predict/loans (à configurer dans votre NestJS)
            const res = await fetch(`${API}/predict/loans`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    localStorage.clear();
                    navigate('/login'); 
                    return; 
                }
                const errorText = await res.text();
                throw new Error(errorText || 'Erreur lors de la requête de prédiction.');
            }
            
            const data = await res.json();
            
            // Supposons que l'API retourne { predicted_loans: X }
            setPredictionResult(data.predicted_loans); 

        } catch (err) {
            console.error("Erreur API :", err);
            setError(err.message || "Impossible de contacter le service de prédiction.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-layout">
            <div className="dashboard-header">
                <button 
                    onClick={() => navigate('/dashboard/personnel')}
                    className="btn-action admin-btn back-btn"
                >
                    ← Retour au Tableau de Bord
                </button>
            </div>
            
            <div className="dashboard-content prediction-page">
                <h1 className="main-heading">
                    Tester le Modèle de Prédiction des Prêts 🧠
                </h1>
                <p className="sub-heading">Entrez les caractéristiques d'un livre pour estimer le nombre de prêts futurs.</p>

                <form className="prediction-form" onSubmit={handlePrediction}>
                    
                    <div className="form-group">
                        <label htmlFor="typeDocument">Type de Document</label>
                        <select
                            id="typeDocument"
                            name="typeDocument"
                            value={formData.typeDocument}
                            onChange={handleChange}
                            required
                        >
                            <option value="Livre">Livre</option>
                            <option value="Bande dessinée">Bande Dessinée</option>
                            <option value="Périodique">Périodique</option>
                            <option value="Thèse">Thèse</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="pretsPrecedents">Prêts enregistrés l'an dernier (Ex: Prêts 2022)</label>
                        <input
                            type="number"
                            id="pretsPrecedents"
                            name="pretsPrecedents"
                            value={formData.pretsPrecedents}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="nombreLocalisations">Nombre de localisations (Ex: Nombre de copies)</label>
                        <input
                            type="number"
                            id="nombreLocalisations"
                            name="nombreLocalisations"
                            value={formData.nombreLocalisations}
                            onChange={handleChange}
                            min="1"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="anneePublication">Année de publication</label>
                        <input
                            type="number"
                            id="anneePublication"
                            name="anneePublication"
                            value={formData.anneePublication}
                            onChange={handleChange}
                            min="1800"
                            max={new Date().getFullYear()}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn-action prediction-btn" 
                        disabled={loading}
                    >
                        {loading ? 'Prédiction en cours...' : 'Obtenir la Prédiction'}
                    </button>
                </form>

                {/* Zone de Résultat */}
                <div className="prediction-result-box">
                    {error && (
                        <p className="error-message">{error}</p>
                    )}

                    {predictionResult !== null && !loading && (
                        <div className="prediction-success">
                            <h3>Résultat de la Prédiction :</h3>
                            <p>
                                Le modèle estime que cet article aura environ 
                                <strong> {Math.round(predictionResult)} prêts</strong> au cours de la prochaine année.
                            </p>
                            <p className="prediction-detail">
                                **Valeur brute :** {predictionResult.toFixed(2)}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}