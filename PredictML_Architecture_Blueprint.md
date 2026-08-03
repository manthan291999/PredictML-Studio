# PredictML Studio — Architecture Blueprint

## 1. Scope & Core Modules

### Dataset Selector
* Upload custom CSV/XLSX or select from 3 bundled demo datasets (house prices, churn, attrition)
* Auto schema detection: column types, missing-value %, cardinality, target-column candidates
* Preview pane before committing to training

### Model Training Engine
* Auto-detects problem type: if target column is continuous numeric with high cardinality → regression; if categorical/binary/low-cardinality → classification
* Trains multiple candidate algorithms in parallel/sequence per problem type
* Returns leaderboard ranked by primary metric

### Model Evaluation Dashboard
* Regression: RMSE, MAE, R², residual plots
* Classification: Accuracy, Precision, Recall, F1, ROC-AUC, confusion matrix
* Cross-validation summary (mean ± std across folds)
* Side-by-side model comparison table

### Explainability Layer
* SHAP: global feature importance (summary plot) + local per-prediction explanation (waterfall)
* LIME: local explanation as a second lens, useful when SHAP is expensive or model-agnostic view is needed
* Toggle between global (model-level) and local (single-prediction) views

### AI Explanation Layer
* Takes SHAP output + metrics + prediction → LLM → plain-English narrative
* Structured output: summary, top drivers, caveats, confidence framing

### Prediction Interface ("What-If")
* User inputs feature values manually or edits a real record
* Live prediction + local explanation + AI narrative, updating as inputs change

## 2. Tech Stack Recommendation

| Layer | Choice | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React + TypeScript, Recharts/Plotly | Component reuse across 3 use-case "modules"; Plotly handles SHAP-style plots natively |
| **Backend** | FastAPI (Python) | Async support for background training jobs; native fit with the ML stack (no cross-language serialization) |
| **ML Core** | scikit-learn (baseline models, pipelines, CV) + XGBoost/LightGBM/CatBoost (gradient boosting candidates) | Covers both interpretable linear baselines and high-performance tree ensembles with minimal code duplication via a shared Pipeline |
| **Explainability** | shap (TreeExplainer for tree models, KernelExplainer fallback) + lime | SHAP is fast and exact for tree ensembles (which will usually win); LIME provides a cheap model-agnostic sanity check |
| **LLM** | Any chat-completions API (OpenAI/Anthropic-compatible) | Structured JSON output mode used for the narrative; provider-agnostic via a thin adapter |
| **Model persistence**| joblib for scikit-learn-compatible objects | Standard, fast, plays well with sklearn Pipelines |
| **Storage** | PostgreSQL (metadata: runs, metrics) + local/S3-compatible blob storage (model artifacts, datasets) | Metrics/runs are relational and queryable; large artifacts don't belong in a relational DB |
| **Job execution** | FastAPI BackgroundTasks for MVP → Celery/RQ + Redis if concurrency grows | Training can take seconds to minutes; blocking the request thread is unacceptable |

**Tradeoffs**: CatBoost/LightGBM add install/build complexity vs. sklearn-only; justified because they typically win on tabular data and have native SHAP support (fast TreeExplainer). KernelExplainer (model-agnostic SHAP) is kept only as a fallback for non-tree models since it's O(n²)-ish and slow.

## 3. System Architecture

```text
[Upload/Select Dataset] 
        │
        ▼
[Preprocessing Service] ── (schema detection, cleaning, encoding, scaling)
        │
        ▼
[Training Service] ── background job ──► [Job Status Store]
        │  (trains N candidate models via shared Pipeline)
        ▼
[Model Registry] ── stores artifacts + metrics + CV results
        │
        ├──► [Evaluation Service] ──► Dashboard
        │
        ├──► [Explainability Service] ── SHAP/LIME (on-demand, cached)
        │
        └──► [AI Narrative Service] ── LLM call (on-demand, cached per model+record)
                    │
                    ▼
              [Prediction Interface] (what-if, live)
```

**Sync vs Async**:
* Training → always async (background task + polling `GET /train/{job_id}/status`)
* Global SHAP (per model) → computed once at end of training, cached, served sync
* Local SHAP/LIME + AI narrative (per what-if prediction) → computed sync on request, since it's a single-row explanation (fast), but cached by input hash to avoid recomputation on repeated identical inputs

**Model registry/versioning**: Each training run gets a `run_id`; artifacts stored as `{dataset_id}/{run_id}/model.joblib`. The leaderboard lets users compare across runs and "promote" one as active for the What-If interface.

## 4. Data & Model Design

**Core tables**:
* `datasets(id, name, source_type, schema_json, row_count, uploaded_at)`
* `training_runs(id, dataset_id, problem_type, target_column, status, created_at)`
* `model_results(id, run_id, algorithm, metrics_json, cv_scores_json, artifact_path, is_best)`
* `explanations(id, model_result_id, scope['global'|'local'], record_hash NULLABLE, shap_json, lime_json, cached_at)`
* `ai_narratives(id, explanation_id, narrative_json, model_used, cached_at)`

**Problem-type auto-detection**:
* Target column dtype numeric + unique values / row count > threshold (e.g. 0.05) → regression
* Target column dtype object/bool, or numeric with low cardinality (≤ 20 unique values) → classification
* If ambiguous, surface to user for manual confirmation rather than guessing silently

**Generic preprocessing pipeline** (shared across all 3 use cases):
* `ColumnTransformer` built dynamically from the detected schema:
  * numeric → median impute + `StandardScaler`
  * categorical → most-frequent impute + `OneHotEncoder(handle_unknown='ignore')`
* No dataset-specific branching — the same `build_pipeline(schema)` function produces the correct transformer for any of the 3 datasets or a custom upload.

## 5. API Design

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/datasets/upload` | POST | Upload CSV/XLSX, returns `dataset_id` + inferred schema |
| `/datasets/{id}/schema` | GET | Return column types, target-column candidates |
| `/train` | POST | Body: `{dataset_id, target_column, problem_type_override?}` → returns `job_id` |
| `/train/{job_id}/status` | GET | Poll job progress (pending/running/done/failed) |
| `/runs/{run_id}/metrics` | GET | Leaderboard of all models trained in that run |
| `/models/{model_result_id}/explain/global` | GET | Cached global SHAP summary |
| `/models/{model_result_id}/explain/local` | POST | Body: feature values → local SHAP + LIME for that record |
| `/models/{model_result_id}/narrative` | POST | Body: explanation context → AI plain-English narrative |
| `/models/{model_result_id}/predict` | POST | Body: feature values → prediction + explanation + narrative (composed convenience endpoint for What-If UI) |

_Note: All POST bodies validated via Pydantic models matching the dataset's inferred schema (dynamic per-dataset validation, not a fixed schema)._

## 6. Folder Structure

```text
predictml-studio/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── datasets.py
│   │   │   ├── training.py
│   │   │   ├── explainability.py
│   │   │   └── narrative.py
│   │   ├── services/
│   │   │   ├── preprocessing_service.py
│   │   │   ├── training_service.py
│   │   │   ├── evaluation_service.py
│   │   │   ├── explainability_service.py
│   │   │   └── ai_narrative_service.py
│   │   ├── models/           # Pydantic schemas
│   │   ├── db/               # SQLAlchemy models, session
│   │   ├── jobs/             # background task orchestration
│   │   └── core/             # config, logging
│   ├── data/
│   │   └── demo_datasets/    # house_prices.csv, churn.csv, attrition.csv
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/            # UseCaseSelect, Dashboard, WhatIf
│   │   ├── components/       # Leaderboard, ShapChart, NarrativePanel, WhatIfForm
│   │   └── api/
│   └── package.json
└── docker-compose.yml
```

## 7. Development Roadmap

| Milestone | Description | Complexity |
| :--- | :--- | :--- |
| **1.** | Dataset upload + schema detection + demo datasets bundled | Low |
| **2.** | Generic preprocessing pipeline (schema → ColumnTransformer) | Medium |
| **3.** | Training engine (multi-model, CV, background job) | Medium-High |
| **4.** | Evaluation dashboard (metrics + leaderboard UI) | Medium |
| **5.** | SHAP/LIME integration (global + local) | High |
| **6.** | AI narrative layer (prompt design + JSON parsing + caching) | Medium |
| **7.** | What-If prediction interface (live updates) | Medium |
| **8.** | Polish: error states, caching, loading UX | Low-Medium |

## 8. Key Technical Decisions

* **One pipeline, three use cases**: the schema-driven `build_pipeline()` + auto problem-type detection means house prices, churn, and attrition all flow through identical code paths — the only "per-dataset" thing is the CSV itself.
* **Default model roster**: Linear/Logistic Regression (interpretable baseline) + Random Forest + XGBoost/LightGBM/CatBoost (performance candidates). "Best" model selected by primary metric (R² for regression, F1 or ROC-AUC for classification), user can override.
* **SHAP strategy**: `TreeExplainer` for all tree-based models (fast, exact); `KernelExplainer` with sampled background set (≤100 rows) only if a non-tree model is selected. Global SHAP computed on a sample (e.g., 500 rows) for datasets larger than that, to bound compute time.
* **AI narrative prompt structure**: payload = `{top_5_shap_features, metric_summary, prediction_value, problem_type}` → LLM instructed to return strict JSON: `{summary, top_drivers[], caveats[], confidence_note}`. Token-efficient by design — raw SHAP arrays never sent, only top-k features with values.

## 9. Security & Scalability

* **Training jobs**: hard timeout (e.g., 5 min), dataset row/column caps for the free tier, queued via background worker to prevent thread exhaustion under concurrent requests.
* **Upload validation**: MIME/type check, size cap, reject files with formula-injection patterns in cell values (`=`, `+`, `-`, `@` prefixes) since CSVs may be re-opened in Excel downstream.
* **Caching**: global SHAP and AI narratives cached by `(model_result_id, record_hash)` to avoid recomputation — SHAP and LLM calls are the two most expensive operations in the system.
* **Multi-tenant capabilities**: If multi-user, dataset/model artifacts scoped by `user_id`, no cross-user access to `/models/{id}` endpoints without ownership check.
