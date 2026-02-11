
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Role, AuthState } from '../types';
import { BRAND_NAME } from '../constants';
import { LogOut, Home, Users, Briefcase, Settings, BarChart3, ShieldCheck } from 'lucide-react';

interface LayoutProps {
  auth: AuthState;
  onLogout: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ auth, onLogout, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!auth.isAuthenticated || !auth.user) {
    return <>{children}</>;
  }

  const isClient = auth.user.role === Role.CLIENT;

  const navItems = [
    { label: 'Portal Home', path: '/dashboard', icon: <Home className="w-5 h-5" />, roles: [Role.ADMIN, Role.SALES, Role.AGENT, Role.CLIENT] },
    { label: 'Team', path: '/staff', icon: <Users className="w-5 h-5" />, roles: [Role.ADMIN] },
    { label: 'Reports', path: '/reports', icon: <BarChart3 className="w-5 h-5" />, roles: [Role.ADMIN, Role.SALES] },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" />, roles: [Role.ADMIN, Role.SALES, Role.AGENT, Role.CLIENT] },
  ].filter(item => item.roles.includes(auth.user!.role));

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-slate-300 hidden lg:flex flex-col sticky top-0 h-screen shadow-2xl">
        <div className="p-10">
          <div className="text-2xl font-black text-white flex items-center gap-3 italic">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white text-lg">FB</span>
            </div>
            {BRAND_NAME}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">
              {isClient ? 'Client Security' : 'Expert Command'}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
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
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
                {auth.user.name[0]}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-black text-white truncate">{auth.user.name}</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{auth.user.role}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-rose-400 bg-rose-500/5 hover:bg-rose-500/20 transition-all border border-rose-500/20"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-100 h-20 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="lg:hidden text-xl font-black text-blue-600 italic">{BRAND_NAME}</div>
          <div className="text-slate-500 text-sm font-bold flex items-center gap-2">
            Professional Environment <span className="text-slate-300">|</span> <span className="text-slate-900">{auth.user.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
               <ShieldCheck className="w-4 h-4 text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Encrypted</span>
            </div>
          </div>
        </header>
        <div className="p-8 md:p-12 max-w-[1600px] w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
