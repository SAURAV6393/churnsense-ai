
export interface CustomerData {
  id: string;
  name: string;
  tenure: number;
  monthlyCharges: number;
  totalCharges: number;
  contract: 'Month-to-month' | 'One year' | 'Two year';
  internetService: 'DSL' | 'Fiber optic' | 'No';
  supportInteractions: number;
  paymentMethod: 'Electronic check' | 'Mailed check' | 'Bank transfer' | 'Credit card';
  isSeniorCitizen: boolean;
  hasDependents: boolean;
  usageLevel: number;
  selectedModel?: 'Logistic Regression' | 'Decision Tree' | 'Random Forest' | 'XGBoost';
}

export interface ChurnPrediction {
  probability: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  keyFactors: string[];
  retentionActions: string[];
  businessInsight: string;
  hindiInsight?: string;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    rocAuc: number;
  };
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  PREDICTOR = 'PREDICTOR',
  SEGMENTS = 'SEGMENTS',
  HUB = 'HUB',
  MEDIA = 'MEDIA',
  LIVE = 'LIVE',
  ROADMAP = 'ROADMAP'
}

export interface SegmentData {
  name: string;
  churnRate: number;
  count: number;
}
