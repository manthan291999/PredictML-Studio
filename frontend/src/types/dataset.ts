export interface ColumnSchema {
  numeric_columns: string[];
  categorical_columns: string[];
  sample: Record<string, any>[];
}

export interface Dataset {
  id: string;
  name: string;
  rows: number;
  problem: 'Regression' | 'Classification' | 'Auto Detect';
  target: string;
  featuresCount: number;
  icon?: string;
  description?: string;
}

export interface DatasetUploadResponse {
  dataset_id: string;
  schema: ColumnSchema;
}
