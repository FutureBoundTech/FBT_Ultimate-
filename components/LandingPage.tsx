
import React, { useState } from 'react';
import { SERVICES, BRAND_NAME, TEAM_QUALITIES } from '../constants';
import { ChevronRight, ArrowRight, CheckCircle, Mail, Phone, MapPin, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getStoredClients, setStoredClients, getStoredUsers, getNextAgentForSector } from '../store';
import { Client, LeadStatus, CallStatus, ServiceSector } from '../types';

export const LandingPage: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', sector: ServiceSector.IT_RETURN });
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const clients = getStoredClients();
    const users = getStoredUsers();
    
    // Auto-qualify self-registered users directly to agents
    const assignedAgentId = getNextAgentForSector(formData.sector, clients, users);
    
    const newClient: Client = {
      id: `reg-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: 'password123',
      source: 'Direct Registration',
      status: LeadStatus.QUALIFIED,
      callStatus: CallStatus.INTERESTED,
      sector: formData.sector,
      assignedAgentId: assignedAgentId,
      notes: [`Self-registered for ${formData.sector}`],
      messages: [],
      documents: [],
      lastUpdated: new Date().toISOString(),
      progress: 5
    };

    setStoredClients([...clients, newClient]);
    setRegSuccess(true);
    setTimeout(() => {
      setShowRegister(false);
      setRegSuccess(false);
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto border-b border-slate-100">
        <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg font-black italic">FB</span>
          </div>
          {BRAND_NAME}
        </div>
        <div className="hidden md:flex gap-8 font-medium text-slate-600">
          <a href="#services" className="hover:text-blue-600">Services</a>
          <a href="#about" className="hover:text-blue-600">Why Us</a>
          <a href="#contact" className="hover:text-blue-600">Contact</a>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="text-slate-600 px-5 py-2.5 rounded-full text-sm font-semibold hover:text-blue-600 transition-all">
            Login
          </Link>
          <button 
            onClick={() => setShowRegister(true)}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg"
          >
            Register Now
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-20 pb-32 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-4xl aspect-square bg-blue-50/50 rounded-full blur-3xl opacity-50" />
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold mb-8 animate-bounce">
          <CheckCircle className="w-4 h-4"/> Certified Professionals & CAs
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          Scale Your <span className="text-blue-600">Financial</span> <br />Future with Tech.
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
          Future Bound Tech combines professional expertise with modern management to handle your IT Returns, GST, and Insurance needs.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => setShowRegister(true)}
            className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2"
          >
            Start Your Filing <ArrowRight className="w-5 h-5" />
          </button>
          <a href="#services" className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 transition-all text-center">
            Explore Services
          </a>
        </div>
      </section>

      {/* About Section - Team Qualities */}
      <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Empowered by Professional Experts</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Our team consists of certified Chartered Accountants and finance specialists dedicated to your growth.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {TEAM_QUALITIES.map((quality, i) => (
            <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
              <div className="mb-6 p-4 bg-white w-fit rounded-2xl group-hover:bg-blue-50 transition-colors shadow-sm">
                {quality.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{quality.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{quality.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="bg-slate-900 py-24 px-6 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Core Financial Services</h2>
            <p className="text-slate-400">Streamlined solutions for modern individuals and businesses.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {SERVICES.map((s) => (
              <div key={s.id} className="bg-white/5 backdrop-blur-lg p-8 rounded-[2.5rem] border border-white/10 hover:border-blue-500/50 transition-all group">
                <div className="mb-6 p-4 bg-blue-600/20 w-fit rounded-2xl group-hover:bg-blue-600 transition-colors">
                  {s.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
                <p className="text-slate-400 mb-6 text-sm leading-relaxed">{s.longDescription}</p>
                <ul className="space-y-3 mb-8">
                  {s.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                      <CheckCircle className="w-4 h-4 text-blue-500" /> {f}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => setShowRegister(true)}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold transition-all text-sm"
                >
                  Select Service
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="bg-slate-50 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row gap-12 border border-slate-100 shadow-sm">
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Get In Touch</h2>
            <p className="text-slate-500 mb-10 leading-relaxed">Have a specific question? Our compliance team is here to provide clarity on your tax and insurance matters.</p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600"><Mail /></div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Us</div>
                  <div className="font-bold text-slate-900">support@futurebound.tech</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600"><Phone /></div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Call Center</div>
                  <div className="font-bold text-slate-900">+91 98765 43210</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-600"><MapPin /></div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Corporate HQ</div>
                  <div className="font-bold text-slate-900">Tech Park, Bangalore, India</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <h3 className="text-xl font-bold mb-6">Send Message</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 ring-blue-500" />
              <input type="email" placeholder="Email Address" className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 ring-blue-500" />
              <textarea placeholder="How can we help?" rows={4} className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 ring-blue-500 resize-none" />
              <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">Submit Inquiry</button>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="text-center py-12 border-t border-slate-100 text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
      </footer>

      {/* Registration Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
            {regSuccess ? (
              <div className="p-16 text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black text-slate-900">Registered!</h3>
                <p className="text-slate-500 font-medium italic">Redirecting you to your professional dashboard...</p>
              </div>
            ) : (
              <>
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="text-2xl font-black text-slate-900">Join Future Bound Tech</h3>
                  <button onClick={() => setShowRegister(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5"/></button>
                </div>
                <form onSubmit={handleRegister} className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2 tracking-widest">Full Name</label>
                      <input 
                        type="text" required value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2 tracking-widest">Phone Number</label>
                      <input 
                        type="tel" required value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-blue-500" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2 tracking-widest">Email Address</label>
                    <input 
                      type="email" required value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2 tracking-widest">Requested Service</label>
                    <select 
                      value={formData.sector}
                      onChange={e => setFormData({...formData, sector: e.target.value as ServiceSector})}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-blue-500 font-bold"
                    >
                      <option value={ServiceSector.IT_RETURN}>Income Tax Return Filing</option>
                      <option value={ServiceSector.GST}>GST Registration & Compliance</option>
                      <option value={ServiceSector.LIC_POLICY}>LIC Policy Management</option>
                    </select>
                  </div>
                  <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 group">
                    Confirm Service Request <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                  </button>
                  <p className="text-center text-xs text-slate-400">By registering, you agree to our Terms of Service and Privacy Policy.</p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
