export interface ShapFeatureImportance {
  features: string[];
  importance: number[];
}

export interface ShapContribution {
  feature: string;
  actual_value: any;
  shap_contribution: number;
}

export interface LocalShapResult {
  base_value?: number;
  contributions?: ShapContribution[];
  error?: string;
}

export interface NarrativeResult {
  summary: string;
  key_drivers?: Array<{ feature: string; impact: string; recommendation?: string }>;
  recommendations?: string[];
  caveats?: string[];
}

export interface ModelPredictionResponse {
  prediction: number;
  local_shap: LocalShapResult;
  narrative: NarrativeResult;
}
