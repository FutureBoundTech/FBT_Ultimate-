
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRAND_NAME } from '../constants';
import { loginUser } from '../store';
import { ShieldAlert, Key, ArrowRight, Building2, UserCog, Briefcase } from 'lucide-react';

interface EmployeeLoginProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onBack?: () => void;
}

export const EmployeeLogin: React.FC<EmployeeLoginProps> = ({ onLogin, onBack }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const success = await onLogin(email, password);
    if (!success) {
      setError('Invalid credentials. Please check your email and password.');
    }
    setLoading(false);
  };

  const fillDemo = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setError('');
    const success = await onLogin(demoEmail, demoPassword);
    if (!success) {
      setError('Demo login failed.');
    }
    setLoading(false);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div 
            className="text-4xl font-black text-white flex items-center justify-center gap-3 mb-4 italic cursor-pointer"
            onClick={handleBack}
          >
            <div className="w-14 h-14 bg-white rounded-[1.5rem] flex items-center justify-center shadow-2xl">
              <span className="text-blue-600 text-3xl font-black">FB</span>
            </div>
            {BRAND_NAME}
          </div>
          <h1 className="text-2xl font-black text-white">Employee Portal</h1>
          <p className="text-blue-300 mt-2 font-medium">Advanced access for authorized personnel</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl border border-white/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/20 rounded-full -ml-12 -mb-12 blur-2xl" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-4">Work Email</label>
              <div className="relative">
                 <input
                   type="email"
                   required
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="w-full pl-5 pr-12 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-blue-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all font-bold"
                   placeholder="your.name@futurebound.tech"
                 />
                 <UserCog className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-4">Password</label>
              <div className="relative">
                 <input
                   type="password"
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full pl-5 pr-12 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-blue-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all font-bold"
                   placeholder="••••••••"
                 />
                 <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
              </div>
            </div>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded-2xl flex items-start gap-3 text-sm">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span className="font-bold">{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-blue-900 py-5 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'} <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-white/10">
            <div className="flex items-center gap-2 text-blue-300 font-black text-[10px] uppercase tracking-widest mb-6">
              <Building2 className="w-4 h-4" /> Quick Access
            </div>
            <div className="grid grid-cols-1 gap-3 text-sm">
               {[
                 { label: 'Administrator', email: 'admin@futurebound.tech', pass: 'admin123', icon: <ShieldAlert className="w-4 h-4"/> },
                 { label: 'Sales Manager', email: 'sales1@fbt.com', pass: 'sales123', icon: <Briefcase className="w-4 h-4"/> },
                 { label: 'CA Expert (Sarah)', email: 'sarah@fbt.com', pass: 'agent123', icon: <UserCog className="w-4 h-4"/> }
               ].map(demo => (
                 <button 
                   key={demo.email}
                   onClick={() => fillDemo(demo.email, demo.pass)}
                   disabled={loading}
                   className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/20 transition-all group border border-white/10 disabled:opacity-50"
                 >
                   <div className="flex items-center gap-3">
                     <div className="text-blue-300">{demo.icon}</div>
                     <span className="font-bold text-white">{demo.label}</span>
                   </div>
                   <span className="text-xs text-blue-300/60 font-mono">{demo.pass}</span>
                 </button>
               ))}
            </div>
          </div>

          <button 
            onClick={onBack}
            className="mt-6 w-full text-center text-blue-300 text-sm font-bold hover:text-white transition-colors"
          >
            ← Back to Client Portal
          </button>
        </div>
        
        <p className="mt-12 text-center text-blue-300/40 text-xs font-black uppercase tracking-widest">
          Future Bound Tech &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};
