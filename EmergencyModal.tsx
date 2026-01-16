
import React from 'react';

interface EmergencyModalProps {
  tankId: string;
  value: number;
  onAction: () => void;
  onClose: () => void;
}

const EmergencyModal: React.FC<EmergencyModalProps> = ({ tankId, value, onAction, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-[#1a1a1a] border border-warning rounded-3xl shadow-[0_0_50px_rgba(255,140,0,0.3)] overflow-hidden flex flex-col transform animate-bounce-subtle">
        <div className="h-2 w-full bg-warning animate-pulse"></div>
        <div className="p-8 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-warning/20 rounded-full animate-ping"></div>
            <div className="relative bg-warning/10 p-5 rounded-full border-2 border-warning">
              <span className="material-symbols-outlined text-5xl text-warning font-bold">warning</span>
            </div>
          </div>
          <h2 className="text-white text-2xl font-bold uppercase tracking-widest mb-1">경보</h2>
          <p className="text-slate-300 text-lg mb-8 leading-tight">{tankId}번 수조<br/>용존산소량 급락!</p>
          
          <div className="w-full bg-black/40 rounded-2xl border border-white/5 p-4 mb-8 flex items-center justify-between">
            <div className="text-left">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">현재 수치</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-display font-bold text-white tracking-tighter">{value}</span>
                <span className="text-xs text-slate-500 font-medium">mg/L</span>
              </div>
            </div>
            <div className="h-10 w-px bg-white/10"></div>
            <div className="text-right">
              <div className="flex items-center text-red-400 gap-1 font-bold">
                <span className="material-symbols-outlined text-sm">trending_down</span>
                <span>-0.4</span>
              </div>
              <p className="text-[10px] text-slate-500">목표: > 6.0</p>
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            <button 
              onClick={onAction}
              className="w-full h-14 bg-accent hover:bg-emerald-400 active:scale-95 transition-all rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-accent/20"
            >
              <span className="material-symbols-outlined text-darkBg font-bold">toys_fan</span>
              <span className="text-darkBg font-bold text-lg tracking-tight">산소 공급기 가동</span>
            </button>
            <button 
              onClick={onClose}
              className="w-full h-14 bg-transparent border-2 border-slate-700 hover:bg-white/5 active:scale-95 transition-all rounded-2xl flex items-center justify-center gap-3 text-white"
            >
              <span className="material-symbols-outlined text-slate-400">call</span>
              <span className="font-bold text-lg">담당자 호출</span>
            </button>
          </div>
        </div>
      </div>
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 text-white/50 hover:text-white"
      >
        <span className="material-symbols-outlined text-3xl">close</span>
      </button>
    </div>
  );
};

export default EmergencyModal;
