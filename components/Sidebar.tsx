
import React from 'react';
import { LayoutDashboard, BarChart3, PieChart, Settings, LogOut, BookOpen } from 'lucide-react';
import { Page } from '../types';
import { Logo } from './Logo';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, onLogout, isOpen, setIsOpen }) => {
  const isDataActive = currentPage.toString().startsWith('FORM') || currentPage === Page.DATA_ENTRY_PORTAL;

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768 && setIsOpen) {
        setIsOpen(false);
    }
  };

  return (
    <aside className={`fixed left-0 top-0 h-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-30 
       ${isOpen ? 'translate-x-0 w-64 md:w-72' : '-translate-x-full md:translate-x-0 md:w-24'} 
       bg-[#064E3B] shadow-[10px_0_30px_rgba(0,0,0,0.15)] border-r border-white/5 flex flex-col overflow-hidden will-change-[width,transform]`}>
       
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981] opacity-20 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Brand Header */}
      <div className={`h-20 md:h-24 flex items-center ${isOpen ? 'justify-start px-6' : 'justify-center px-0'} border-b border-white/10 relative z-10 bg-gradient-to-b from-[#064E3B] to-transparent overflow-hidden`}>
         <div className={`flex items-center gap-4 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${!isOpen ? '' : ''}`}>
            {/* Logo */}
            <Logo size="md" />
            
            {/* Title */}
            <div className={`leading-tight transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 absolute left-20 pointer-events-none'}`}>
                <h1 className="font-bold text-lg md:text-xl tracking-tight text-white drop-shadow-md font-playfair leading-tight whitespace-nowrap">Dirjen PEE</h1>
                <span className="text-[9px] md:text-[10px] text-[#D4AF37] tracking-normal uppercase font-semibold block mt-0.5 leading-tight w-40 md:w-48 whitespace-normal">Kementerian Haji dan Umrah RI</span>
            </div>
         </div>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar py-6 md:py-8 px-3 md:px-4 space-y-2 relative z-10 overflow-x-hidden">
        {/* Beranda */}
        <MenuItem 
            icon={LayoutDashboard} 
            label="Beranda" 
            isActive={currentPage === Page.DASHBOARD} 
            onClick={() => handleNavigate(Page.DASHBOARD)} 
            isOpen={isOpen}
        />

        {/* Data Pengisian - Direct Link */}
        <MenuItem
            icon={BookOpen}
            label="Data Pengisian"
            isActive={isDataActive}
            onClick={() => handleNavigate(Page.DATA_ENTRY_PORTAL)}
            isOpen={isOpen}
        />

        {/* Laporan Otomatis */}
        <MenuItem 
            icon={BarChart3} 
            label="Laporan Otomatis" 
            isActive={currentPage === Page.REPORTS} 
            onClick={() => handleNavigate(Page.REPORTS)} 
            isOpen={isOpen}
        />

        {/* Grafik & Visualisasi */}
        <MenuItem 
            icon={PieChart} 
            label="Grafik & Visualisasi" 
            isActive={currentPage === Page.VISUALIZATION} 
            onClick={() => handleNavigate(Page.VISUALIZATION)} 
            isOpen={isOpen}
        />

        {/* Pengaturan */}
        <MenuItem 
            icon={Settings} 
            label="Pengaturan" 
            isActive={currentPage === Page.SETTINGS} 
            onClick={() => handleNavigate(Page.SETTINGS)} 
            isOpen={isOpen}
        />
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/5 bg-[#042f24] relative z-10">
        <button
            onClick={onLogout}
            className={`w-full flex items-center ${isOpen ? 'gap-3 md:gap-3.5' : ''} p-3 md:p-3.5 rounded-xl text-red-300/80 hover:bg-red-500/10 hover:text-red-200 transition-all duration-300 group border border-transparent hover:border-red-500/20 overflow-hidden whitespace-nowrap ${!isOpen && 'justify-center'}`}
        >
            <div className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                <LogOut size={20} strokeWidth={2} />
            </div>
            <span className={`font-medium text-sm tracking-wide transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'opacity-100 translate-x-0 max-w-[200px]' : 'opacity-0 translate-x-10 max-w-0 overflow-hidden'}`}>
                Keluar System
            </span>
        </button>
      </div>
    </aside>
  );
};

const MenuItem = ({ icon: Icon, label, isActive, onClick, isOpen }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center ${isOpen ? 'gap-3 md:gap-3.5' : ''} p-3 md:p-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden group whitespace-nowrap active:scale-95
            ${isActive 
                ? 'bg-gradient-to-r from-[#ffffff]/10 to-transparent text-white border border-white/10 shadow-lg' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent hover:shadow-md'
            } ${!isOpen && 'justify-center'}`}
    >
        {/* Active Indicator Line */}
        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[#D4AF37] rounded-r-full shadow-[0_0_10px_#D4AF37]"></div>}
        
        {/* Icon with hover animation */}
        <div className={`relative flex-shrink-0 flex items-center justify-center transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
             <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={`transition-colors duration-300 ${isActive ? 'text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]' : 'group-hover:text-white'}`} />
        </div>
        
        <span className={`text-sm tracking-wide transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'opacity-100 translate-x-0 max-w-[200px]' : 'opacity-0 translate-x-4 max-w-0 overflow-hidden'} ${isActive ? 'font-bold' : 'font-medium'}`}>
            {label}
        </span>
    </button>
);
