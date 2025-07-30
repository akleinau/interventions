
export interface Rule {
  string: string;
  weight: number;
  start_position?: number;
}

export interface Prediction {
    value: number;
    rules: Rule[];
}

