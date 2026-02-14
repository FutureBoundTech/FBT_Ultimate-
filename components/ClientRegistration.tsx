
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRAND_NAME } from '../constants';
import { setStoredClients, getNextAgentForSector, loginUser } from '../store';
import { Client, LeadStatus, CallStatus, ServiceSector } from '../types';
import { CheckCircle, ArrowRight, Shield, User, Mail, Phone, MapPin, Briefcase, DollarSign, Key, X } from 'lucide-react';

interface ClientRegistrationProps {
  onSuccess: (user: unknown) => void;
  onBack?: () => void;
}

export const ClientRegistration: React.FC<ClientRegistrationProps> = ({ onSuccess, onBack }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    profession: '',
    annualIncome: '',
    sector: ServiceSector.IT_RETURN
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const assignedAgentId = await getNextAgentForSector(formData.sector);

    const newClient: Client = {
      id: `reg-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      address: formData.address,
      profession: formData.profession,
      annualIncome: parseFloat(formData.annualIncome) || 0,
      source: 'Website Registration',
      status: LeadStatus.NEW,
      callStatus: CallStatus.PENDING,
      sector: formData.sector,
      assignedAgentId: assignedAgentId,
      notes: [`Self-registered for ${formData.sector}`],
      messages: [],
      documents: [],
      lastUpdated: new Date().toISOString(),
      progress: 0
    };

    await setStoredClients(newClient);
    setRegSuccess(true);
    
    // Auto-login after registration
    setTimeout(async () => {
      const result = await loginUser(formData.email, formData.password);
      if (result && result.user) {
        onSuccess(result.user);
      }
    }, 1500);
    setLoading(false);
  };

  if (regSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-12 text-center animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner shadow-emerald-200">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h3 className="text-4xl font-black text-slate-900 italic uppercase mb-4">Welcome!</h3>
          <p className="text-slate-500 font-bold tracking-tight">Your account has been created successfully. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => onBack ? onBack() : navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 font-bold mb-6 transition-colors"
        >
          ← Back
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden">
          <div className="bg-slate-900 p-10 text-white text-center">
            <div className="text-3xl font-black text-blue-400 flex items-center justify-center gap-3 mb-2 italic">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <span className="text-blue-600 text-xl font-black">FB</span>
              </div>
              {BRAND_NAME}
            </div>
            <h2 className="text-2xl font-black italic">Create Your Account</h2>
            <p className="text-slate-400 mt-2">Register to access our professional finance services</p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name
                </label>
                <input 
                  type="text" required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-blue-50 font-bold" 
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email Address
                </label>
                <input 
                  type="email" required 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-blue-50 font-bold" 
                  placeholder="john@email.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Phone Number
                </label>
                <input 
                  type="tel" required 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-blue-50 font-bold" 
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest flex items-center gap-2">
                  <Key className="w-4 h-4" /> Password
                </label>
                <input 
                  type="password" required 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-blue-50 font-bold" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Address
              </label>
              <textarea 
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-blue-50 font-bold resize-none" 
                placeholder="Enter your full address"
                rows={2}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Profession
                </label>
                <select 
                  value={formData.profession}
                  onChange={e => setFormData({...formData, profession: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-blue-50 font-bold"
                >
                  <option value="">Select Profession</option>
                  <option value="Salaried">Salaried Employee</option>
                  <option value="Business">Business Owner</option>
                  <option value="Professional">Professional (Doctor, Lawyer, CA, etc.)</option>
                  <option value="Self-Employed">Self Employed</option>
                  <option value="Retired">Retired</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Annual Income (₹)
                </label>
                <input 
                  type="number" 
                  value={formData.annualIncome}
                  onChange={e => setFormData({...formData, annualIncome: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-blue-50 font-bold" 
                  placeholder="500000"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Service Required</label>
              <select 
                value={formData.sector}
                onChange={e => setFormData({...formData, sector: e.target.value as ServiceSector})}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-blue-50 font-black uppercase text-sm tracking-widest"
              >
                <option value={ServiceSector.IT_RETURN}>Income Tax Returns (CA Assisted)</option>
                <option value={ServiceSector.GST}>GST Registration & Filing</option>
                <option value={ServiceSector.LIC_POLICY}>LIC & Wealth Management</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              <Shield className="w-4 h-4" /> Secured by Future Bound Tech
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
