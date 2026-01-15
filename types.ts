
export interface FileContent {
  path: string;
  name: string;
  language: string;
  content: string;
  description: string;
}

export interface PredictionResult {
  label: 'REAL' | 'FAKE';
  confidence: number;
  explanation: {
    word: string;
    impact: number; // positive for REAL, negative for FAKE (or vice versa depending on logic)
  }[];
}
