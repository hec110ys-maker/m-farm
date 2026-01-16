
import { TankStatus, TankData } from './types';

export const COLORS = {
  primary: '#0047AB',
  accent: '#00FBBC',
  warning: '#FF8C00',
  emergency: '#EF4444'
};

export const INITIAL_TANKS: TankData[] = [
  {
    id: 'T01',
    name: '수조 01',
    type: '친어',
    temp: 24.5,
    ph: 7.2,
    do: 6.8,
    status: TankStatus.NORMAL,
    lastUpdate: '2분 전'
  },
  {
    id: 'T02',
    name: '수조 02',
    type: '치어',
    temp: 22.1,
    ph: 7.0,
    do: 7.1,
    status: TankStatus.NORMAL,
    lastUpdate: '30초 전'
  },
  {
    id: 'T03',
    name: '수조 03',
    type: '출하대기',
    temp: 23.8,
    ph: 6.9,
    do: 3.2, // Simulated drop for Demo
    status: TankStatus.WARNING,
    lastUpdate: '방금 전'
  }
];
