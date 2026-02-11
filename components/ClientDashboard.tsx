
import React, { useState, useEffect } from 'react';
import { Client, Message, ServiceSector, Document } from '../types';
import { getStoredClients, setStoredClients } from '../store';
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
    const newMessage: Message = { id: `msg-${Date.now()}`, senderId: client.id, text: msgText, timestamp: new Date().toISOString() };
    const updatedClient = { ...client, messages: [...client.messages, newMessage], lastUpdated: new Date().toISOString() };
    setStoredClients(getStoredClients().map(c => c.id === clientId ? updatedClient : c));
    setClient(updatedClient);
    setMsgText('');
  };

  const handleFileUpload = (docName: string) => {
    if (!client) return;
    const newDoc: Document = { id: `doc-${Date.now()}`, name: docName, type: 'PDF', status: 'PENDING', uploadedAt: new Date().toISOString() };
    const updatedClient = { ...client, documents: [...client.documents, newDoc], notes: [...client.notes, `Uploaded ${docName}`] };
    setStoredClients(getStoredClients().map(c => c.id === clientId ? updatedClient : c));
    setClient(updatedClient);
  };

  if (!client) return <div>Client not found.</div>;

  const isIT = client.sector === ServiceSector.IT_RETURN;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] -mr-32 -mt-32" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/30 text-blue-200 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-blue-500/30"><ShieldCheck className="w-3 h-3"/> Future Bound Tech Security</div>
          <h1 className="text-4xl md:text-5xl font-black">Hello, {client.name}</h1>
          <p className="text-slate-400 mt-2 font-medium">Your <span className="text-white font-bold">{client.sector?.replace('_', ' ')}</span> filing is currently being processed by a certified CA expert.</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3"><Clock className="w-6 h-6 text-blue-600"/> Filing Timeline</h2>
            <div className="space-y-6">
              <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden"><div className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-1000" style={{ width: `${client.progress}%` }}/></div>
              <div className="grid grid-cols-4 gap-2">
                {['ONBOARDING', 'DOCUMENTS', 'COMPUTATION', 'FILING'].map((s, i) => (
                  <div key={s} className={`text-[9px] font-black text-center tracking-widest ${client.progress >= (i+1)*25 ? 'text-blue-600' : 'text-slate-300'}`}>{s}</div>
                ))}
              </div>
            </div>
          </section>

          {isIT && (
            <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3"><FileDigit className="w-6 h-6 text-indigo-600"/> IT Document Checklist</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {['Form 16 / Salary Slips', 'Bank Statements', '80C Investment Proof', 'PAN & Aadhaar'].map(docName => {
                  const uploaded = client.documents.some(d => d.name === docName);
                  return (
                    <div key={docName} className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${uploaded ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-dashed border-slate-200'}`}>
                      <div className="flex items-center gap-3">
                        {uploaded ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-slate-300" />}
                        <span className={`text-sm font-bold ${uploaded ? 'text-emerald-900' : 'text-slate-400'}`}>{docName}</span>
                      </div>
                      {!uploaded && <button onClick={() => handleFileUpload(docName)} className="p-2 bg-white text-blue-600 rounded-xl border border-blue-100 shadow-sm"><Upload className="w-4 h-4"/></button>}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col h-[650px] sticky top-24">
          <div className="bg-slate-900 p-8 text-white"><h3 className="font-black flex items-center gap-3 text-lg"><MessageSquare className="w-5 h-5 text-blue-400"/> Expert Support</h3></div>
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {client.messages.map(m => (
              <div key={m.id} className={`max-w-[85%] p-4 rounded-2xl text-sm ${m.senderId === clientId ? 'bg-blue-600 text-white ml-auto' : 'bg-white text-slate-800 shadow-sm border border-slate-100'}`}>{m.text}</div>
            ))}
          </div>
          <div className="p-6 border-t border-slate-100 bg-white flex gap-2">
            <input type="text" value={msgText} onChange={e => setMsgText(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Message your CA expert..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none"/>
            <button onClick={sendMessage} className="p-4 bg-blue-600 text-white rounded-xl active:scale-95 transition-all"><Send className="w-5 h-5"/></button>
          </div>
        </div>
      </div>
    </div>
  );
};
