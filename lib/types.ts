export type CategoryType =
  | 'Economy'
  | 'Society'
  | 'Governance'
  | 'Technology'
  | 'Education'
  | 'Healthcare'
  | 'Environment'
  | 'Safety'
  | 'Equality'
  | 'DigitalGov';

export interface SourceInfo {
  organization: string;
  datasetName: string;
  url: string;
  lastUpdatedYear: number;
  frequency: 'Annual' | 'Bi-Annual' | 'Quarterly' | 'Monthly' | 'Periodic';
  confidenceScore: number; // 0-100
}

export interface HistoricalPoint {
  year: number;
  value: number; // Score or Rank
  indiaRank?: number;
  indiaValue?: string | number;
}

export interface CountryValue {
  code: string;
  name: string;
  rank?: number;
  value: number | string;
  formattedValue: string;
}

export interface Indicator {
  id: string;
  name: string;
  category: CategoryType;
  description: string;
  unit: 'Rank' | 'Score' | 'Percentage' | 'USD' | 'Index' | 'Ratio' | 'Count';
  higherIsBetter: boolean; // e.g. Rank 1 is better, so for rank false, for score true
  latestIndiaRank: number;
  latestIndiaValue: string | number;
  totalCountriesMeasured: number;
  year: number;
  previousIndiaRank?: number;
  previousIndiaValue?: string | number;
  trend: 'improving' | 'declining' | 'stable';
  changeDelta: string; // e.g. "+5 places" or "+2.4 pts"
  historicalData: {
    year: number;
    india: number; // Rank or value
    usa?: number;
    china?: number;
    vietnam?: number;
    germany?: number;
    japan?: number;
    brazil?: number;
  }[];
  countryComparison: CountryValue[];
  source: SourceInfo;
  whyItMatters: string;
  keyDriversAndPolicies: string[];
  strengthsAndGaps: {
    strengths: string[];
    gaps: string[];
  };
}

export interface CategorySummary {
  category: CategoryType;
  title: string;
  iconName: string;
  description: string;
  averageRank: number;
  topIndicator: string;
  weakestIndicator: string;
  improvingCount: number;
  decliningCount: number;
  totalIndicators: number;
}

export interface CountryProfile {
  code: string;
  name: string;
  flagCode: string;
  region: string;
  gdpNominal: string;
  population: string;
}

export interface StateIndicator {
  stateName: string;
  code: string;
  sdgScore: number;
  innovationScore: number;
  healthIndexScore: number;
  exportPreparednessRank: number;
  literacyRate: number;
  category: 'Front Runner' | 'Performer' | 'Achiever' | 'Aspirant';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  thinkingProcess?: string;
  timestamp: string;
  suggestedQueries?: string[];
  relatedIndicatorIds?: string[];
}
