
import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Toggle } from '../../components/InputFields';
import { BumbuRecord } from '../../types';
import { Save, Search, ChefHat, ArrowLeft, ChevronDown, ChevronUp, MapPin, Calendar, Clock, User, ClipboardList, Package, DollarSign, Globe, FileText, AlertCircle, Building2, RotateCcw, Send } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useLayout } from '../../contexts/LayoutContext';

interface SpiceFormProps {
  onBack: () => void;
}

export const SpiceForm: React.FC<SpiceFormProps> = ({ onBack }) => {
  const { bumbuMakkah, setBumbuMakkah, bumbuMadinah, setBumbuMadinah } = useData();
  const { sidebarOpen } = useLayout();
  const [activeTab, setActiveTab] = useState<'Makkah' | 'Madinah'>('Makkah');
  const [searchTerm, setSearchTerm] = useState('');
  const [isIdentityExpanded, setIsIdentityExpanded] = useState(true);
  const [otherReason, setOtherReason] = useState('');

  // Select correct data source based on active tab
  const records = activeTab === 'Makkah' ? bumbuMakkah : bumbuMadinah;
  const setRecords = activeTab === 'Makkah' ? setBumbuMakkah : setBumbuMadinah;

  // Identity State
  const [kitchenName, setKitchenName] = useState('');
  const [address, setAddress] = useState('');
  const [pic, setPic] = useState('');
  const [monitorDate, setMonitorDate] = useState('');
  const [monitorTime, setMonitorTime] = useState('');
  const [surveyor, setSurveyor] = useState('');

  // Helper to update identity fields in bulk for all records
  const updateIdentity = (field: keyof BumbuRecord, value: string) => {
      setRecords(prev => prev.map(r => ({ ...r, [field]: value })));
  };

  const handleRecordChange = (id: number, field: keyof BumbuRecord, value: any) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const filteredRecords = useMemo(() => {
    return records.filter(record => 
        record.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [records, searchTerm]);

  // Actions
  const handleReset = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua isian form ini?")) {
        setKitchenName(''); setAddress(''); setPic(''); setMonitorDate(''); setMonitorTime(''); setSurveyor('');
        setOtherReason('');
        // Reset record values locally if needed, or just identity
    }
  };

  const handleDraft = () => {
      // Simulate save draft
      alert("Data berhasil disimpan sebagai Draft.");
  };

  const handleSubmit = () => {
      if (!surveyor || !monitorDate) {
          alert("Mohon lengkapi data surveyor dan tanggal monitoring.");
          return;
      }
      // Simulate submit
      onBack();
  };

  // CONVERSION HELPERS
  const getDateValue = (dateStr: string) => {
      if (!dateStr) return '';
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month}-${day}`;
  };

  const handleDateChange = (val: string) => {
      if (!val) {
          setMonitorDate('');
          updateIdentity('date', '');
          return;
      }
      const [year, month, day] = val.split('-');
      const formatted = `${day}/${month}/${year}`;
      setMonitorDate(formatted);
      updateIdentity('date', formatted);
  };

  const getTimeValue = (timeStr: string) => {
      if (!timeStr) return '';
      return timeStr.replace('.', ':');
  };

  const handleTimeChange = (val: string) => {
      const formatted = val.replace(':', '.');
      setMonitorTime(formatted);
      updateIdentity('time', formatted);
  };

  const toTitleCase = (str: string) => str.replace(/\b\w/g, c => c.toUpperCase());

  // COLOR CONSTANTS
  const THEME_COLOR = '#064E3B';
  const THEME_GRADIENT_FROM = '#064E3B';
  const THEME_GRADIENT_TO = '#042f24';

  return (
    <div className="flex flex-col relative font-sans bg-white/60 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] border border-white/60 shadow-2xl pb-24">
      
      {/* HEADER */}
      <div className="relative z-20 bg-white/40 backdrop-blur-lg border-b border-white/50 rounded-t-[1.5rem] md:rounded-t-[2.5rem] overflow-hidden">
          {/* Watermark Icon */}
          <div className="absolute top-[-20%] right-[-5%] text-[#064E3B] opacity-5 pointer-events-none transform rotate-12 scale-100 md:scale-150">
              <ChefHat size={300} strokeWidth={0.5} />
          </div>

          <div className="px-4 py-4 md:px-8 md:py-6 flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
             <div className="flex items-center gap-4 md:gap-6">
                 <button onClick={onBack} className="p-2 md:p-3 rounded-2xl hover:bg-white text-gray-500 hover:text-[#064E3B] transition-all border border-transparent hover:border-gray-200 shadow-sm"><ArrowLeft size={20} className="md:w-[22px] md:h-[22px]" /></button>
                 <div className="flex items-center gap-3 md:gap-5">
                    <div className={`w-10 h-10 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-[#064E3B]/20 bg-gradient-to-br from-[#064E3B] to-[#042f24] text-white ring-2 md:ring-4 ring-white/50`}>
                        <ChefHat className="w-5 h-5 md:w-8 md:h-8" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-base md:text-2xl font-bold text-[#064E3B] leading-none tracking-tight font-playfair mb-1 md:mb-1.5">Bumbu Pasta</h1>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-[#064E3B]/10 border border-[#064E3B]/20 text-[8px] md:text-[10px] font-bold text-[#064E3B] uppercase tracking-widest">Layanan Konsumsi</span>
                        </div>
                    </div>
                 </div>
             </div>

             <div className="flex items-center gap-3 self-center xl:self-auto">
                {/* ACTION BUTTONS REMOVED - MOVED TO BOTTOM BAR */}
             </div>
          </div>

          {/* Location Toggle Tabs */}
          <div className="px-4 md:px-8 pb-4 relative z-10">
              <div className="flex p-1 bg-gray-100/50 backdrop-blur-md rounded-xl md:rounded-2xl w-full md:w-fit border border-gray-200/50">
                  {['Makkah', 'Madinah'].map((loc) => (
                      <button
                          key={loc}
                          onClick={() => setActiveTab(loc as 'Makkah' | 'Madinah')}
                          className={`flex-1 md:flex-none px-4 md:px-8 py-2 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${
                              activeTab === loc 
                              ? 'bg-white text-[#064E3B] shadow-md shadow-gray-200' 
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                      >
                          Wilayah {loc}
                      </button>
                  ))}
              </div>
          </div>

          {/* Identity Panel (A. Identitas Lokasi) */}
          <div className="px-4 md:px-8 pb-2 relative z-10">
             <div className={`bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-sm relative z-10 ${isIdentityExpanded ? 'max-h-[800px] opacity-100 mb-6 md:mb-8 p-4 md:p-8' : 'max-h-0 opacity-0 mb-0 p-0 border-0'}`}>
                <div className="flex items-center gap-3 mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-200/50">
                    <div className="p-1.5 md:p-2 bg-[#064E3B]/10 rounded-lg md:rounded-xl"><FileText size={16} className="text-[#064E3B] md:w-[18px] md:h-[18px]" /></div>
                    <h3 className="text-xs md:text-sm font-bold text-gray-800 uppercase tracking-widest">A. Identitas Lokasi & Petugas ({activeTab})</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 md:gap-y-6">
                  <PremiumInput label="1. Nama Dapur" icon={MapPin} value={kitchenName} 
                      onChange={(val: string) => { setKitchenName(val); updateIdentity('kitchenName', val); }} 
                      placeholder="Isi nama dapur..." />
                  <PremiumInput label="2. Alamat" icon={MapPin} value={address} 
                      onChange={(val: string) => { setAddress(val); updateIdentity('address', val); }} 
                      placeholder="Isi alamat lengkap..." />
                  <PremiumInput label="3. Penanggung Jawab Dapur" icon={User} value={pic} 
                      onChange={(val: string) => { setPic(val); updateIdentity('pic', val); }} 
                      placeholder="Isi nama PIC..." />
                  
                  <PremiumInput label="4. Tanggal Monitoring" icon={Calendar} type="date" 
                      value={getDateValue(monitorDate)} 
                      onChange={handleDateChange}
                  />

                  <PremiumInput label="5. Waktu Monitoring" icon={Clock} type="time" 
                      value={getTimeValue(monitorTime)} 
                      onChange={handleTimeChange} 
                  />
                  
                  <PremiumInput label="6. Surveyor" icon={User} value={surveyor} 
                      onChange={(val: string) => { setSurveyor(val); updateIdentity('surveyor', val); }} 
                      placeholder="Isi nama surveyor..." />
                </div>
             </div>
             
             {/* Toggle Button */}
             <div className="flex justify-center -mt-4 relative z-20">
                 <button 
                    onClick={() => setIsIdentityExpanded(!isIdentityExpanded)}
                    className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-gray-500 hover:text-[#064E3B] hover:border-[#064E3B]/20 shadow-lg shadow-gray-100 transition-all hover:shadow-xl hover:-translate-y-0.5"
                 >
                    {isIdentityExpanded ? 'Tutup Identitas' : 'Buka Identitas'}
                    {isIdentityExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                 </button>
             </div>
          </div>
      </div>

      {/* GRID CONTENT */}
      <div className="p-4 md:p-8 pt-2 z-10">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-2.5 bg-[#064E3B] rounded-xl shadow-lg shadow-[#064E3B]/20"><Package size={20} className="text-white w-4 h-4 md:w-5 md:h-5" /></div>
                <div>
                    <h3 className="text-base md:text-lg font-bold text-[#064E3B] font-playfair">B. Jenis Bumbu Pasta ({activeTab})</h3>
                    <p className="text-[10px] md:text-xs text-gray-500 font-medium tracking-wide">Input ketersediaan, perusahaan penyedia, volume, dan harga</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                  {/* Search Bar - Unified */}
                  <div className="relative group flex-1 md:flex-none">
                      <div className="relative">
                          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#064E3B] transition-colors z-10" />
                          <input 
                              type="text" 
                              placeholder="Cari..." 
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-9 pr-4 py-2 w-full md:w-32 lg:w-64 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-sm focus:outline-none focus:border-[#064E3B] focus:ring-4 focus:ring-[#064E3B]/10 transition-all placeholder:text-gray-400 group-hover:border-[#064E3B]/30 group-hover:shadow-md"
                          />
                      </div>
                  </div>

                  <div className="px-4 py-2 bg-white/50 rounded-lg text-xs font-bold text-gray-500 border border-white whitespace-nowrap flex-shrink-0">
                      Total {filteredRecords.length} jenis
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {filteredRecords.map((record, idx) => (
                <div 
                    key={record.id} 
                    className="relative bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
                >
                   <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#D4AF37] rounded-l-2xl md:rounded-l-3xl"></div>

                   <div className="flex justify-between items-center mb-4 md:mb-6 pl-2">
                       <div className="flex items-center gap-3 md:gap-4">
                           <div className="px-2 py-1 md:px-2.5 md:py-1.5 rounded-lg bg-[#064E3B]/10 text-[#064E3B] text-[10px] md:text-xs font-bold">
                               {idx + 1}
                           </div>
                           <h3 className="text-xs md:text-sm font-bold text-[#064E3B] uppercase tracking-tight">{record.name}</h3>
                       </div>
                       <div className="mr-4 md:mr-8">
                            <Toggle checked={record.isUsed} onChange={(val) => handleRecordChange(record.id, 'isUsed', val)} label="Tersedia" />
                       </div>
                   </div>

                   <div className={`space-y-4 md:space-y-6 transition-all duration-500 ease-in-out ${record.isUsed ? 'max-h-[800px] opacity-100 mt-2' : 'max-h-0 opacity-0 overflow-hidden mt-0'}`}>
                       
                       <div className="space-y-1.5 pb-4 border-b border-dashed border-gray-200">
                           <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5"><Building2 size={12} className="text-[#064E3B]"/> Perusahaan Penyedia</label>
                           <div className="relative group/input">
                               <input type="text" value={record.companyName || ''} onChange={(e) => handleRecordChange(record.id, 'companyName', toTitleCase(e.target.value))} 
                                      className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-gray-50/50 border border-gray-200 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold text-gray-800 focus:bg-white focus:border-[#064E3B] focus:ring-4 focus:ring-[#064E3B]/5 outline-none transition-all placeholder:font-normal placeholder:text-gray-300" placeholder="Nama Perusahaan / Suplier..." />
                           </div>
                       </div>

                       <div className="grid grid-cols-2 gap-3 md:gap-5">
                           <div className="space-y-1.5">
                               <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5"><Package size={12} className="text-[#D4AF37]"/> Volume/Ton</label>
                               <div className="relative group/input">
                                   <input type="number" value={record.volume} onChange={(e) => handleRecordChange(record.id, 'volume', e.target.value)} 
                                          className="w-full px-3 py-2.5 md:px-3 md:py-3 bg-gray-50/50 border border-gray-200 rounded-lg md:rounded-xl text-xs md:text-sm font-bold text-gray-700 focus:bg-white focus:border-[#064E3B] focus:ring-4 focus:ring-[#064E3B]/5 outline-none transition-all placeholder:font-normal placeholder:text-gray-300" placeholder="0.00" />
                               </div>
                           </div>
                           <div className="space-y-1.5">
                               <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5"><DollarSign size={12} className="text-[#D4AF37]"/> Harga</label>
                               <div className="relative group/input">
                                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] md:text-xs font-bold text-gray-400">SAR</span>
                                   <input type="number" value={record.price} onChange={(e) => handleRecordChange(record.id, 'price', e.target.value)} 
                                          className="w-full pl-9 md:pl-10 pr-3 py-2.5 md:py-3 bg-gray-50/50 border border-gray-200 rounded-lg md:rounded-xl text-xs md:text-sm font-bold text-[#064E3B] focus:bg-white focus:border-[#064E3B] focus:ring-4 focus:ring-[#064E3B]/10 outline-none transition-all placeholder:font-normal placeholder:text-gray-300" placeholder="0" />
                               </div>
                           </div>
                       </div>
                       
                       <div className="space-y-1.5">
                            <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5"><ClipboardList size={12} className="text-gray-400"/> Bahan Lain</label>
                            <input type="text" value={record.otherIngredients} onChange={(e) => handleRecordChange(record.id, 'otherIngredients', toTitleCase(e.target.value))} 
                                   className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-gray-50/50 border border-gray-200 rounded-lg md:rounded-xl text-xs md:text-sm text-gray-600 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 outline-none transition-all placeholder:text-gray-300" placeholder="Bahan tambahan..." />
                       </div>

                       <div className="pt-4 border-t border-dashed border-gray-200 grid grid-cols-2 gap-3 md:gap-5">
                           <div className="space-y-1.5">
                                <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5"><Globe size={12}/> Produk Asal</label>
                                <input type="text" value={record.originProduct} onChange={(e) => handleRecordChange(record.id, 'originProduct', toTitleCase(e.target.value))} 
                                       className="w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 focus:bg-white focus:border-gray-400 outline-none transition-all" placeholder="Merk / Negara" />
                           </div>
                           <div className="space-y-1.5">
                                <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5"><DollarSign size={12}/> Harga (Asal)</label>
                                <input type="number" value={record.productPrice} onChange={(e) => handleRecordChange(record.id, 'productPrice', e.target.value)} 
                                       className="w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 focus:bg-white focus:border-gray-400 outline-none transition-all" placeholder="0" />
                           </div>
                       </div>
                   </div>
                </div>
              ))}
          </div>

          <div className="relative group overflow-hidden rounded-2xl md:rounded-3xl border border-white/60 shadow-xl bg-white/60 backdrop-blur-xl mb-8">
               <div className="absolute top-0 left-0 w-1.5 h-full bg-[#D4AF37]"></div>
               <div className="p-4 md:p-8">
                   <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                       <div className="p-1.5 md:p-2 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/20"><AlertCircle size={16} className="text-[#D4AF37] md:w-5 md:h-5" /></div>
                       <h3 className="text-xs md:text-base font-bold text-gray-800 uppercase tracking-wide">C. Alasan Memilih Bumbu Lain ({activeTab})</h3>
                   </div>
                   <textarea 
                      value={otherReason}
                      onChange={(e) => setOtherReason(e.target.value)}
                      className="w-full h-24 md:h-32 bg-white/80 border border-gray-200 rounded-xl md:rounded-2xl p-3 md:p-5 text-xs md:text-sm font-medium text-gray-700 focus:border-[#064E3B] focus:ring-4 focus:ring-[#064E3B]/5 outline-none resize-none shadow-inner transition-all hover:bg-white"
                      placeholder="Jelaskan alasan jika ada bumbu non-standar yang digunakan..."
                   ></textarea>
               </div>
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
        <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 md:gap-2 group-focus-within:text-[#064E3B] transition-colors">
            <Icon size={12} className="text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" /> {label}
        </label>
        <div className="relative">
            <input 
                type={type} 
                value={value} 
                onChange={(e) => {
                    const val = e.target.value;
                    onChange(type === 'text' ? val.replace(/\b\w/g, c => c.toUpperCase()) : val);
                }} 
                className="w-full text-xs md:text-sm font-semibold text-gray-700 bg-white/60 border border-gray-200 rounded-lg md:rounded-xl px-3 py-2.5 md:px-4 md:py-3.5 focus:bg-white focus:border-[#064E3B] focus:ring-4 focus:ring-[#064E3B]/5 outline-none transition-all shadow-sm placeholder:font-medium placeholder:text-gray-300 hover:border-gray-300 hover:bg-white/80" 
                placeholder={placeholder} 
            />
        </div>
    </div>
);
