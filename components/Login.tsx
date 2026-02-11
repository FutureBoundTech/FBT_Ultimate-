
import React, { useState } from 'react';
import { BRAND_NAME } from '../constants';
import { ShieldAlert, Info, ArrowRight, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => boolean;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(email);
    if (!success) {
      setError('Invalid credentials. Please verify your corporate email or use staff access.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="text-4xl font-black text-blue-600 flex items-center justify-center gap-3 mb-4 italic">
            <div className="w-14 h-14 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-slate-200">
              <span className="text-blue-500 text-3xl font-black">FB</span>
            </div>
            {BRAND_NAME}
          </div>
          <h1 className="text-2xl font-black text-slate-900">Portal Access</h1>
          <p className="text-slate-500 mt-2 font-medium">Securing the financial future of our members</p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-50 rounded-full -ml-12 -mb-12 blur-2xl opacity-50" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Email Address</label>
              <div className="relative">
                 <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-5 pr-12 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-slate-300 font-bold"
                  placeholder="Enter your registered email"
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-200" />
              </div>
            </div>
            
            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl flex items-start gap-3 text-sm border border-rose-100 animate-in shake duration-300">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span className="font-bold">{error}</span>
              </div>
            )}

            <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 group">
              Login to Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-slate-50">
            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-6">
              <Info className="w-4 h-4" /> Quick Staff Access
            </div>
            <div className="grid grid-cols-1 gap-3 text-sm">
               {[
                 { label: 'FBT Admin', email: 'admin@futurebound.tech' },
                 { label: 'Expert CA (Sarah)', email: 'sarah@fbt.com' },
                 { label: 'Sales Executive', email: 'sales1@fbt.com' }
               ].map(demo => (
                 <button 
                  key={demo.email}
                  onClick={() => onLogin(demo.email)} 
                  className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 hover:bg-blue-600 hover:text-white transition-all group border border-slate-100"
                 >
                   <span className="font-black text-slate-600 group-hover:text-white">{demo.label}</span>
                   <span className="text-xs opacity-50 group-hover:opacity-100">{demo.email}</span>
                 </button>
               ))}
            </div>
          </div>
        </div>
        
        <p className="mt-12 text-center text-slate-400 text-xs font-black uppercase tracking-widest">
          Future Bound Tech &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};
