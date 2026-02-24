
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Toggle } from '../../components/InputFields';
import { Save, Signal, ArrowLeft, Globe, User, Users, MapPin, Calendar, FileText, Plus, Trash2, Smartphone, Wifi, RotateCcw, Send } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { TelecomRecord } from '../../types';
import { useLayout } from '../../contexts/LayoutContext';

interface TelecomFormProps {
    onBack: () => void;
}

export const TelecomForm: React.FC<TelecomFormProps> = ({ onBack }) => {
  const { telecomData, setTelecomData } = useData();
  const { sidebarOpen } = useLayout();

  // Identity State matching PDF Page 14
  const [respondentName, setRespondentName] = useState(''); 
  const [kloter, setKloter] = useState(''); 
  const [embarkation, setEmbarkation] = useState(''); 
  const [province, setProvince] = useState(''); 
  const [surveyDate, setSurveyDate] = useState(''); 
  const [surveyor, setSurveyor] = useState(''); 

  // Sync identity
  const updateIdentity = (field: keyof TelecomRecord, value: string) => {
    setTelecomData(prev => prev.map(r => ({ ...r, [field]: value })));
  };

  const handleRecordChange = (id: number, field: keyof TelecomRecord, value: any) => {
    setTelecomData(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addRecord = () => {
    const newId = telecomData.length > 0 ? Math.max(...telecomData.map(p => p.id)) + 1 : 1;
    setTelecomData([...telecomData, { 
        id: newId, 
        providerName: '', roamingPackage: '',
        // Pre-fill identity
        respondentName, kloter, embarkation, province, surveyor, date: surveyDate
    }]);
  };

  const removeRecord = (id: number) => {
    setTelecomData(prev => prev.filter(p => p.id !== id));
  };

  // ACTIONS
  const handleReset = () => {
    if(window.confirm('Hapus semua data di form ini?')) {
       setRespondentName(''); setKloter(''); setEmbarkation(''); setProvince(''); setSurveyor(''); setSurveyDate('');
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
      if (!val) { setSurveyDate(''); updateIdentity('date', ''); return; }
      const [year, month, day] = val.split('-');
      const formatted = `${day}/${month}/${year}`;
      setSurveyDate(formatted);
      updateIdentity('date', formatted);
  };

  // THEME COLOR: PURPLE #7C3AED
  const THEME_COLOR = '#7C3AED';

  return (
    <div className="flex flex-col relative font-sans bg-white/60 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] border border-white/60 shadow-2xl pb-24">
      <div className="relative z-20 bg-white/40 backdrop-blur-lg border-b border-white/50 px-4 py-4 md:px-8 md:py-6 rounded-t-[1.5rem] md:rounded-t-[2.5rem] overflow-hidden">
         {/* Watermark */}
         <div className="absolute top-[-20%] right-[-5%] text-[#7C3AED] opacity-5 pointer-events-none transform rotate-12 scale-100 md:scale-150">
           <Signal size={300} strokeWidth={0.5} />
         </div>

         <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 relative z-10">
             <div className="flex items-center gap-4 md:gap-6">
                 <button onClick={onBack} className="p-2 md:p-3 rounded-2xl hover:bg-white text-gray-500 hover:text-[#7C3AED] transition-all border border-transparent hover:border-gray-200"><ArrowLeft size={20} className="md:w-[22px] md:h-[22px]" /></button>
                 <div className="flex items-center gap-3 md:gap-5">
                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-[#7C3AED]/20 bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white ring-2 md:ring-4 ring-white/50">
                        <Signal className="w-5 h-5 md:w-8 md:h-8" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-base md:text-2xl font-bold text-[#7C3AED] font-playfair leading-tight mb-1 md:mb-0">Telekomunikasi</h1>
                        <div className="flex items-center gap-2">
                             <span className="px-2 py-0.5 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[8px] md:text-[10px] font-bold text-[#7C3AED] uppercase tracking-widest">Potensi Provider Jemaah</span>
                        </div>
                    </div>
                 </div>
             </div>
             
             {/* Action Buttons REMOVED - MOVED TO BOTTOM BAR */}
         </div>

         <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-sm relative z-10">
              <div className="flex items-center gap-3 mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-200/50">
                <div className="p-1.5 md:p-2 bg-[#7C3AED]/10 rounded-lg md:rounded-xl"><FileText size={16} className="text-[#7C3AED] md:w-[18px] md:h-[18px]" /></div>
                <h3 className="text-xs md:text-sm font-bold text-gray-800 uppercase tracking-widest">A. Identitas Responden & Petugas</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  <PremiumInput label="1. Nama Responden" icon={User} value={respondentName} onChange={(v: string) => { setRespondentName(v); updateIdentity('respondentName', v); }} placeholder="Nama Jemaah..." />
                  <PremiumInput label="2. Kloter" icon={Users} value={kloter} onChange={(v: string) => { setKloter(v); updateIdentity('kloter', v); }} placeholder="Kloter..." />
                  <PremiumInput label="3. Embarkasi" icon={MapPin} value={embarkation} onChange={(v: string) => { setEmbarkation(v); updateIdentity('embarkation', v); }} placeholder="Kota Embarkasi..." />
                  <PremiumInput label="4. Provinsi" icon={MapPin} value={province} onChange={(v: string) => { setProvince(v); updateIdentity('province', v); }} placeholder="Provinsi..." />
                  <PremiumInput label="5. Tanggal Survei" icon={Calendar} type="date" value={getDateValue(surveyDate)} onChange={handleDateChange} />
                  <PremiumInput label="6. Surveyor" icon={User} value={surveyor} onChange={(v: string) => { setSurveyor(v); updateIdentity('surveyor', v); }} placeholder="Nama Surveyor..." />
              </div>
         </div>
      </div>

      <div className="p-4 md:p-8">
        {/* Section B Header */}
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-2.5 bg-[#7C3AED] rounded-xl shadow-lg shadow-[#7C3AED]/20"><Signal size={20} className="text-white w-4 h-4 md:w-5 md:h-5" /></div>
              <div>
                  <h3 className="text-base md:text-lg font-bold text-[#7C3AED] font-playfair">B. Potensi Penggunaan Provider Telekomunikasi</h3>
                  <p className="text-[10px] md:text-xs text-gray-500 font-medium tracking-wide">Survey penggunaan paket data jemaah</p>
              </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
            {telecomData.map((prov, idx) => {
                return (
                    <div key={prov.id} className="relative rounded-2xl md:rounded-3xl transition-all overflow-hidden flex flex-col p-4 md:p-6 border bg-white shadow-xl ring-2 ring-[#7C3AED]/5 group hover:ring-[#7C3AED]/30 hover:shadow-2xl">
                           <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#D4AF37] rounded-l-2xl md:rounded-l-3xl"></div>
                           <button onClick={() => removeRecord(prov.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 bg-red-50 p-2 rounded-lg"><Trash2 size={16}/></button>
                           
                           <div className="flex items-center gap-3 mb-4 md:mb-6 pl-2">
                               <span className="text-xs font-bold text-[#7C3AED] bg-[#7C3AED]/10 px-2.5 py-1.5 rounded-lg">Provider #{idx + 1}</span>
                           </div>
                           
                           <div className="space-y-4">
                                <CardInput 
                                    icon={Smartphone} 
                                    placeholder="Nama Provider" 
                                    value={prov.providerName} 
                                    onChange={(e: any) => handleRecordChange(prov.id, 'providerName', e.target.value)} 
                                    highlight
                                />
                                <CardInput 
                                    icon={Wifi} 
                                    placeholder="Paket Roaming (RoaMax)" 
                                    value={prov.roamingPackage} 
                                    onChange={(e: any) => handleRecordChange(prov.id, 'roamingPackage', e.target.value)} 
                                />
                           </div>
                    </div>
                );
            })}
            
            <button onClick={addRecord} className="flex flex-col items-center justify-center min-h-[120px] md:min-h-[200px] border-2 border-dashed border-gray-200 rounded-2xl md:rounded-3xl hover:bg-[#7C3AED]/5 transition-all text-gray-400 font-bold gap-2 md:gap-3 group text-xs md:text-base">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm group-hover:scale-110 transition-transform"><Plus size={20} className="md:w-6 md:h-6" /></div>
                Tambah Provider Baru
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
    <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 md:gap-2 group-focus-within:text-[#7C3AED] transition-colors">
      <Icon size={12} className="text-gray-300 group-focus-within:text-[#D4AF37] transition-colors" /> {label}
    </label>
    <input 
        type={type} 
        value={value} 
        onChange={e => {
            const val = e.target.value;
            onChange(type === 'text' ? val.replace(/\b\w/g, c => c.toUpperCase()) : val);
        }} 
        className="w-full text-xs md:text-sm font-semibold text-gray-700 bg-white/60 border border-gray-200 rounded-lg md:rounded-xl px-3 py-2.5 md:px-4 md:py-3.5 focus:bg-white focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/5 outline-none transition-all placeholder:text-gray-300" 
        placeholder={placeholder} 
    />
  </div>
);

const CardInput = ({ icon: Icon, value, onChange, placeholder, type = "text", highlight = false }: any) => (
    <div className="relative group/input">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-[#7C3AED] transition-colors">
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
            className={`w-full bg-gray-50/50 border border-gray-100 rounded-lg md:rounded-xl py-2.5 pl-9 md:py-3 md:pl-10 text-xs md:text-sm font-semibold text-gray-700 focus:bg-white focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10 outline-none transition-all placeholder:text-gray-300 ${highlight ? 'text-[#7C3AED]' : ''}`}
        />
    </div>
);
