FROM python:3.11-slim

# /!\ On installe curl pour le healthcheck et build tools si besoin
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl build-essential gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copier requirements d'abord (cache Docker)
COPY requirements.txt /app/requirements.txt

# Installer pip + dépendances
RUN python -m pip install --upgrade pip setuptools wheel && \
    pip install -r /app/requirements.txt

# Copier le reste du code
COPY . /app

EXPOSE 8000

# Commande par défaut (uvicorn -> api_ml:app)
CMD ["python", "-m", "uvicorn", "api_ml:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
