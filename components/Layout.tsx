import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Role, AuthState } from '../types';
import { BRAND_NAME } from '../constants';
import { LogOut, Home, Users, Settings, BarChart3, ShieldCheck, Menu, X } from 'lucide-react';

interface LayoutProps {
  auth: AuthState;
  onLogout: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ auth, onLogout, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!auth.isAuthenticated || !auth.user) {
    return <>{children}</>;
  }

  // Safely get user role, default to CLIENT if not set
  // Handle both string 'CLIENT' and enum Role.CLIENT
  const userRole = auth.user.role as string || 'CLIENT';
  const isClient = userRole === 'CLIENT' || userRole === Role.CLIENT;

  const navItems = [
    { label: 'Portal Home', path: '/dashboard', icon: <Home className="w-5 h-5" />, roles: ['ADMIN', 'SALES', 'AGENT', 'CLIENT'] },
    { label: 'Team', path: '/staff', icon: <Users className="w-5 h-5" />, roles: ['ADMIN'] },
    { label: 'Reports', path: '/reports', icon: <BarChart3 className="w-5 h-5" />, roles: ['ADMIN', 'SALES'] },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" />, roles: ['ADMIN', 'SALES', 'AGENT', 'CLIENT'] },
  ].filter(item => item.roles.includes(userRole));

  // Safely get user name initial
  const userInitial = auth.user.name ? auth.user.name[0].toUpperCase() : 'U';

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    setSidebarOpen(false);
    onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Close button for mobile */}
        <button 
          className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-10">
          <div className="text-2xl font-black text-white flex items-center gap-3 italic cursor-pointer" onClick={() => handleNavigation('/')}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white text-lg">FB</span>
            </div>
            {BRAND_NAME}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">
              {isClient ? 'Secure Portal' : 'Expert System'}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] font-bold transition-all ${
                location.pathname === item.path 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 translate-x-1' 
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-8 mt-auto">
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20 shrink-0">
                {userInitial}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-black text-white truncate">{auth.user.name || 'User'}</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{userRole}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-rose-400 bg-rose-500/5 hover:bg-rose-500/20 transition-all border border-rose-500/20"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 h-20 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <div className="text-xl font-black text-blue-600 italic hidden sm:block">{BRAND_NAME}</div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-slate-500 text-sm font-bold">
            <span className="text-slate-300">Section:</span> 
            <span className="text-slate-900">
              {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
               <ShieldCheck className="w-4 h-4 text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 hidden sm:inline">Professional Security</span>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-12 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
