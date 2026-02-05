
export interface FarmerProfile {
  name: string;
  age: string;
  village: string;
  district: string;
  landArea: string;
  primaryCrops: string[];
  profilePic?: string;
  farmLat?: number;
  farmLng?: number;
}

export interface DiseaseInfo {
  id: string;
  cropName: string; 
  affectedCrops: string[]; 
  diseaseName: string;
  reason: string;
  solution: string;
  pesticides: string;
  herbicides: string;
  compost: string;
  precautions: string;
  imageUrl: string;
}

export interface DashboardTile {
  id: string;
  label: string;
  icon: string;
  color: string;
  isVisible: boolean;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  description: string;
  forecast: Array<{ day: string; temp: number; icon: string }>;
}

export interface MarketPrice {
  commodity: string;
  district: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  trend: 'up' | 'down' | 'stable';
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  source: string;
}

export interface CropRecommendation {
  cropName: string;
  expectedYield: string;
  estimatedProfit: string;
  fertilizerPlan: string;
  irrigationStrategy: string;
  soilAdvice: string;
}

export interface CropDiseaseResult {
  cropName: string;
  diseaseName: string;
  accuracy: number;
  explanation: string;
  treatment: string;
  cropStage: string; // New: Age or size of the crop
  fertilizerDetails: {
    name: string;
    dosage: string; // New: Quantity to be applied
  };
  herbicideDetails: {
    name: string;
    dosage: string; // New: Quantity to be applied
  };
  compostDetails: {
    name: string;
    dosage: string; // New: Quantity to be applied
  };
  preventiveMeasures: string;
  isSafe: boolean;
}

export interface FutureAdvice {
  investmentAdvice: string;
  marketPrediction: string;
  cropTransitionAdvice: string;
  riskMitigation: string;
}

export interface FertilizerSchedule {
  stage: string;
  timing: string;
  fertilizers: string[];
  quantity: string;
  method: string;
}

export interface FertilizerAdvice {
  cropName: string;
  soilSummary: string;
  schedules: FertilizerSchedule[];
  organicTips: string;
  warningNotice: string;
}
