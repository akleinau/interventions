
export interface Rule {
  string: string;
  weight: number;
  start_position?: number;
}

export interface Prediction {
    name: string;
    value: number;
    rules: Rule[];
}

