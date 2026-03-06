import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Bell, AlignLeft, Moon, Sun, Globe } from 'lucide-react';
import { Page } from '../types';
import { LayoutProvider } from '../contexts/LayoutContext';
import { useUser } from '../contexts/UserContext';
import { useData } from '../contexts/DataContext';
import { Logo } from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();
  const { darkMode, setDarkMode, isEnglish, setIsEnglish } = useData();

  return (
    <LayoutProvider value={{ sidebarOpen, setSidebarOpen }}>
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#F0F4F8] text-[#333333]'} font-sans relative selection:bg-[#D4AF37]/30 transition-colors duration-300`}>
      
      {/* Ambient Background Elements for Glassmorphism */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-[#064E3B]/10 rounded-full blur-[120px] mix-blend-multiply animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] bg-[#D4AF37]/15 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[30vw] h-[30vw] bg-[#10B981]/10 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-4000"></div>
      </div>

      {/* Sidebar */}
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={onNavigate} 
        onLogout={onLogout}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className={`relative z-10 transition-[margin-left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ml-0 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'} min-h-screen flex flex-col will-change-[margin-left]`}>
        
        {/* Frosted Header */}
        <header className={`h-16 lg:h-20 ${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/70 border-white/40'} backdrop-blur-md border-b px-4 lg:px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm transition-all`}>
          
          <div className="flex items-center gap-3 lg:gap-4">
             <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 ${darkMode ? 'text-gray-400 hover:text-[#D4AF37] hover:bg-gray-700' : 'text-gray-500 hover:text-[#D4AF37] hover:bg-white/50'} transition-colors rounded-lg active:scale-95`}
             >
                <AlignLeft size={24} />
             </button>

             {/* Mobile Logo (only when sidebar is closed) */}
             <div className={`lg:hidden ${sidebarOpen ? 'hidden' : 'block'}`}>
                <Logo size="sm" />
             </div>
             
             {/* Page Title */}
             <div className="flex flex-col justify-center transition-all duration-300 ease-in-out">
                <h2 className={`text-base lg:text-xl font-bold ${darkMode ? 'text-emerald-400' : 'text-[#064E3B]'} line-clamp-1 whitespace-nowrap`}>
                    {currentPage === Page.DASHBOARD ? 'DASHBOARD EKOSISTEM' : currentPage.replace(/_/g, ' ').replace('FORM', '').trim()}
                </h2>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'}`}>
                    <p className={`text-[10px] lg:text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} font-medium tracking-wide uppercase hidden sm:block whitespace-nowrap`}>
                        Kementerian Haji dan Umrah RI
                    </p>
                </div>
             </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 lg:gap-6">
            
            {/* Language Toggle */}
            <button 
                onClick={() => setIsEnglish(!isEnglish)}
                className={`relative p-2 lg:p-2.5 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-white/50 hover:bg-white text-gray-500'} rounded-xl border border-transparent hover:border-gray-200 hover:text-[#064E3B] transition-all shadow-sm group`}
                title={isEnglish ? "Switch to Indonesian" : "Switch to English"}
            >
                <Globe size={20} />
                <span className={`absolute -bottom-1 -right-1 text-[8px] font-bold ${darkMode ? 'bg-gray-800 border-gray-600 text-emerald-400' : 'bg-white border-gray-100 text-[#064E3B]'} px-1 rounded-md border shadow-sm`}>
                    {isEnglish ? 'EN' : 'ID'}
                </span>
            </button>

            {/* Dark Mode Toggle */}
            <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`relative p-2 lg:p-2.5 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-white/50 hover:bg-white text-gray-500'} rounded-xl border border-transparent hover:border-gray-200 hover:text-[#064E3B] transition-all shadow-sm`}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button className={`relative p-2 lg:p-2.5 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-white/50 hover:bg-white text-gray-500'} rounded-xl border border-transparent hover:border-gray-200 hover:text-[#064E3B] transition-all shadow-sm`}>
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className={`flex items-center gap-3 pl-3 lg:pl-4 border-l ${darkMode ? 'border-gray-700' : 'border-gray-200/60'}`}>
                <div className="text-right hidden lg:flex flex-col justify-center h-full">
                    <p className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'} leading-tight`}>{user.name}</p>
                    <p className="text-[10px] text-[#D4AF37] font-bold tracking-wider uppercase leading-tight">{user.role}</p>
                </div>
                <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-gradient-to-br from-[#064E3B] to-[#042f24] p-0.5 shadow-lg shadow-[#064E3B]/20 cursor-pointer hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-full border-2 border-white/20 overflow-hidden">
                        <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 lg:p-8 flex-1 relative">
           {children}
        </main>
        
        {/* Footer - Dark Gray as per PDF Page 6 */}
        <footer className="bg-[#1f2937]/90 backdrop-blur-md border-t border-white/10 py-6 px-4 lg:px-8 mt-auto text-white">
            <div className="flex flex-col lg:flex-row justify-between items-center text-sm text-gray-300 gap-4 text-center lg:text-left">
                <p>© 2026 Kementerian Haji dan Umrah RI. Hak Cipta Dilindungi.</p>
                <div className="flex gap-4 lg:gap-6 font-medium text-xs lg:text-sm">
                    <a href="#" className="hover:text-[#D4AF37] transition-colors">Bantuan</a>
                    <a href="#" className="hover:text-[#D4AF37] transition-colors">Kebijakan Privasi</a>
                    <a href="#" className="hover:text-[#D4AF37] transition-colors">Kontak Kami</a>
                </div>
            </div>
        </footer>
      </div>
    </div>
    </LayoutProvider>
  );
};