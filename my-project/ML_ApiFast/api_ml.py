from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import pandas as pd
from typing import Dict, Any, List


#  1. CHARGER LE MODÈLE ET LES ENCODEURS
TOP_BOOKS_PATH = 'top_books.pkl'
try:
   
    model = joblib.load('ml_model.pkl')
    le_dict = joblib.load('label_encoders.pkl')
    # Chargement de la liste des top livres
    top_books_list = joblib.load(TOP_BOOKS_PATH) 
    print("Modèle, encodeurs et liste des top livres chargés.")
except FileNotFoundError:
    raise RuntimeError("Erreur: Les fichiers .pkl sont introuvables. Assurez-vous qu'ils sont dans le même répertoire que api_ml.py.")

#  2. CRÉER L'APPLICATION FASTAPI

app = FastAPI(title="API de Prédiction des Emprunts de Livres")

# 3. CONFIGURATION CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Autorise toutes les origines
    allow_credentials=False,  # Requis si allow_origins = ["*"]
    allow_methods=["*"],      # Autorise toutes les méthodes HTTP
    allow_headers=["*"],      # Autorise tous les headers
)

#  4. DÉFINITION DU MODÈLE DE DONNÉES (INPUT)
class BookInput(BaseModel):
    Type_de_document: str
    Auteur: str
    Nombre_de_localisations: int
    Nombre_d_exemplaires: int

class TopBookOutput(BaseModel):
    Titre: str
    Auteur: str
    Prêts_2022: int = Field(alias='Prêts 2022')
    Predicted_Prêts_2022: float
    
    # Configuration pour permettre l'alias
    class Config:
        populate_by_name = True
# ROUTE DE PRÉDICTION AVEC GESTION DES LABELS INCONNUS
@app.post("/predict_loan", response_model=Dict[str, float])
async def predict_loan(book: BookInput):
    data: Dict[str, Any] = book.dict()

    # Gestion des valeurs manquantes pour 'Auteur'
    auteur_val = data['Auteur'] if pd.notna(data['Auteur']) and data['Auteur'].strip() != "" else 'Inconnu'

    # Pour Type de document
    type_classes = le_dict['Type de document'].classes_
    if data['Type_de_document'] in type_classes:
        type_enc = le_dict['Type de document'].transform([data['Type_de_document']])[0]
    else:
        type_enc = 0  # Valeur par défaut pour labels inconnus

    # Pour Auteur
    auteur_classes = le_dict['Auteur'].classes_
    if auteur_val in auteur_classes:
        auteur_enc = le_dict['Auteur'].transform([auteur_val])[0]
    else:
        auteur_enc = 0  # Valeur par défaut pour labels inconnus

    # Préparation du DataFrame d'entrée
    input_data = {
        "Nombre de localisations": [data['Nombre_de_localisations']],
        "Nombre d'exemplaires": [data['Nombre_d_exemplaires']],
        "Type de document_encoded": [type_enc],
        "Auteur_encoded": [auteur_enc],
    }

    features = ["Nombre de localisations", "Nombre d'exemplaires", "Type de document_encoded", "Auteur_encoded"]
    df_input = pd.DataFrame(input_data, columns=features)

    # Prédiction
    prediction = model.predict(df_input)[0]

    return {"predicted_loans": round(float(prediction), 2)}

@app.get("/top_loans", response_model=List[TopBookOutput])
async def get_top_loans():
    """
    Retourne les 10 livres avec le plus grand nombre de prêts prédits.
    """
    if not top_books_list:
        raise HTTPException(status_code=500, detail="La liste des tops livres n'a pas pu être chargée.")
    return top_books_list
# ROUTE D’ACCUEIL  DE TEST 

@app.get("/")
async def home():
    return {
        "message": "✅ API de prédiction des emprunts de livres est prête à l’emploi ! ",
        "usage": "Envoie une requête POST à /predict_loan avec les données du livre."
    }
#ROUTE DE SANTÉ (OPTIONNELLE)
@app.get("/health")
async def health_check():
    return {"status": "ok"}
