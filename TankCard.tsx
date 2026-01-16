
import React from 'react';
import { TankData, TankStatus } from '../types';

interface TankCardProps {
  tank: TankData;
  onClick: (id: string) => void;
}

const TankCard: React.FC<TankCardProps> = ({ tank, onClick }) => {
  const getStatusColor = (status: TankStatus) => {
    switch (status) {
      case TankStatus.EMERGENCY: return 'border-red-500 bg-red-500/10';
      case TankStatus.WARNING: return 'border-warning bg-warning/10';
      default: return 'border-borderDark bg-surface';
    }
  };

  const getStatusDot = (status: TankStatus) => {
    switch (status) {
      case TankStatus.EMERGENCY: return 'bg-red-500 animate-ping';
      case TankStatus.WARNING: return 'bg-warning animate-pulse';
      default: return 'bg-accent';
    }
  };

  return (
    <div 
      onClick={() => onClick(tank.id)}
      className={`relative flex flex-col gap-3 rounded-2xl border p-4 shadow-lg transition-all active:scale-95 cursor-pointer ${getStatusColor(tank.status)}`}
    >
      <div className="flex justify-between items-center mb-1">
        <div>
          <h3 className="text-white text-lg font-bold leading-tight">{tank.name} - {tank.type}</h3>
          <p className="text-slate-400 text-xs mt-0.5">최종 업데이트: {tank.lastUpdate}</p>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-black/20 backdrop-blur-md">
          <span className={`h-2 w-2 rounded-full ${getStatusDot(tank.status)}`}></span>
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">실시간</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <SensorItem icon="thermostat" label="수온" value={`${tank.temp}°C`} trend="stable" color="text-blue-400" />
        <SensorItem icon="science" label="pH" value={tank.ph.toString()} trend="up" color="text-accent" />
        <SensorItem icon="water_drop" label="용존산소" value={`${tank.do} mg/L`} trend={tank.status === TankStatus.NORMAL ? "stable" : "down"} color={tank.status === TankStatus.NORMAL ? "text-accent" : "text-red-400"} />
      </div>

      <div className="mt-2 pt-2 border-t border-white/5 flex gap-2">
        <button className="flex-1 py-2 rounded-lg bg-primary/20 text-blue-300 text-xs font-bold flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-sm">settings_input_component</span>
          설정 조정
        </button>
        <div className="flex items-center gap-2 pr-2">
          <div className="w-8 h-4 bg-primary rounded-full relative">
            <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="text-[10px] font-bold text-slate-400">펌프 ON</span>
        </div>
      </div>
    </div>
  );
};

const SensorItem = ({ icon, label, value, trend, color }: any) => (
  <div className="flex flex-col gap-1 p-2 rounded-xl bg-black/20 border border-white/5">
    <div className="flex items-center gap-1 opacity-60">
      <span className="material-symbols-outlined text-[14px]">{icon}</span>
      <span className="text-[10px] font-medium">{label}</span>
    </div>
    <p className={`text-sm font-bold ${color}`}>{value}</p>
    <div className={`flex items-center gap-0.5 text-[9px] ${trend === 'down' ? 'text-red-400' : 'text-accent'}`}>
      <span className="material-symbols-outlined text-[12px]">
        {trend === 'stable' ? 'trending_flat' : trend === 'up' ? 'trending_up' : 'trending_down'}
      </span>
      <span>{trend === 'stable' ? '안정' : trend === 'up' ? '+0.1%' : '낮음'}</span>
    </div>
  </div>
);

export default TankCard;
