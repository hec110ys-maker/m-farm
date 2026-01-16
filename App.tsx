
import React, { useState, useEffect } from 'react';
import { AppTab, TankStatus, TankData } from './types';
import { INITIAL_TANKS } from './constants';
import TankCard from './components/TankCard';
import EmergencyModal from './components/EmergencyModal';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getGrowthPrediction } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [tanks, setTanks] = useState<TankData[]>(INITIAL_TANKS);
  const [selectedTankId, setSelectedTankId] = useState<string | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [emergencyData, setEmergencyData] = useState({ id: '03', value: 3.2 });
  
  // Growth Log State
  const [feed, setFeed] = useState('120');
  const [weight, setWeight] = useState('450');
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  // 시나리오: 첫 접속 후 8초 뒤 긴급 상황 발생 (외부 업무 중 알림 시뮬레이션)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === AppTab.DASHBOARD && !showEmergency) {
        setShowEmergency(true);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleTankClick = (id: string) => {
    setSelectedTankId(id);
  };

  const handleFetchPrediction = async () => {
    setIsLoadingInsight(true);
    try {
      const result = await getGrowthPrediction(
        [{ date: new Date().toISOString(), feed: Number(feed) }], 
        [{ date: new Date().toISOString(), weight: Number(weight) }]
      );
      setAiInsight(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingInsight(false);
    }
  };

  const handleEmergencyAction = () => {
    // 경보 해결 시뮬레이션
    setTanks(prev => prev.map(t => 
      t.id === 'T03' ? { ...t, status: TankStatus.NORMAL, do: 6.5 } : t
    ));
    setShowEmergency(false);
  };

  const renderDashboard = () => (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center gap-4">
        <div 
          className="size-14 rounded-full border-2 border-accent bg-cover bg-center shadow-[0_0_15px_rgba(0,251,188,0.3)]"
          style={{ backgroundImage: `url('https://picsum.photos/id/64/200/200')` }}
        ></div>
        <div>
          <h1 className="text-xl font-bold">안녕하세요, 관리자님</h1>
          <div className="flex items-center gap-1.5 opacity-60 text-xs">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span>오션어스 시설 - A 구역</span>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-r from-primary/80 to-blue-600/60 rounded-2xl p-4 flex items-center justify-between shadow-xl border border-white/10 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-all"></div>
        <div className="flex items-center gap-4 z-10">
          <div className="size-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            <span className="material-symbols-outlined text-3xl">check_circle</span>
          </div>
          <div>
            <p className="font-bold text-lg">모든 시스템 정상</p>
            <p className="text-blue-100/70 text-sm">최적 수질 상태를 유지하고 있습니다.</p>
          </div>
        </div>
        <span className="material-symbols-outlined text-white/40">chevron_right</span>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {['전체 급이', '에어레이터', '조명', 'CCTV'].map(tool => (
          <button key={tool} className="flex items-center gap-2 px-4 py-2 bg-surface rounded-full border border-white/5 whitespace-nowrap active:scale-95 transition-all text-sm font-medium hover:border-accent/30">
            <span className="material-symbols-outlined text-accent text-lg">
              {tool === '전체 급이' ? 'water_drop' : tool === '에어레이터' ? 'wind_power' : tool === '조명' ? 'lightbulb' : 'videocam'}
            </span>
            {tool}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {tanks.map(tank => (
          <TankCard key={tank.id} tank={tank} onClick={handleTankClick} />
        ))}
      </div>
    </div>
  );

  const renderGrowth = () => (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-xl font-bold">성장 일지</h2>
      
      <div className="bg-surface rounded-2xl p-5 border border-white/5 shadow-xl">
        <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-accent text-lg">edit_note</span>
          일일 데이터 입력
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500">사료 투입량 (kg)</label>
            <input 
              type="number" value={feed} onChange={e => setFeed(e.target.value)}
              className="w-full bg-darkBg border border-white/10 rounded-xl px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-primary focus:outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500">평균 중량 (g)</label>
            <input 
              type="number" value={weight} onChange={e => setWeight(e.target.value)}
              className="w-full bg-darkBg border border-white/10 rounded-xl px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-primary focus:outline-none" 
            />
          </div>
        </div>
        <button 
          onClick={handleFetchPrediction}
          disabled={isLoadingInsight}
          className="w-full mt-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-50"
        >
          {isLoadingInsight ? 'AI 분석 중...' : '데이터 저장 및 예측 실행'}
        </button>
      </div>

      <div className="bg-gradient-to-br from-surface to-darkBg rounded-2xl p-6 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <span className="material-symbols-outlined text-6xl text-primary">psychology</span>
        </div>
        <h3 className="text-lg font-bold mb-6">AI 출하 예측 지수</h3>
        
        <div className="flex items-center gap-8 mb-8">
          <div className="relative size-32 shrink-0">
             <svg className="size-full -rotate-90" viewBox="0 0 36 36">
              <path className="text-white/5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
              <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${aiInsight?.growthRate || 85}, 100`} strokeWidth="3" strokeLinecap="round"></path>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-display font-bold">{aiInsight?.growthRate || 85}%</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold">진척도</span>
            </div>
          </div>
          <div>
            <p className="text-4xl font-display font-bold tracking-tighter">{aiInsight?.daysLeft || 15}일</p>
            <p className="text-accent font-bold text-sm">뒤 출하 최적기</p>
          </div>
        </div>

        {aiInsight && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm text-slate-300 leading-relaxed animate-in fade-in duration-700">
            <span className="text-accent font-bold mr-1">💡 AI 분석:</span>
            {aiInsight.reason}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-darkBg text-white pb-24 max-w-md mx-auto relative shadow-2xl overflow-hidden flex flex-col border-x border-white/5">
      <main className="flex-1 p-5 overflow-y-auto no-scrollbar">
        {activeTab === AppTab.DASHBOARD && renderDashboard()}
        {activeTab === AppTab.GROWTH && renderGrowth()}
        {activeTab === AppTab.CONTROL && (
          <div className="flex flex-col gap-6 animate-in fade-in">
             <h2 className="text-xl font-bold">장비 통합 제어</h2>
             <div className="grid grid-cols-1 gap-4">
                {['에어레이터 펌프', '히터 컨트롤러', '자동 급이기', '순환 펌프'].map((device, idx) => (
                  <div key={device} className="bg-surface p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`size-12 rounded-full flex items-center justify-center ${idx % 2 === 0 ? 'bg-accent/20 text-accent' : 'bg-slate-700/50 text-slate-400'}`}>
                        <span className="material-symbols-outlined">{idx === 0 ? 'wind_power' : idx === 1 ? 'thermostat' : idx === 2 ? 'set_meal' : 'sync'}</span>
                      </div>
                      <div>
                        <p className="font-bold">{device}</p>
                        <p className="text-xs text-slate-500">{idx % 2 === 0 ? '가동 중 (자동)' : '대기 중'}</p>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </main>

      {selectedTankId && (
        <div className="fixed inset-0 z-50 bg-darkBg overflow-y-auto p-5 animate-in slide-in-from-right duration-300">
           <header className="flex items-center justify-between mb-8">
             <button onClick={() => setSelectedTankId(null)} className="size-10 rounded-full hover:bg-white/5 flex items-center justify-center">
               <span className="material-symbols-outlined">arrow_back</span>
             </button>
             <h2 className="text-lg font-bold">수조 상세 정보</h2>
             <div className="size-10"></div>
           </header>
           
           <div className="bg-surface rounded-2xl p-5 border border-white/5 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase mb-1">용존 산소량 (DO)</p>
                  <p className="text-4xl font-display font-bold">7.4 <span className="text-base font-normal text-slate-500">mg/L</span></p>
                </div>
              </div>
              <div className="h-48 w-full bg-black/20 rounded-xl p-2 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{t: '12:00', v: 7.2}, {t: '13:00', v: 7.6}, {t: '14:00', v: 6.8}, {t: '15:00', v: 7.4}]}>
                    <Area type="monotone" dataKey="v" stroke="#38bdf8" fill="#0047AB" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>
      )}

      {showEmergency && (
        <EmergencyModal 
          tankId={emergencyData.id} 
          value={emergencyData.value} 
          onAction={handleEmergencyAction} 
          onClose={() => setShowEmergency(false)} 
        />
      )}

      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/5 px-8 pt-4 pb-8 flex justify-between items-center z-40 max-w-md mx-auto">
        <NavButton active={activeTab === AppTab.DASHBOARD} onClick={() => setActiveTab(AppTab.DASHBOARD)} icon="dashboard" label="대시보드" />
        <NavButton active={activeTab === AppTab.CONTROL} onClick={() => setActiveTab(AppTab.CONTROL)} icon="tune" label="제어" />
        <div className="relative -top-8">
           <button className="size-16 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center active:scale-90 transition-all border-4 border-darkBg">
             <span className="material-symbols-outlined text-3xl">add</span>
           </button>
        </div>
        <NavButton active={activeTab === AppTab.GROWTH} onClick={() => setActiveTab(AppTab.GROWTH)} icon="insights" label="성장" />
        <NavButton active={activeTab === AppTab.SETTINGS} onClick={() => setActiveTab(AppTab.SETTINGS)} icon="settings" label="설정" />
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-accent' : 'text-slate-500'}`}>
    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: active ? "'FILL' 1" : "" }}>{icon}</span>
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

export default App;
