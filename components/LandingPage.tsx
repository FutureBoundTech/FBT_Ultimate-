
import React from 'react';
import { SERVICES, BRAND_NAME, TEAM_QUALITIES } from '../constants';
import { CheckCircle, Mail, Phone, MapPin, Shield, UserCog, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="text-2xl font-black text-blue-600 flex items-center gap-2 italic cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg font-black italic">FB</span>
          </div>
          {BRAND_NAME}
        </div>
        <div className="hidden md:flex gap-10 font-bold text-slate-600 text-sm">
          <button onClick={() => scrollTo('services')} className="hover:text-blue-600 transition-colors">Services</button>
          <button onClick={() => scrollTo('about')} className="hover:text-blue-600 transition-colors">Why Us</button>
          <button onClick={() => scrollTo('contact')} className="hover:text-blue-600 transition-colors">Contact</button>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="text-slate-600 px-6 py-3 rounded-full text-sm font-black hover:text-blue-600 transition-all uppercase tracking-widest">
            Client Portal
          </Link>
          <Link 
            to="/register"
            className="bg-slate-900 text-white px-7 py-3 rounded-full text-sm font-black hover:bg-blue-600 transition-all shadow-xl hover:shadow-blue-200"
          >
            Register Now
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-24 pb-40 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-5xl aspect-square bg-blue-50/50 rounded-full blur-[120px] opacity-60" />
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 animate-fade-in">
          <CheckCircle className="w-4 h-4"/> Certified Professionals & CAs Team
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
          The <span className="text-blue-600">Future</span> of <br />Financial Compliance.
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          Future Bound Tech combines elite human expertise with a high-intelligence dashboard for your IT Returns, GST, and LIC management.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/register"
            className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-3xl text-lg font-black hover:bg-blue-700 shadow-[0_20px_40px_-15px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            Start Your Filing <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
          <Link to="/login" className="w-full sm:w-auto bg-white border-2 border-slate-100 text-slate-700 px-10 py-5 rounded-3xl text-lg font-bold hover:bg-slate-50 transition-all text-center">
            Login to Dashboard
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 max-w-7xl mx-auto border-t border-slate-50">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Our Professional Bench</h2>
          <p className="text-slate-500 max-w-2xl mx-auto mt-4 font-medium">Future Bound Tech is powered by licensed experts using the latest fintech standards.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {TEAM_QUALITIES.map((quality, i) => (
            <div key={i} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all group">
              <div className="mb-8 p-5 bg-white w-fit rounded-2xl group-hover:bg-blue-50 transition-colors shadow-sm">
                {quality.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{quality.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{quality.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="bg-slate-900 py-32 px-6 text-white overflow-hidden relative rounded-t-[4rem]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] -mr-64 -mt-64" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black tracking-tight mb-4 uppercase italic">Elite Services</h2>
            <p className="text-slate-400 font-medium">Seamless, Tech-Driven Financial Management.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {SERVICES.map((s) => (
              <div key={s.id} className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 hover:border-blue-500/50 transition-all group flex flex-col">
                <div className="mb-8 p-5 bg-blue-600/20 w-fit rounded-2xl group-hover:bg-blue-600 transition-colors">
                  {s.icon}
                </div>
                <h3 className="text-3xl font-black mb-4">{s.title}</h3>
                <p className="text-slate-400 mb-8 text-sm leading-relaxed font-medium flex-1">{s.longDescription}</p>
                <ul className="space-y-4 mb-10">
                  {s.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-300">
                      <CheckCircle className="w-5 h-5 text-blue-500" /> {f}
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/register"
                  className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 font-black transition-all text-sm uppercase tracking-widest shadow-xl shadow-blue-900/40 flex items-center justify-center gap-2"
                >
                  Request {s.title}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="bg-slate-50 rounded-[4rem] p-8 md:p-20 flex flex-col lg:flex-row gap-16 border border-slate-100 shadow-sm">
          <div className="flex-1">
            <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-8 uppercase italic">Get In Touch</h2>
            <p className="text-slate-500 mb-12 text-lg font-medium leading-relaxed">Questions about compliance or your unique tax situation? Our senior team is available for professional consultation.</p>
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md text-blue-600"><Mail className="w-7 h-7" /></div>
                <div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Electronic Mail</div>
                  <div className="text-xl font-black text-slate-900">support@futurebound.tech</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md text-indigo-600"><Phone className="w-7 h-7" /></div>
                <div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Corporate Line</div>
                  <div className="text-xl font-black text-slate-900">+91 98765 43210</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md text-emerald-600"><MapPin className="w-7 h-7" /></div>
                <div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">India Headquarters</div>
                  <div className="text-xl font-black text-slate-900">Tech Corridor, Bangalore</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16" />
            <h3 className="text-2xl font-black mb-8 relative z-10">Send Direct Inquiry</h3>
            <div className="space-y-5 relative z-10">
              <input type="text" placeholder="Your Name" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-blue-50 font-bold transition-all" />
              <input type="email" placeholder="Corporate Email" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-blue-50 font-bold transition-all" />
              <textarea placeholder="How can our CA team assist you?" rows={4} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-blue-50 font-bold transition-all resize-none" />
              <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">Submit to Experts</button>
            </div>
          </div>
        </div>
      </section>

      {/* Internal Staff Access Section */}
      <section className="bg-slate-50 py-24 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 italic uppercase">Internal Staff & Expert Access</h2>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Authorized Personnel Only &bull; Future Bound Tech Protocol</p>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 shadow-sm">
              <Shield className="w-4 h-4"/> Multi-Factor Active
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Link 
              to="/employee-login"
              className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-600/50 transition-all text-left group flex flex-col"
            >
              <div className="mb-6 p-4 bg-slate-50 text-slate-900 w-fit rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                <UserCog className="w-6 h-6"/>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Admin Terminal</h3>
              <p className="text-slate-400 text-xs font-bold leading-relaxed mb-6">Full System Control & User Management</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest group-hover:translate-x-1 transition-transform">Enter Portal &rarr;</span>
              </div>
            </Link>

            <Link 
              to="/employee-login"
              className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-600/50 transition-all text-left group flex flex-col"
            >
              <div className="mb-6 p-4 bg-slate-50 text-slate-900 w-fit rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Briefcase className="w-6 h-6"/>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Agent Workspace</h3>
              <p className="text-slate-400 text-xs font-bold leading-relaxed mb-6">Direct CA & Expert Compliance Portal</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest group-hover:translate-x-1 transition-transform">Enter Portal &rarr;</span>
              </div>
            </Link>

            <Link 
              to="/employee-login"
              className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-600/50 transition-all text-left group flex flex-col"
            >
              <div className="mb-6 p-4 bg-slate-50 text-slate-900 w-fit rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Shield className="w-6 h-6"/>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Sales Pipeline</h3>
              <p className="text-slate-400 text-xs font-bold leading-relaxed mb-6">Lead Management & Conversion Suite</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest group-hover:translate-x-1 transition-transform">Enter Portal &rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
      
      <footer className="text-center py-16 bg-white border-t border-slate-50 text-slate-400 text-sm font-bold uppercase tracking-widest">
        &copy; {new Date().getFullYear()} {BRAND_NAME} &bull; Internal System Access Available Above
      </footer>
    </div>
  );
};
