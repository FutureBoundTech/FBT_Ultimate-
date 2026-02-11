
import React, { useState, useEffect } from 'react';
import { Client, ServiceSector, LeadStatus, User, Message, ITData } from '../types';
import { getStoredClients, setStoredClients } from '../store';
import { LeadTable } from './LeadTable';
import { FileDigit, MessageSquare, Send, ChevronLeft, LayoutGrid, ClipboardCheck, Calculator } from 'lucide-react';

interface AgentDashboardProps {
  currentUser: User;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({ currentUser }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [viewMode, setViewMode] = useState<'LIST' | 'WORKSPACE'>('LIST');
  const [msgText, setMsgText] = useState('');

  useEffect(() => {
    setClients(getStoredClients());
  }, []);

  const handleUpdateIT = (id: string, field: keyof ITData, value: number) => {
    const updated = clients.map(c => {
      if (c.id === id) {
        return {
          ...c,
          itData: { ...(c.itData || { incomeSalary: 0, incomeHouse: 0, incomeOther: 0, deduction80C: 0, deduction80D: 0, taxPaid: 0 }), [field]: value },
          lastUpdated: new Date().toISOString()
        };
      }
      return c;
    });
    setClients(updated);
    setStoredClients(updated);
    if (selectedClient?.id === id) setSelectedClient(updated.find(u => u.id === id) || null);
  };

  const sendMessage = (clientId: string) => {
    if (!msgText.trim()) return;
    const newMessage: Message = { id: `msg-${Date.now()}`, senderId: currentUser.id, text: msgText, timestamp: new Date().toISOString() };
    const updated = clients.map(c => c.id === clientId ? { ...c, messages: [...c.messages, newMessage] } : c);
    setClients(updated);
    setStoredClients(updated);
    if (selectedClient?.id === clientId) setSelectedClient(updated.find(u => u.id === clientId) || null);
    setMsgText('');
  };

  const myClients = clients.filter(c => c.assignedAgentId === currentUser.id && c.sector === currentUser.sector);
  const isIT = currentUser.sector === ServiceSector.IT_RETURN;

  if (viewMode === 'WORKSPACE' && selectedClient) {
    const it = selectedClient.itData || { incomeSalary: 0, incomeHouse: 0, incomeOther: 0, deduction80C: 0, deduction80D: 0, taxPaid: 0 };
    const grossIncome = it.incomeSalary + it.incomeHouse + it.incomeOther;
    const totalDeductions = it.deduction80C + it.deduction80D;
    const taxableIncome = Math.max(0, grossIncome - totalDeductions);

    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-20">
        <header className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <button onClick={() => setViewMode('LIST')} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors"><ChevronLeft className="w-5 h-5"/></button>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{selectedClient.name} <span className="text-slate-300 mx-2">|</span> Workspace</h1>
            <p className="text-slate-500 font-medium">Expert CA Review - Assessment Year 2024-25</p>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <h2 className="text-xl font-black mb-6 flex items-center gap-3"><Calculator className="w-5 h-5 text-blue-600"/> IT Computation Sheet</h2>
               <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Income Breakdown</label>
                    {['incomeSalary', 'incomeHouse', 'incomeOther'].map(f => (
                      <div key={f} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-xs font-bold text-slate-600 uppercase">{f.replace('income', '')}</span>
                        <input 
                          type="number" 
                          value={it[f as keyof ITData]} 
                          onChange={e => handleUpdateIT(selectedClient.id, f as keyof ITData, parseFloat(e.target.value) || 0)}
                          className="bg-transparent text-right font-black text-slate-900 outline-none w-24"
                        />
                      </div>
                    ))}
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Investment Deductions</label>
                    {['deduction80C', 'deduction80D'].map(f => (
                      <div key={f} className="flex justify-between items-center p-3 bg-indigo-50/30 rounded-xl border border-indigo-100">
                        <span className="text-xs font-bold text-indigo-700 uppercase">{f.replace('deduction', '')}</span>
                        <input 
                          type="number" 
                          value={it[f as keyof ITData]} 
                          onChange={e => handleUpdateIT(selectedClient.id, f as keyof ITData, parseFloat(e.target.value) || 0)}
                          className="bg-transparent text-right font-black text-indigo-900 outline-none w-24"
                        />
                      </div>
                    ))}
                 </div>
               </div>

               <div className="mt-8 p-8 bg-slate-900 rounded-[2rem] text-white flex justify-between items-center">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Taxable Income Final</div>
                    <div className="text-4xl font-black">₹{taxableIncome.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Refund/Liability</div>
                    <div className="text-2xl font-black text-emerald-400">₹0.00</div>
                  </div>
               </div>
            </section>

            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <h2 className="text-xl font-black mb-6 flex items-center gap-3"><ClipboardCheck className="w-5 h-5 text-indigo-600"/> Document Verification</h2>
               <div className="space-y-3">
                  {['Form 16', 'Bank Statement', 'PAN Card', 'Investment Proof'].map(docName => (
                    <div key={docName} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="font-bold text-slate-700">{docName}</span>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-blue-600 uppercase">View PDF</button>
                        <button className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase">Verify</button>
                      </div>
                    </div>
                  ))}
               </div>
            </section>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col h-[700px]">
            <div className="bg-slate-900 p-8 text-white"><h3 className="font-bold flex items-center gap-3">Client Chat</h3></div>
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
              {selectedClient.messages.map(m => (
                <div key={m.id} className={`max-w-[85%] p-4 rounded-2xl text-sm ${m.senderId === currentUser.id ? 'bg-slate-900 text-white ml-auto' : 'bg-white text-slate-800'}`}>{m.text}</div>
              ))}
            </div>
            <div className="p-6 bg-white border-t border-slate-100 flex gap-2">
              <input type="text" value={msgText} onChange={e => setMsgText(e.target.value)} placeholder="Type guidance..." className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 ring-blue-500"/>
              <button onClick={() => sendMessage(selectedClient.id)} className="p-3 bg-blue-600 text-white rounded-xl"><Send className="w-5 h-5"/></button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <header className="flex justify-between items-center border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Future Bound Tech</h1>
          <p className="text-slate-500 font-medium">Expert: <span className="text-blue-600 uppercase font-black tracking-widest">{currentUser.sector?.replace('_', ' ')}</span></p>
        </div>
        <div className="bg-white px-8 py-4 rounded-[2rem] shadow-sm border border-slate-100 flex gap-6 items-center">
          <div className="text-right"><div className="text-[10px] font-black text-slate-400">Assigned Leads</div><div className="text-2xl font-black text-blue-600">{myClients.length}</div></div>
          <div className="w-[1px] h-10 bg-slate-100"/>
          <div className="text-right"><div className="text-[10px] font-black text-slate-400">Assignment Mode</div><div className="text-xs font-bold text-emerald-600">Circular Logic</div></div>
        </div>
      </header>

      <LeadTable 
        clients={myClients}
        actions={(client) => (
          <button onClick={() => { setSelectedClient(client); setViewMode('WORKSPACE'); }} className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
            Open Filing Workspace <LayoutGrid className="w-3 h-3"/>
          </button>
        )}
      />
    </div>
  );
};
