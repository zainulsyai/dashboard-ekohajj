
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Toggle } from '../../components/InputFields';
import { Save, Plus, Trash2, ArrowLeft, UtensilsCrossed, MapPin, User, Calendar, Box, DollarSign, Clock, FileText, Building2, Building, ChefHat, Users, MenuSquare, RotateCcw, Send } from 'lucide-react';
import { RTERecord } from '../../types';
import { useData } from '../../contexts/DataContext';
import { useLayout } from '../../contexts/LayoutContext';

interface RTEFormProps {
    onBack: () => void;
}

export const RTEForm: React.FC<RTEFormProps> = ({ onBack }) => {
  const { rteData, setRteData } = useData();
  const { sidebarOpen } = useLayout();
  
  // Identity state matching PDF Page 7
  const [kitchenName, setKitchenName] = useState(''); 
  const [address, setAddress] = useState(''); 
  const [hotelName, setHotelName] = useState('');
  const [hotelNumber, setHotelNumber] = useState('');
  const [kloterName, setKloterName] = useState('');
  const [monitorDate, setMonitorDate] = useState(''); 
  const [monitorTime, setMonitorTime] = useState(''); 
  const [surveyor, setSurveyor] = useState(''); 

  // Sync identity to all records
  const updateIdentity = (field: keyof RTERecord, value: string) => {
    setRteData(prev => prev.map(r => ({ ...r, [field]: value })));
  };

  const handleRecordChange = (id: number, field: keyof RTERecord, value: any) => {
      setRteData(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addRecord = () => {
      const newId = rteData.length > 0 ? Math.max(...rteData.map(r => r.id)) + 1 : 1;
      setRteData([...rteData, { 
          id: newId, 
          companyName: '', 
          menu: '', 
          isUsed: false, 
          volume: '', 
          price: '',
          // Pre-fill identity
          kitchenName, address, hotelName, hotelNumber, kloterName, surveyor,
          date: monitorDate, time: monitorTime
      }]);
  };

  const removeRecord = (id: number) => setRteData(rteData.filter(r => r.id !== id));

  // ACTIONS
  const handleReset = () => {
    if(window.confirm('Hapus semua data di form ini?')) {
       setKitchenName(''); setAddress(''); setHotelName(''); setHotelNumber(''); setKloterName(''); setMonitorDate(''); setMonitorTime(''); setSurveyor('');
    }
  };
  const handleDraft = () => alert('Data disimpan sebagai draft');
  const handleSubmit = () => {
    onBack();
  };

  const getDateValue = (dateStr: string) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };
  const handleDateChange = (val: string) => {
      if (!val) { setMonitorDate(''); updateIdentity('date', ''); return; }
      const [year, month, day] = val.split('-');
      const formatted = `${day}/${month}/${year}`;
      setMonitorDate(formatted);
      updateIdentity('date', formatted);
  };
  const getTimeValue = (timeStr: string) => (timeStr ? timeStr.replace('.', ':') : '');
  const handleTimeChange = (val: string) => {
      const formatted = val.replace(':', '.');
      setMonitorTime(formatted);
      updateIdentity('time', formatted);
  };

  // THEME COLOR: GOLD #D4AF37
  const THEME_COLOR = '#D4AF37';

  return (
    <div className="flex flex-col relative font-sans bg-white/60 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] border border-white/60 shadow-2xl pb-24">
      <div className="relative z-20 bg-white/40 backdrop-blur-lg border-b border-white/50 px-4 py-4 md:px-8 md:py-6 rounded-t-[1.5rem] md:rounded-t-[2.5rem] overflow-hidden">
         {/* Watermark */}
         <div className="absolute top-[-20%] right-[-5%] text-[#D4AF37] opacity-5 pointer-events-none transform rotate-12 scale-100 md:scale-150">
           <UtensilsCrossed size={300} strokeWidth={0.5} />
         </div>

         <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 relative z-10">
             <div className="flex items-center gap-4 md:gap-6">
                 <button onClick={onBack} className="p-2 md:p-3 rounded-2xl hover:bg-white text-gray-500 hover:text-[#D4AF37] transition-all border border-transparent hover:border-gray-200"><ArrowLeft size={20} className="md:w-[22px] md:h-[22px]" /></button>
                 <div className="flex items-center gap-3 md:gap-5">
                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37] to-[#B4941F] text-white ring-2 md:ring-4 ring-white/50">
                        <UtensilsCrossed className="w-5 h-5 md:w-8 md:h-8" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-base md:text-2xl font-bold text-[#D4AF37] font-playfair leading-tight mb-1 md:mb-0">Makanan Siap Saji (RTE)</h1>
                        <div className="flex items-center gap-2">
                             <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[8px] md:text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">Makkah Monitoring</span>
                        </div>
                    </div>
                 </div>
             </div>
             
             {/* Action Buttons REMOVED - MOVED TO BOTTOM BAR */}
         </div>

         <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-sm relative z-10">
             <div className="flex items-center gap-3 mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-200/50">
                <div className="p-1.5 md:p-2 bg-[#D4AF37]/10 rounded-lg md:rounded-xl"><FileText size={16} className="text-[#D4AF37] md:w-[18px] md:h-[18px]" /></div>
                <h3 className="text-xs md:text-sm font-bold text-gray-800 uppercase tracking-widest">A. Identitas Lokasi & Petugas</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  <PremiumInput label="1. Nama Dapur" icon={MapPin} value={kitchenName} onChange={(v: string) => { setKitchenName(v); updateIdentity('kitchenName', v); }} placeholder="Nama Dapur..." />
                  <PremiumInput label="2. Alamat" icon={MapPin} value={address} onChange={(v: string) => { setAddress(v); updateIdentity('address', v); }} placeholder="Alamat..." />
                  <PremiumInput label="3. Nama Hotel" icon={Building} value={hotelName} onChange={(v: string) => { setHotelName(v); updateIdentity('hotelName', v); }} placeholder="Nama Hotel..." />
                  <PremiumInput label="4. Nomor Hotel" icon={Building2} value={hotelNumber} onChange={(v: string) => { setHotelNumber(v); updateIdentity('hotelNumber', v); }} placeholder="No. Hotel..." />
                  <PremiumInput label="5. Nama Kloter" icon={Users} value={kloterName} onChange={(v: string) => { setKloterName(v); updateIdentity('kloterName', v); }} placeholder="Kloter..." />
                  <PremiumInput label="6. Tanggal Monitoring" icon={Calendar} type="date" value={getDateValue(monitorDate)} onChange={handleDateChange} />
                  <PremiumInput label="7. Waktu Monitoring" icon={Clock} type="time" value={getTimeValue(monitorTime)} onChange={handleTimeChange} />
                  <PremiumInput label="8. Surveyor" icon={User} value={surveyor} onChange={(v: string) => { setSurveyor(v); updateIdentity('surveyor', v); }} placeholder="Nama Surveyor..." />
             </div>
         </div>
      </div>

      <div className="p-4 md:p-8">
          {/* Section B Header */}
          <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-2.5 bg-[#D4AF37] rounded-xl shadow-lg shadow-[#D4AF37]/20"><UtensilsCrossed size={20} className="text-white w-4 h-4 md:w-5 md:h-5" /></div>
                <div>
                    <h3 className="text-base md:text-lg font-bold text-[#D4AF37] font-playfair">B. Jenis Makanan Siap Saji (RTE)</h3>
                    <p className="text-[10px] md:text-xs text-gray-500 font-medium tracking-wide">Daftar perusahaan dan menu katering</p>
                </div>
              </div>
              <div className="px-4 py-2 bg-white/50 rounded-lg text-xs font-bold text-gray-500 border border-white">
                  Total {rteData.length} item
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 pb-10">
            {rteData.map((record, idx) => (
                <div key={record.id} className="relative bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                   <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#D4AF37] rounded-l-2xl md:rounded-l-3xl"></div>
                   <button onClick={() => removeRecord(record.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-red-50 p-2 rounded-lg"><Trash2 size={16} /></button>
                   <div className="flex justify-between items-center mb-4 md:mb-6 pl-2">
                       <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1.5 rounded-lg">No. {idx + 1}</span>
                       <div className="mr-4 md:mr-8">
                            <Toggle checked={record.isUsed} onChange={(v) => handleRecordChange(record.id, 'isUsed', v)} label="Tersedia" />
                       </div>
                   </div>
                   <div className="space-y-4">
                       <CardInput icon={Building2} placeholder="Nama Perusahaan" value={record.companyName} onChange={(e: any) => handleRecordChange(record.id, 'companyName', e.target.value)} />
                       <CardInput icon={MenuSquare} placeholder="Menu Makanan" value={record.menu} onChange={(e: any) => handleRecordChange(record.id, 'menu', e.target.value)} />
                       <div className="grid grid-cols-2 gap-4">
                           <CardInput icon={Box} placeholder="Porsi/Paket" type="number" value={record.volume} onChange={(e: any) => handleRecordChange(record.id, 'volume', e.target.value)} />
                           <CardInput icon={DollarSign} placeholder="Harga (SAR)" type="number" value={record.price} onChange={(e: any) => handleRecordChange(record.id, 'price', e.target.value)} highlight />
                       </div>
                   </div>
                </div>
            ))}
            <button onClick={addRecord} className="flex flex-col items-center justify-center min-h-[120px] md:min-h-[250px] border-2 border-dashed border-gray-200 rounded-2xl md:rounded-3xl hover:bg-[#D4AF37]/5 transition-all text-gray-400 font-bold gap-2 md:gap-3 group text-xs md:text-base">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm group-hover:scale-110 transition-transform"><Plus size={20} className="md:w-6 md:h-6" /></div>
                Tambah Menu RTE
            </button>
          </div>
      </div>
      
      {/* STICKY ACTION BAR */}
      <div className={`sticky bottom-4 md:bottom-6 z-50 flex justify-center w-full px-4 pb-4 ${sidebarOpen ? 'blur-sm pointer-events-none opacity-50 md:blur-none md:pointer-events-auto md:opacity-100' : ''}`}>
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full p-1.5 md:p-2 flex items-center justify-between md:justify-center gap-2 md:gap-4 w-full md:w-auto md:min-w-[400px]">
            <button 
                onClick={handleReset}
                className="group flex items-center justify-center gap-2 px-3 py-2.5 md:px-4 md:py-3 rounded-full text-[10px] md:text-sm font-bold text-red-600 bg-red-50/50 border border-red-100 hover:bg-red-100 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 flex-1 md:flex-none"
                title="Hapus semua isian"
            >
                <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:-rotate-180 transition-transform duration-500" /> 
                <span className="hidden sm:inline">Reset</span>
            </button>
            
            <button 
                onClick={handleDraft}
                className="group flex items-center justify-center gap-2 px-3 py-2.5 md:px-4 md:py-3 rounded-full text-[10px] md:text-sm font-bold text-[#D4AF37] bg-yellow-50/50 border border-yellow-100 hover:bg-yellow-100 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 flex-1 md:flex-none"
            >
                <Save className="w-3.5 h-3.5 md:w-4 md:h-4" /> <span>Draft</span>
            </button>

            <button 
                onClick={handleSubmit}
                className="group flex items-center justify-center gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-full text-[10px] md:text-sm font-bold text-white bg-gradient-to-br from-[#064E3B] to-[#042f24] hover:from-[#053d2e] hover:to-[#064E3B] transition-all duration-300 shadow-lg shadow-[#064E3B]/30 hover:shadow-[#064E3B]/50 hover:-translate-y-1 active:scale-95 flex-[2] md:flex-none md:min-w-[180px]"
            >
                <Send className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                <span>Submit Laporan</span>
            </button>
        </div>
      </div>
    </div>
  );
};

const PremiumInput = ({ label, icon: Icon, type = "text", value, onChange, placeholder }: any) => (
  <div className="flex flex-col gap-1.5 md:gap-2 group">
    <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 md:gap-2 group-focus-within:text-[#D4AF37] transition-colors">
      <Icon size={12} className="text-gray-300 group-focus-within:text-[#D4AF37] transition-colors" /> {label}
    </label>
    <input 
        type={type} 
        value={value} 
        onChange={e => {
            const val = e.target.value;
            onChange(type === 'text' ? val.replace(/\b\w/g, c => c.toUpperCase()) : val);
        }} 
        className="w-full text-xs md:text-sm font-semibold text-gray-700 bg-white/60 border border-gray-200 rounded-lg md:rounded-xl px-3 py-2.5 md:px-4 md:py-3.5 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/5 outline-none transition-all placeholder:text-gray-300" 
        placeholder={placeholder} 
    />
  </div>
);

const CardInput = ({ icon: Icon, value, onChange, placeholder, type = "text", highlight = false }: any) => (
    <div className="relative group/input">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-[#D4AF37] transition-colors">
            <Icon size={16} className={highlight ? 'text-[#D4AF37]' : ''} />
        </div>
        <input 
            type={type} 
            value={value} 
            onChange={(e) => {
                if (type === 'text') {
                    e.target.value = e.target.value.replace(/\b\w/g, c => c.toUpperCase());
                }
                onChange(e);
            }} 
            placeholder={placeholder}
            className={`w-full bg-gray-50/50 border border-gray-100 rounded-lg md:rounded-xl py-2.5 pl-9 md:py-3 md:pl-10 text-xs md:text-sm font-semibold text-gray-700 focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 outline-none transition-all placeholder:text-gray-300 ${highlight ? 'text-[#D4AF37]' : ''}`}
        />
    </div>
);
