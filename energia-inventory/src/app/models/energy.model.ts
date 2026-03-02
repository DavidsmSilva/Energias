export interface EnergyItem {
  id: number;
  name: string;
  category: string;
  power: number;
  consumption: number;
  status: 'active'|'inactive'|'maintenance';
}

export interface EnergyConsumption {
  id: number;
  itemId: number;
  date: Date;
  consumption: number;
  cost: number;
  peakHour?: boolean;
}

export interface DashboardStats {
  totalItems: number;
  activeItems: number;
  totalConsumption: number;
  averageCost: number;
  peakConsumption: number;
  costSavings?: number;
}
