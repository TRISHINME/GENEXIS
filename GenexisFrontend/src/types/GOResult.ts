export interface GOResult {
  id: string;
  description: string;
  confidence: number;
}

export interface PredictionData {
  input: string;
  detected_type: string;
  genexis_go_predictions: GOResult[];
  string: any[];
  kegg: string[];
  clinvar: Record<string, any>;
  pubmed: string[];
}
