# PredictML Studio

PredictML Studio is an end-to-end Machine Learning platform tailored to tabular data with automated model selection, global/local explainability (SHAP/LIME), and GPT-4 narrative generation.

## Setup Instructions

### 1. Backend Setup
The backend runs on Python 3.9+ with FastAPI and Scikit-Learn.

```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt

# Generate the dummy data for tests
python data/demo_datasets/generate_data.py

# Run backend Server
uvicorn app.main:app --reload
```
The server will be available at `http://localhost:8000/api`.

### 2. Frontend Setup
The frontend uses React and Vite.

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`. 
Make sure you update the `App.tsx` API calls if your backend port differs.

### Note on OpenAI
Set the `OPENAI_API_KEY` system environment variable in the terminal running the backend to activate the AI Narrative Generation (otherwise, it will fallback gracefully).
