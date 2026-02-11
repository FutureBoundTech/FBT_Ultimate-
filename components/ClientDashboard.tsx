
import React, { useState, useEffect } from 'react';
import { Client, Message, ServiceSector, Document } from '../types';
import { getStoredClients, setStoredClients } from '../store';
import { BRAND_NAME, SERVICES } from '../constants';
import { CheckCircle2, MessageSquare, Clock, Send, ShieldCheck, FileText, Upload, AlertCircle, FileDigit } from 'lucide-react';

interface ClientDashboardProps {
  clientId: string;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ clientId }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [msgText, setMsgText] = useState('');

  useEffect(() => {
    const clients = getStoredClients();
    setClient(clients.find(c => c.id === clientId) || null);
  }, [clientId]);

  const sendMessage = () => {
    if (!msgText.trim() || !client) return;
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: client.id,
      text: msgText,
      timestamp: new Date().toISOString()
    };
    const updatedClient = {
      ...client,
      messages: [...client.messages, newMessage],
      lastUpdated: new Date().toISOString()
    };
    const allClients = getStoredClients().map(c => c.id === clientId ? updatedClient : c);
    setStoredClients(allClients);
    setClient(updatedClient);
    setMsgText('');
  };

  const handleFileUpload = (docName: string) => {
    if (!client) return;
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: docName,
      type: 'PDF',
      status: 'PENDING',
      uploadedAt: new Date().toISOString()
    };
    const updatedClient = {
      ...client,
      documents: [...client.documents, newDoc],
      notes: [...client.notes, `Uploaded ${docName}`]
    };
    const allClients = getStoredClients().map(c => c.id === clientId ? updatedClient : c);
    setStoredClients(allClients);
    setClient(updatedClient);
  };

  if (!client) return <div>Client not found.</div>;

  const sectorInfo = SERVICES.find(s => s.id === client.sector);
  const isIT = client.sector === ServiceSector.IT_RETURN;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24 animate-in fade-in duration-700">
      <header className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/30 text-blue-200 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-blue-500/30">
              <ShieldCheck className="w-3 h-3"/> Active Service Portal
            </div>
            <h1 className="text-4xl md:text-5xl font-black">Welcome back, {client.name}</h1>
            <p className="text-slate-400 mt-2 font-medium">Your {sectorInfo?.title || 'Service'} request is being handled by Future Bound Tech experts.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 flex flex-col items-center gap-2 min-w-[240px]">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-2 shadow-xl shadow-blue-500/20">
              {sectorInfo?.icon}
            </div>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Selected Sector</span>
            <div className="text-xl font-bold">{sectorInfo?.title || 'FBT Member'}</div>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Section */}
          <section className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-blue-600"/> Filing Progress
                </h2>
                <div className="px-4 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100">
                   {client.status}
                </div>
             </div>
             
             <div className="space-y-12">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-black inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                        {client.progress}% Complete
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2.5 mb-4 text-xs flex rounded-full bg-slate-100">
                    <div style={{ width: `${client.progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-1000"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {[
                     { label: 'Onboarding', step: 1, reached: client.progress >= 5 },
                     { label: 'Documents', step: 2, reached: client.progress >= 25 },
                     { label: 'Computation', step: 3, reached: client.progress >= 60 },
                     { label: 'Final Filing', step: 4, reached: client.progress >= 90 },
                   ].map((s, i) => (
                     <div key={i} className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${s.reached ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${s.reached ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>
                           {s.step}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider">{s.label}</span>
                     </div>
                   ))}
                </div>
             </div>
          </section>

          {/* IT Specific: Document Requirements */}
          {isIT && (
            <section className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <FileDigit className="w-6 h-6 text-indigo-600"/> Required Documents
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { name: 'Form 16 / Salary Slips', id: 'f16' },
                  { name: 'Bank Statements', id: 'bank' },
                  { name: 'Investment Proofs (80C)', id: '80c' },
                  { name: 'PAN & Aadhaar Card', id: 'id_proof' },
                ].map((doc) => {
                  const isUploaded = client.documents.some(d => d.name === doc.name);
                  return (
                    <div key={doc.id} className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${isUploaded ? 'border-emerald-100 bg-emerald-50/50' : 'border-dashed border-slate-200 bg-slate-50/50'}`}>
                      <div className="flex items-center gap-3">
                        {isUploaded ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-slate-300" />}
                        <span className={`text-sm font-bold ${isUploaded ? 'text-emerald-900' : 'text-slate-500'}`}>{doc.name}</span>
                      </div>
                      {!isUploaded && (
                        <button 
                          onClick={() => handleFileUpload(doc.name)}
                          className="p-2 bg-white text-blue-600 rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                          <Upload className="w-4 h-4"/>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Notes/Activity Log */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
             <h3 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400"/> Recent Activity
             </h3>
             <div className="space-y-4">
                {client.notes.slice(-5).reverse().map((note, idx) => (
                  <div key={idx} className="flex gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                    <div className="flex-1">
                      <p className="text-slate-700 text-sm font-medium">{note}</p>
                      <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 inline-block">System Log</span>
                    </div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* Messaging Sidecar */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col h-[700px] sticky top-24">
          <div className="bg-slate-900 p-8 text-white relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/20 rounded-full blur-2xl -mr-12 -mt-12" />
            <h3 className="font-black flex items-center gap-3 text-lg">
              <MessageSquare className="w-5 h-5 text-blue-400"/> Support Desk
            </h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">Direct CA Assigned</p>
          </div>
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {client.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <MessageSquare className="w-8 h-8 text-slate-200" />
                 </div>
                 <p className="text-slate-400 text-xs font-bold leading-relaxed">Your assigned expert will respond here. Feel free to ask about your document status or filing queries.</p>
              </div>
            ) : (
              client.messages.map(m => (
                <div key={m.id} className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm leading-relaxed ${m.senderId === clientId ? 'bg-blue-600 text-white ml-auto rounded-tr-none shadow-lg shadow-blue-500/10' : 'bg-white text-slate-800 rounded-tl-none shadow-sm border border-slate-100'}`}>
                  {m.text}
                  <div className="text-[8px] mt-2 opacity-60 font-black">{new Date(m.timestamp).toLocaleTimeString()}</div>
                </div>
              ))
            )}
          </div>
          <div className="p-6 border-t border-slate-100 bg-white">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={msgText}
                onChange={e => setMsgText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-4 ring-blue-50 outline-none transition-all"
              />
              <button onClick={sendMessage} className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                <Send className="w-5 h-5"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
