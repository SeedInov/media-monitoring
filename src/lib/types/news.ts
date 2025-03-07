// Type for daily sentiment data
export interface sentimentStatsType {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
  very_negative: number;
  very_positive: number;
}
[];
export interface sentimentDistributionType {
  name: string;
  value: number;
  color: string;
}
[];

export interface topCountriesType {
  id: number;
  country: string;
  count: number;
}

export interface countrySentimentType {
  id: number;
  country: string;
  positive: number;
  neutral: number;
  negative: number;
  very_positive: number;
  very_negative: number;
}
