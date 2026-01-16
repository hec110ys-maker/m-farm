
export enum TankStatus {
  NORMAL = 'NORMAL',
  WARNING = 'WARNING',
  EMERGENCY = 'EMERGENCY'
}

export interface TankData {
  id: string;
  name: string;
  type: string;
  temp: number;
  ph: number;
  do: number;
  status: TankStatus;
  lastUpdate: string;
}

export interface SensorHistory {
  time: string;
  value: number;
}

export enum AppTab {
  DASHBOARD = 'DASHBOARD',
  CONTROL = 'CONTROL',
  GROWTH = 'GROWTH',
  SETTINGS = 'SETTINGS'
}
