
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell, PieChart, Pie, Legend, LineChart, Line, ComposedChart, ReferenceLine, Sector } from 'recharts';
import { TrendingUp, Activity, Package, Truck, Signal, Calendar, MapPin, ChefHat, UtensilsCrossed, Store, ArrowRight, Wallet, BarChart3, PieChart as PieIcon, History, Filter, ChevronDown, ChevronRight, Clock, Check, ShoppingCart, Smartphone } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useUser } from '../contexts/UserContext';
import { ChartSkeleton, ListSkeleton, PieSkeleton, StatCardSkeleton } from '../components/Skeletons';
import { HeroSection } from '../components/HeroSection';

const StatCard = ({ title, value, icon: Icon, color, trend, footer }: any) => (
  <div className="relative overflow-hidden rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/60 bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all group min-h-[140px] md:min-h-[160px] flex flex-col justify-between active:scale-98 cursor-default">
    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none`} style={{ color: color }}>
        <Icon size={80} className="w-16 h-16 md:w-24 md:h-24" />
    </div>
    
    {/* Header Section */}
    <div className="flex justify-between items-start relative z-10 mb-2 md:mb-0">
        <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl text-white shadow-md flex items-center justify-center group-hover:scale-105 transition-transform duration-300`} style={{ backgroundColor: color }}>
            <Icon size={20} strokeWidth={2} className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        {trend && (
            <span className="flex items-center text-[10px] md:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                <TrendingUp size={12} className="mr-1 md:w-3 md:h-3" /> {trend}
            </span>
        )}
    </div>

    {/* Content Section */}
    <div className="relative z-10 mt-1 md:mt-2">
        <span className="text-[10px] md:text-[10px] font-bold uppercase tracking-widest block mb-1 truncate" style={{ color: color }}>{title}</span>
        <h3 className="text-xl md:text-3xl font-bold text-gray-800 group-hover:text-[#064E3B] transition-colors font-playfair leading-tight mb-1 truncate">{value}</h3>
        
        {footer && (
             <div className="text-[10px] md:text-xs text-gray-500 font-medium leading-relaxed line-clamp-2 w-full opacity-80">
                {footer}
             </div>
        )}
    </div>

    {/* Hover Arrow */}
    <div className="absolute bottom-5 right-5 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-[#064E3B] opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-300 z-20 hidden md:flex">
        <ChevronRight size={12} />
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label, unit = '' }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-xl border border-white/60 p-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] text-xs z-50 min-w-[150px]">
        {label && <p className="font-bold text-[#064E3B] mb-3 font-playfair border-b border-gray-100 pb-2">{label}</p>}
        {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-2 last:mb-0">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shadow-sm ring-1 ring-white" style={{ backgroundColor: entry.fill || entry.color }}></div>
                    <span className="font-medium text-gray-600 capitalize">{entry.name}</span>
                </div>
                <span className="font-bold text-gray-800 tabular-nums">
                    {entry.value.toLocaleString()} <span className="text-[10px] text-gray-400 font-medium ml-0.5">{unit}</span>
                </span>
            </div>
        ))}
      </div>
    );
  }
  return null;
};

import { Status } from '../types';

interface DashboardProps {
  statusFilter: Status;
  onStatusFilterChange: (status: Status) => void;
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

  return (
    <g>
      <text x={cx} y={cy - 20} dy={8} textAnchor="middle" fill="#6B7280" className="text-[10px] font-medium uppercase tracking-wider">
        {payload.name.length > 15 ? `${payload.name.substring(0, 15)}...` : payload.name}
      </text>
      <text x={cx} y={cy + 5} dy={8} textAnchor="middle" fill={fill} className="text-3xl font-bold font-playfair">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <text x={cx} y={cy + 25} dy={8} textAnchor="middle" fill="#9CA3AF" className="text-[10px] font-medium">
        {`${value.toLocaleString()} Porsi`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 8}
        outerRadius={outerRadius + 12}
        fill={fill}
      />
    </g>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ statusFilter, onStatusFilterChange }) => {
  const currentDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const { bumbuMakkah, bumbuMadinah, rteData, expeditionData, tenantData, riceData, telecomData, isLoading } = useData();
  const { user } = useUser();

  // Filter State: 'all' | 'today' | 'week' | 'month'
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  // Helper to simulate data scaling based on time filter
  const getMultiplier = () => {
      switch (timeFilter) {
          case 'today': return 0.05; // ~5% of total
          case 'week': return 0.25;  // ~25% of total
          case 'month': return 0.8;  // ~80% of total
          default: return 1;         // 100%
      }
  };

  const multiplier = getMultiplier();

  // --- COLOR PALETTE ---
  const COLORS = {
      primary: '#064E3B',
      accent: '#D4AF37',
      secondary: '#0F766E',
      neutral: '#9CA3AF',
      gradientStart: '#10B981',
      gradientEnd: '#064E3B'
  };

  const RTE_COLORS = [COLORS.accent, COLORS.primary, COLORS.secondary, '#B45309'];

  // --- DERIVED DATA ---
  
  // 1. Total Volume Bumbu (Ton)
  const totalBumbu = useMemo(() => {
    const volMakkah = bumbuMakkah.filter(i => i.isUsed).reduce((acc, curr) => acc + (parseFloat(curr.volume) || 0), 0);
    const volMadinah = bumbuMadinah.filter(i => i.isUsed).reduce((acc, curr) => acc + (parseFloat(curr.volume) || 0), 0);
    return ((volMakkah + volMadinah) * multiplier).toLocaleString(undefined, { maximumFractionDigits: 1 });
  }, [bumbuMakkah, bumbuMadinah, multiplier]);

  // 2. Total Rice Volume
  const totalRice = useMemo(() => {
    const total = riceData.filter(i => i.isUsed).reduce((acc, curr) => acc + (parseFloat(curr.volume) || 0), 0);
    return Math.floor(total * multiplier);
  }, [riceData, multiplier]);

  // 3. Total RTE Volume
  const totalRTE = useMemo(() => {
    const total = rteData.filter(i => i.isUsed).reduce((acc, curr) => acc + (parseFloat(curr.volume) || 0), 0);
    return Math.floor(total * multiplier);
  }, [rteData, multiplier]);

  // 4. Total Expedition Weight
  const totalCargo = useMemo(() => {
      const total = expeditionData.reduce((acc, curr) => acc + (parseFloat(curr.weight) || 0), 0);
      return Math.floor(total * multiplier);
  }, [expeditionData, multiplier]);

  // 5. Total Tenant Revenue
  const totalRevenue = useMemo(() => {
      const total = tenantData.reduce((acc, curr) => acc + (parseFloat(curr.rentCost) || 0), 0);
      return Math.floor(total * multiplier);
  }, [tenantData, multiplier]);

  // 6. Total Telecom Providers
  const totalTelecom = useMemo(() => {
      return telecomData.length;
  }, [telecomData]);

  // Chart Data: RTE Distribution
  const rteChartData = useMemo(() => {
      return rteData.filter(i => i.isUsed && i.companyName).map((item, idx) => ({
          name: item.companyName,
          value: Math.floor((parseFloat(item.volume) || 0) * multiplier),
          color: RTE_COLORS[idx % RTE_COLORS.length]
      }));
  }, [rteData, multiplier]);

  // Chart Data: Expedition by Company
  const expeditionChartData = useMemo(() => {
      return expeditionData.map(item => ({
          kloter: item.companyName.split(' ')[0],
          berat: Math.floor((parseFloat(item.weight) || 0) * multiplier)
      }));
  }, [expeditionData, multiplier]);

  // Dynamic Trend Data based on Time Filter
  const dataBumbuTrend = useMemo(() => {
      if (timeFilter === 'today') {
          return [
              { label: '08:00', makkah: 5, madinah: 3 },
              { label: '10:00', makkah: 12, madinah: 8 },
              { label: '12:00', makkah: 25, madinah: 20 },
              { label: '14:00', makkah: 18, madinah: 15 },
              { label: '16:00', makkah: 30, madinah: 22 },
              { label: '18:00', makkah: 45, madinah: 35 },
          ];
      } else if (timeFilter === 'week') {
          return [
            { label: 'Senin', makkah: 45, madinah: 30 },
            { label: 'Selasa', makkah: 50, madinah: 35 },
            { label: 'Rabu', makkah: 48, madinah: 38 },
            { label: 'Kamis', makkah: 60, madinah: 45 },
            { label: 'Jumat', makkah: 55, madinah: 50 },
            { label: 'Sabtu', makkah: 65, madinah: 55 },
            { label: 'Minggu', makkah: 70, madinah: 60 },
          ];
      } else if (timeFilter === 'month') {
          return [
              { label: 'Minggu 1', makkah: 200, madinah: 150 },
              { label: 'Minggu 2', makkah: 240, madinah: 180 },
              { label: 'Minggu 3', makkah: 300, madinah: 250 },
              { label: 'Minggu 4', makkah: 280, madinah: 220 },
          ];
      } else {
          return [
            { label: 'Jan', makkah: 100, madinah: 80 },
            { label: 'Feb', makkah: 120, madinah: 90 },
            { label: 'Mar', makkah: 150, madinah: 110 },
            { label: 'Apr', makkah: 180, madinah: 140 },
            { label: 'Mei', makkah: 220, madinah: 180 },
            { label: 'Jun', makkah: 300, madinah: 250 },
            { label: 'Jul', makkah: 250, madinah: 200 },
          ];
      }
  }, [timeFilter]);

  // IPEHU Data
  const dataIPEHU = useMemo(() => {
      const target = 85;
      if (timeFilter === 'today') {
          return [
              { label: '08:00', value: 65, target },
              { label: '10:00', value: 68, target },
              { label: '12:00', value: 75, target },
              { label: '14:00', value: 72, target },
              { label: '16:00', value: 80, target },
              { label: '18:00', value: 85, target },
          ];
      } else if (timeFilter === 'week') {
          return [
            { label: 'Senin', value: 70, target },
            { label: 'Selasa', value: 72, target },
            { label: 'Rabu', value: 75, target },
            { label: 'Kamis', value: 78, target },
            { label: 'Jumat', value: 82, target },
            { label: 'Sabtu', value: 85, target },
            { label: 'Minggu', value: 88, target },
          ];
      } else if (timeFilter === 'month') {
          return [
              { label: 'Minggu 1', value: 75, target },
              { label: 'Minggu 2', value: 78, target },
              { label: 'Minggu 3', value: 82, target },
              { label: 'Minggu 4', value: 85, target },
          ];
      } else {
          return [
            { label: 'Jan', value: 60, target },
            { label: 'Feb', value: 65, target },
            { label: 'Mar', value: 70, target },
            { label: 'Apr', value: 75, target },
            { label: 'Mei', value: 80, target },
            { label: 'Jun', value: 85, target },
            { label: 'Jul', value: 82, target },
          ];
      }
  }, [timeFilter]);

  // Activity Logs
  const activityLogs = useMemo(() => {
      const logs = [];
      rteData.slice(0, 2).forEach(item => {
          logs.push({
              type: 'rte',
              text: `Input RTE: ${item.companyName}`,
              detail: item.menu,
              time: 'Baru saja',
              icon: UtensilsCrossed,
              color: 'text-yellow-600',
              bg: 'bg-yellow-50'
          });
      });
      riceData.slice(0, 1).forEach(item => {
          logs.push({
              type: 'rice',
              text: `Stok Beras: ${item.companyName}`,
              detail: `${item.volume} Ton`,
              time: '5 menit lalu',
              icon: ShoppingCart,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50'
          });
      });
      return logs;
  }, [rteData, riceData]);

  const filterLabel = {
      all: 'Semua Data',
      today: 'Hari Ini',
      week: '1 Minggu',
      month: '1 Bulan'
  };

  return (
    <div className="space-y-6 pb-10 animate-fade-in-up font-sans">
      
      {/* 1. HERO SECTION */}
      <HeroSection 
        title={<span>Ringkasan <span className="text-[#D4AF37]">Ekosistem 2026</span></span>}
        subtitle="Executive Summary realisasi layanan konsumsi, potensi ekonomi, dan logistik haji (Sinkronisasi Data Real-time)."
        currentDate={currentDate}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
      >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none" ref={filterRef}>
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/20 text-white font-bold text-xs md:text-sm hover:bg-white/20 transition-all w-full sm:min-w-[160px] justify-between shadow-lg shadow-black/5 hover:scale-105 hover:text-[#D4AF37]"
                    >
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-[#D4AF37]/20 rounded-md">
                                <Filter size={12} className="text-[#D4AF37]" />
                            </div>
                            <div className="flex flex-col items-start text-left">
                                <span className="text-[8px] text-emerald-100/70 font-normal uppercase tracking-wider leading-none mb-0.5">Filter</span>
                                <span className="leading-none truncate max-w-[80px] sm:max-w-none">{filterLabel[timeFilter]}</span>
                            </div>
                        </div>
                        <ChevronDown size={14} className={`text-emerald-200 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isFilterOpen && (
                        <div className="absolute top-full left-0 mt-2 w-full sm:w-48 bg-white/95 backdrop-blur-xl border border-white/40 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in-up origin-top-left">
                            <div className="p-1">
                                {(['all', 'today', 'week', 'month'] as const).map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            setTimeFilter(key);
                                            setIsFilterOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-between group
                                            ${timeFilter === key 
                                                ? 'bg-[#064E3B]/5 text-[#064E3B]' 
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-[#064E3B]'}`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {timeFilter === key ? <Check size={12} className="text-[#D4AF37]" /> : <span className="w-3"></span>}
                                            {filterLabel[key]}
                                        </span>
                                        {timeFilter === key && <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/10 h-full min-h-[44px] flex-shrink-0 justify-between sm:justify-start">
                    <div className="text-right flex-1 sm:flex-none">
                        <p className="text-[10px] text-emerald-100 uppercase tracking-wide hidden sm:block">Status Data</p>
                        <p className="text-xs md:text-sm font-bold text-white leading-none">Live<span className="inline sm:hidden"> Monitoring</span><span className="hidden sm:inline"> Monitoring</span></p>
                    </div>
                    <div className="relative w-2 h-2 flex items-center justify-center">
                        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                        <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
                    </div>
                </div>
            </div>
      </HeroSection>

      {/* 2. KPI CARDS - 2 Columns mobile, 3 Columns desktop */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {isLoading ? (
            <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </>
        ) : (
            <>
                <StatCard 
                    title="Konsumsi Bumbu" 
                    value={`${totalBumbu} Ton`} 
                    icon={ChefHat} 
                    color={COLORS.primary} 
                    trend={timeFilter === 'today' ? '+2%' : '+12%'}
                    footer={<span>Total Volume Bumbu</span>}
                />
                <StatCard 
                    title="Stok Beras" 
                    value={`${totalRice.toLocaleString()} Ton`} 
                    icon={ShoppingCart} 
                    color="#059669" 
                    trend={timeFilter === 'today' ? '+4%' : '+10%'}
                    footer={<span>Volume Beras Premium</span>}
                />
                 <StatCard 
                    title="Realisasi RTE" 
                    value={`${totalRTE.toLocaleString()} Porsi`} 
                    icon={UtensilsCrossed} 
                    color={COLORS.accent} 
                    trend={timeFilter === 'today' ? '+1%' : '+5%'}
                    footer={<span>Paket Makanan Siap Saji</span>}
                />
                <StatCard 
                    title="Ekspedisi Kargo" 
                    value={`${totalCargo.toLocaleString()} Kg`} 
                    icon={Truck} 
                    color="#B45309" 
                    trend={timeFilter === 'today' ? '+3%' : '+8.5%'}
                    footer={<span>Total Berat Terkirim</span>}
                />
                <StatCard 
                    title="Potensi Tenant" 
                    value={`SAR ${totalRevenue.toLocaleString()}`} 
                    icon={Wallet} 
                    color="#1E3A8A" 
                    trend={timeFilter === 'today' ? '+0.5%' : '+15%'}
                    footer={<span>Estimasi Biaya Sewa</span>}
                />
                <StatCard 
                    title="Provider Telco" 
                    value={`${totalTelecom} Provider`} 
                    icon={Signal} 
                    color="#7C3AED" 
                    trend={timeFilter === 'today' ? '+1' : '+3'}
                    footer={<span>Layanan Aktif Jemaah</span>}
                />
            </>
        )}
      </div>

      {/* 3. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ROW 1: IPEHU (FULL WIDTH) */}
          <div className="lg:col-span-3">
              <GlassCard 
                  title="Indeks Pemberdayaan Ekonomi Haji (IPEHU)" 
                  subtitle="Perkembangan IPEHU Berdasarkan Produk & Jasa"
                  className="!bg-white/70 h-full min-h-[450px]"
                  contentClassName="!pt-0 md:!pt-2 lg:!pt-4"
                  action={<div className="p-2 bg-indigo-50 rounded-lg text-indigo-700"><Activity size={16}/></div>}
              >
                  <div className="mb-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 -mt-2 md:mt-0">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                              <p className="text-xs font-semibold text-indigo-900">Rumus IPEHU:</p>
                              <code className="text-[10px] md:text-xs font-mono bg-white px-2 py-1 rounded border border-indigo-200 text-indigo-700 block w-fit">
                                  IPEHU = (Σ (Nilai Transaksi Produk Indonesia / Total Transaksi)) × 100
                              </code>
                          </div>
                          <div className="md:max-w-lg">
                              <p className="text-[10px] md:text-xs text-indigo-800/80 leading-relaxed">
                                  <span className="font-semibold text-indigo-900">Penjelasan:</span> Indeks ini mengukur kontribusi produk & jasa Indonesia dalam ekosistem haji. Semakin tinggi nilai, semakin besar pemberdayaan ekonomi nasional.
                              </p>
                          </div>
                      </div>
                  </div>

                  <div className="h-[300px] w-full mt-2">
                      {isLoading ? <ChartSkeleton /> : (
                          <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart data={dataIPEHU} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                  <defs>
                                      <linearGradient id="gradIPEHU" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                                      </linearGradient>
                                  </defs>
                                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E5E7EB" />
                                  <XAxis dataKey="label" axisLine={false} tickLine={false} fontSize={11} stroke="#6B7280" fontWeight={500} dy={10} />
                                  <YAxis axisLine={false} tickLine={false} fontSize={11} stroke="#6B7280" domain={[0, 100]} />
                                  <Tooltip content={<CustomTooltip unit="Poin" />} cursor={{ stroke: '#6366F1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                  
                                  <Area 
                                      type="monotone" 
                                      dataKey="value" 
                                      name="Nilai IPEHU"
                                      stroke="#6366F1" 
                                      fill="url(#gradIPEHU)"
                                      strokeWidth={3}
                                      activeDot={{ r: 6, strokeWidth: 0, fill: '#6366F1' }}
                                  />
                                  
                                  <Line 
                                      type="monotone" 
                                      dataKey="target" 
                                      name="Target (85%)" 
                                      stroke="#10B981" 
                                      strokeWidth={2} 
                                      strokeDasharray="5 5" 
                                      dot={false} 
                                      activeDot={false}
                                  />
                                  
                                  <ReferenceLine y={60} label={{ position: 'insideBottomRight', value: 'Min Threshold', fill: 'red', fontSize: 10 }} stroke="red" strokeDasharray="3 3" opacity={0.5} />
                                  
                                  <Legend iconType="circle" wrapperStyle={{paddingTop: '10px', fontSize: '12px'}} />
                              </ComposedChart>
                          </ResponsiveContainer>
                      )}
                  </div>
              </GlassCard>
          </div>

          {/* ROW 2: TREND & MARKET SHARE */}
          <div className="lg:col-span-2">
              <GlassCard 
                  title="Tren Konsumsi Bumbu" 
                  subtitle={`Analisis Wilayah Makkah & Madinah (${filterLabel[timeFilter]})`}
                  className="!bg-white/70 h-full min-h-[380px] lg:min-h-[450px]"
                  contentClassName="!pt-0 md:!pt-2 lg:!pt-4"
                  action={<div className="p-2 bg-emerald-50 rounded-lg text-emerald-700"><TrendingUp size={16}/></div>}
              >
                  <div className="h-[280px] md:h-[320px] lg:h-[380px] w-full -mt-4 md:-mt-2 lg:-mt-4">
                      {isLoading ? <ChartSkeleton /> : (
                          <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={dataBumbuTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                  <defs>
                                      <linearGradient id="gradMakkahHome" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.6}/>
                                          <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                                      </linearGradient>
                                      <linearGradient id="gradMadinahHome" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.6}/>
                                          <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0}/>
                                      </linearGradient>
                                  </defs>
                                  <XAxis dataKey="label" axisLine={false} tickLine={false} fontSize={10} stroke="#6B7280" fontWeight={500} dy={10} />
                                  <YAxis axisLine={false} tickLine={false} fontSize={10} stroke="#6B7280" />
                                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E5E7EB" />
                                  <Tooltip content={<CustomTooltip unit="Ton" />} cursor={{ stroke: COLORS.primary, strokeWidth: 1, strokeDasharray: '4 4' }} />
                                  
                                  <Area 
                                      type="monotone" 
                                      dataKey="makkah" 
                                      name="Makkah"
                                      stroke={COLORS.primary} 
                                      fillOpacity={1} 
                                      fill="url(#gradMakkahHome)" 
                                      strokeWidth={2} 
                                      activeDot={{ r: 4, strokeWidth: 0, fill: COLORS.primary }}
                                  />
                                  
                                  <Area 
                                      type="monotone" 
                                      dataKey="madinah" 
                                      name="Madinah"
                                      stroke={COLORS.accent} 
                                      fillOpacity={1} 
                                      fill="url(#gradMadinahHome)" 
                                      strokeWidth={2} 
                                      activeDot={{ r: 4, strokeWidth: 0, fill: COLORS.accent }}
                                  />
                                  
                                  <Legend iconType="circle" wrapperStyle={{paddingTop: '5px', fontSize: '11px'}} />
                              </AreaChart>
                          </ResponsiveContainer>
                      )}
                  </div>
              </GlassCard>
          </div>

          <div className="lg:col-span-1">
              <GlassCard 
                  title="Market Share RTE" 
                  subtitle={`Distribusi ${filterLabel[timeFilter]}`}
                  className="!bg-white/70 h-full min-h-[450px]"
                  contentClassName="!pt-0 md:!pt-2 lg:!pt-4"
                  action={<div className="p-2 bg-amber-50 rounded-lg text-amber-700"><PieIcon size={16}/></div>}
              >
                  <div className="flex flex-col h-[380px]">
                      <div className="h-[200px] w-full relative -mt-6 md:-mt-4 lg:-mt-6">
                          {isLoading ? <PieSkeleton /> : (
                              rteChartData.length > 0 ? (
                                  <ResponsiveContainer width="100%" height="100%">
                                      <PieChart>
                                          <Pie 
                                              activeIndex={activeIndex}
                                              activeShape={renderActiveShape}
                                              data={rteChartData} 
                                              cx="50%" 
                                              cy="50%" 
                                              innerRadius={80} 
                                              outerRadius={100} 
                                              paddingAngle={4} 
                                              dataKey="value"
                                              cornerRadius={4}
                                              stroke="none"
                                              onMouseEnter={onPieEnter}
                                          >
                                              {rteChartData.map((entry, index) => (
                                                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                              ))}
                                          </Pie>
                                      </PieChart>
                                  </ResponsiveContainer>
                              ) : (
                                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                      <UtensilsCrossed size={24} className="mb-2 opacity-50" />
                                      <p className="text-[10px]">Tidak ada data</p>
                                  </div>
                              )
                          )}
                      </div>
                      
                      {!isLoading && rteChartData.length > 0 && (
                          <div className="mt-auto px-1 pb-2">
                              <div className="grid grid-cols-2 gap-2">
                                  {rteChartData.map((entry, index) => (
                                      <div 
                                          key={index} 
                                          className={`flex flex-col p-2 rounded-lg transition-all cursor-pointer border ${activeIndex === index ? 'bg-amber-50 border-amber-100 shadow-sm' : 'bg-gray-50/50 hover:bg-gray-50 border-transparent'}`}
                                          onMouseEnter={() => setActiveIndex(index)}
                                      >
                                          <div className="flex items-center gap-1.5 mb-1">
                                              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: entry.color }}></div>
                                              <span className={`text-xs md:text-sm font-bold truncate leading-tight ${activeIndex === index ? 'text-amber-900' : 'text-gray-700'}`}>
                                                  {entry.name}
                                              </span>
                                          </div>
                                          <div className="flex items-center justify-between">
                                              <span className="text-[10px] md:text-xs text-gray-400 font-medium">{entry.value.toLocaleString()}</span>
                                              <span className={`text-xs md:text-sm font-bold ${activeIndex === index ? 'text-amber-700' : 'text-gray-900'}`}>
                                                  {totalRTE > 0 ? ((entry.value / totalRTE) * 100).toFixed(1) : 0}%
                                              </span>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>
              </GlassCard>
          </div>

          {/* ROW 3: EXPEDITION & ACTIVITY */}
          <div className="lg:col-span-2">
              <GlassCard 
                  title="Top Pengiriman" 
                  subtitle={`Volume (Kg) - ${filterLabel[timeFilter]}`} 
                  className="!bg-white/70 h-full min-h-[350px]"
                  contentClassName="!pt-0 md:!pt-2 lg:!pt-4"
                  action={<div className="p-2 bg-orange-50 rounded-lg text-orange-700"><BarChart3 size={16}/></div>}
              >
                    <div className="h-[250px] md:h-[280px] -mt-4 md:-mt-2 lg:-mt-4">
                         {isLoading ? <ChartSkeleton /> : (
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={expeditionChartData} layout="vertical" margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                     <defs>
                                        <linearGradient id="gradBar" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#B45309" />
                                            <stop offset="100%" stopColor="#D97706" />
                                        </linearGradient>
                                     </defs>
                                     <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                                     <XAxis type="number" hide />
                                     <YAxis dataKey="kloter" type="category" axisLine={false} tickLine={false} fontSize={10} fontWeight={600} stroke="#4B5563" width={70} />
                                     <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip unit="Kg" />} />
                                     <Bar dataKey="berat" fill="url(#gradBar)" radius={[0, 4, 4, 0]} barSize={20}>
                                        {expeditionChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fillOpacity={0.9} />
                                        ))}
                                     </Bar>
                                </BarChart>
                             </ResponsiveContainer>
                         )}
                    </div>
              </GlassCard>
          </div>

          <div className="lg:col-span-1">
              <GlassCard 
                title="Aktivitas Input" 
                subtitle="Real-time Log" 
                className="!bg-white/70 h-full min-h-[350px]"
                contentClassName="!pt-0 md:!pt-2 lg:!pt-4"
                action={<div className="p-2 bg-blue-50 rounded-lg text-blue-700"><History size={16}/></div>}
              >
                   <div className="space-y-3 -mt-4 md:-mt-2 lg:-mt-4 h-[250px] md:h-[280px] overflow-y-auto custom-scrollbar pr-1">
                       {isLoading ? <ListSkeleton /> : (
                            <>
                               {activityLogs.map((log, idx) => (
                                   <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                                       <div className={`p-2 rounded-lg ${log.bg} ${log.color} mt-0.5 group-hover:scale-110 transition-transform`}>
                                           <log.icon size={14} />
                                       </div>
                                       <div className="flex-1 min-w-0">
                                           <p className="text-xs font-bold text-gray-700 truncate">{log.text}</p>
                                           <div className="flex flex-col gap-0.5 mt-0.5">
                                               <p className="text-[10px] text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded w-fit truncate max-w-full">{log.detail}</p>
                                               <p className="text-[9px] text-gray-400 font-medium flex items-center gap-1"><Clock size={9}/> {log.time}</p>
                                           </div>
                                       </div>
                                   </div>
                               ))}
                               {activityLogs.length === 0 && <p className="text-center text-gray-400 text-xs py-4">Belum ada aktivitas baru.</p>}
                            </>
                       )}
                   </div>
              </GlassCard>
          </div>

      </div>

    </div>
  );
};
