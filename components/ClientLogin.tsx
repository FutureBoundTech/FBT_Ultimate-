
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRAND_NAME } from '../constants';
import { loginUser } from '../store';
import { ShieldAlert, Key, ArrowRight, User, UserPlus } from 'lucide-react';

interface ClientLoginProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onRegister?: () => void;
}

export const ClientLogin: React.FC<ClientLoginProps> = ({ onLogin, onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const success = await onLogin(email, password);
    if (!success) {
      setError('Invalid email or password. Please check your credentials.');
    }
    setLoading(false);
  };

  const handleRegister = () => {
    if (onRegister) {
      onRegister();
    } else {
      navigate('/register');
    }
  };

  const handleEmployeeLogin = () => {
    navigate('/employee-login');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div 
            className="text-4xl font-black text-blue-600 flex items-center justify-center gap-3 mb-4 italic cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-14 h-14 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-slate-200">
              <span className="text-blue-500 text-3xl font-black">FB</span>
            </div>
            {BRAND_NAME}
          </div>
          <h1 className="text-2xl font-black text-slate-900">Client Portal</h1>
          <p className="text-slate-500 mt-2 font-medium">Secure access to your financial dashboard</p>
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
                 <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-200" />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Password</label>
              <div className="relative">
                 <input
                   type="password"
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full pl-5 pr-12 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-slate-300 font-bold"
                   placeholder="Enter your password"
                 />
                 <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-200" />
              </div>
            </div>
            
            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl flex items-start gap-3 text-sm border border-rose-100 animate-in shake duration-300">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span className="font-bold">{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login to Dashboard'} <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="text-center">
              <p className="text-slate-400 text-sm font-medium mb-4">New to Future Bound Tech?</p>
              <button 
                onClick={handleRegister}
                className="w-full py-4 bg-blue-50 text-blue-600 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" /> Create New Account
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <button 
              onClick={handleEmployeeLogin}
              className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-blue-600 text-sm font-bold transition-colors"
            >
              <ShieldAlert className="w-4 h-4" /> Employee/Admin Login
            </button>
          </div>
        </div>
        
        <p className="mt-12 text-center text-slate-400 text-xs font-black uppercase tracking-widest">
          Future Bound Tech &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};
