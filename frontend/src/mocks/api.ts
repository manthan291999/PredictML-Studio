// Centralized Mock Data mimicking real backend responses

export const MOCK_DATASETS = [
    { id: 'demo-house', name: 'House Prices', type: 'Regression', rows: 1460, cols: 81, desc: 'Predict continuous property values based on features like SqFt and Neighborhood.' },
    { id: 'demo-churn', name: 'Customer Churn', type: 'Classification', rows: 7043, cols: 21, desc: 'Predict if a customer will leave based on tenure, billing, and demographics.' },
    { id: 'demo-attrition', name: 'HR Attrition', type: 'Classification', rows: 1470, cols: 35, desc: 'Predict employee turnover likelihood.' }
];

export const MOCK_MODELS = [
    { model_id: 'xgb_1', algorithm: 'XGBoost', metrics: { rmse: 28543.12, r2: 0.89, accuracy: null } },
    { model_id: 'lgb_1', algorithm: 'LightGBM', metrics: { rmse: 29100.55, r2: 0.88, accuracy: null } },
    { model_id: 'rf_1', algorithm: 'Random Forest', metrics: { rmse: 31200.41, r2: 0.85, accuracy: null } },
    { model_id: 'cat_1', algorithm: 'CatBoost', metrics: { rmse: 32050.99, r2: 0.84, accuracy: null } },
    { model_id: 'lin_1', algorithm: 'Linear Regression', metrics: { rmse: 45000.00, r2: 0.72, accuracy: null } }
];

export const MOCK_SHAP = {
    features: ['OverallQual', 'GrLivArea', 'GarageCars', 'TotalBsmtSF', '1stFlrSF'],
    importance: [0.45, 0.25, 0.15, 0.10, 0.05]
};

export const MOCK_NARRATIVE = {
    summary: "XGBoost emerged as the best performing model. It explains ~89% of the variance in House Prices.",
    drivers: [
        "Overall Quality is the single largest determinant of price.",
        "Above ground living area (GrLivArea) strongly correlates linearly with predicted price.",
        "Garage capacity has significant non-linear effects at the 2-car threshold."
    ],
    caveats: "Predictions lose accuracy for properties priced >$500,000 due to sparse training data in that upper percentile."
};
