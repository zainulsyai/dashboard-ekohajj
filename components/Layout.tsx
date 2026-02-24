import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Bell, AlignLeft } from 'lucide-react';
import { Page } from '../types';
import { LayoutProvider } from '../contexts/LayoutContext';
import { useUser } from '../contexts/UserContext';
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

  return (
    <LayoutProvider value={{ sidebarOpen, setSidebarOpen }}>
    <div className="min-h-screen bg-[#F0F4F8] text-[#333333] font-sans relative selection:bg-[#D4AF37]/30">
      
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
            className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className={`relative z-10 transition-[margin-left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ml-0 ${sidebarOpen ? 'md:ml-72' : 'md:ml-24'} min-h-screen flex flex-col will-change-[margin-left]`}>
        
        {/* Frosted Header */}
        <header className="h-16 md:h-20 bg-white/70 backdrop-blur-md border-b border-white/40 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm transition-all">
          
          <div className="flex items-center gap-3 md:gap-4">
             <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-500 hover:text-[#D4AF37] transition-colors rounded-lg hover:bg-white/50 active:scale-95"
             >
                <AlignLeft size={24} />
             </button>

             {/* Mobile Logo (only when sidebar is closed) */}
             <div className={`md:hidden ${sidebarOpen ? 'hidden' : 'block'}`}>
                <Logo size="sm" />
             </div>
             
             {/* Page Title */}
             <div className="flex flex-col justify-center transition-all duration-300 ease-in-out">
                <h2 className="text-base md:text-xl font-bold text-[#064E3B] line-clamp-1 whitespace-nowrap">
                    {currentPage === Page.DASHBOARD ? 'DASHBOARD EKOSISTEM' : currentPage.replace(/_/g, ' ').replace('FORM', '').trim()}
                </h2>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'}`}>
                    <p className="text-[10px] md:text-xs text-gray-400 font-medium tracking-wide uppercase hidden sm:block whitespace-nowrap">
                        Kementerian Haji dan Umrah RI
                    </p>
                </div>
             </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            
            <button className="relative p-2 md:p-2.5 bg-white/50 hover:bg-white rounded-xl border border-transparent hover:border-gray-200 text-gray-500 hover:text-[#064E3B] transition-all shadow-sm">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-3 md:pl-4 border-l border-gray-200/60">
                <div className="text-right hidden md:flex flex-col justify-center h-full">
                    <p className="text-sm font-bold text-gray-800 leading-tight">{user.name}</p>
                    <p className="text-[10px] text-[#D4AF37] font-bold tracking-wider uppercase leading-tight">{user.role}</p>
                </div>
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-[#064E3B] to-[#042f24] p-0.5 shadow-lg shadow-[#064E3B]/20 cursor-pointer hover:scale-105 transition-transform">
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
        <main className="p-4 md:p-8 flex-1 relative">
           {children}
        </main>
        
        {/* Footer - Dark Gray as per PDF Page 6 */}
        <footer className="bg-[#1f2937]/90 backdrop-blur-md border-t border-white/10 py-6 px-4 md:px-8 mt-auto text-white">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-300 gap-4 text-center md:text-left">
                <p>© 2026 Kementerian Haji dan Umrah RI. Hak Cipta Dilindungi.</p>
                <div className="flex gap-4 md:gap-6 font-medium text-xs md:text-sm">
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