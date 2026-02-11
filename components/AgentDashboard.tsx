
import React, { useState, useEffect } from 'react';
import { Client, ServiceSector, LeadStatus, User, Message } from '../types';
import { getStoredClients, setStoredClients } from '../store';
import { SERVICES } from '../constants';
import { LeadTable } from './LeadTable';
import { ChevronLeft, Info, FileCheck, XCircle, MessageSquare, Send, LayoutGrid, FileDigit, ClipboardCheck } from 'lucide-react';

interface AgentDashboardProps {
  currentUser: User;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({ currentUser }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [msgText, setMsgText] = useState('');
  const [viewMode, setViewMode] = useState<'LIST' | 'WORKSPACE'>('LIST');

  useEffect(() => {
    setClients(getStoredClients());
  }, []);

  const handleUpdateProgress = (id: string, amount: number) => {
    const updated = clients.map(c => {
      if (c.id === id) {
        const nextProgress = Math.min(100, Math.max(0, c.progress + amount));
        let nextStatus = c.status;
        if (nextProgress > 0) nextStatus = LeadStatus.IN_PROGRESS;
        if (nextProgress === 100) nextStatus = LeadStatus.COMPLETED;
        
        return {
          ...c,
          progress: nextProgress,
          status: nextStatus,
          lastUpdated: new Date().toISOString(),
          notes: [...c.notes, `Agent ${currentUser.name} updated progress to ${nextProgress}%`]
        };
      }
      return c;
    });
    setClients(updated);
    setStoredClients(updated);
    if (selectedClient?.id === id) {
      setSelectedClient(updated.find(u => u.id === id) || null);
    }
  };

  const sendMessage = (clientId: string) => {
    if (!msgText.trim()) return;
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text: msgText,
      timestamp: new Date().toISOString()
    };
    const updated = clients.map(c => {
      if (c.id === clientId) {
        return { ...c, messages: [...c.messages, newMessage] };
      }
      return c;
    });
    setClients(updated);
    setStoredClients(updated);
    if (selectedClient?.id === clientId) {
      setSelectedClient(updated.find(u => u.id === clientId) || null);
    }
    setMsgText('');
  };

  const myClients = clients.filter(c => c.assignedAgentId === currentUser.id && c.sector === currentUser.sector);
  const isITAgent = currentUser.sector === ServiceSector.IT_RETURN;

  if (viewMode === 'WORKSPACE' && selectedClient) {
    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-20">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setViewMode('LIST'); setSelectedClient(null); }}
              className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900">{selectedClient.name} - Workspace</h1>
              <p className="text-slate-500 text-sm font-medium">Processing {selectedClient.sector} for Client #{selectedClient.id.slice(-4)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all">
              Mark Completed
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              {/* IT Return Specific Filing Format */}
              {isITAgent && (
                <section className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm">
                   <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                      <FileDigit className="w-6 h-6 text-blue-600"/> IT Computation Workspace
                   </h2>
                   
                   <div className="grid grid-cols-2 gap-8 mb-10">
                      <div className="space-y-4">
                         <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Income Sources</h3>
                         <div className="space-y-2">
                            {['Salary Income', 'House Property', 'Business/Profession', 'Capital Gains'].map(s => (
                              <div key={s} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                 <span className="text-sm font-bold text-slate-600">{s}</span>
                                 <span className="text-sm font-black text-slate-900">₹0.00</span>
                              </div>
                            ))}
                         </div>
                      </div>
                      <div className="space-y-4">
                         <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Deductions (80C, 80D...)</h3>
                         <div className="space-y-2">
                            {['Section 80C', 'Section 80D', 'Section 80G', 'Standard Deduction'].map(s => (
                              <div key={s} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                 <span className="text-sm font-bold text-slate-600">{s}</span>
                                 <span className="text-sm font-black text-emerald-600">₹0.00</span>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="p-6 bg-slate-900 rounded-[2rem] text-white flex justify-between items-center">
                      <div>
                         <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Tax Liability Est.</div>
                         <div className="text-3xl font-black">₹0.00</div>
                      </div>
                      <button className="px-6 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-700 transition-all">Recalculate</button>
                   </div>
                </section>
              )}

              {/* Documents Review */}
              <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                 <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <ClipboardCheck className="w-6 h-6 text-indigo-600"/> Document Audit
                 </h2>
                 <div className="space-y-4">
                    {selectedClient.documents.length === 0 ? (
                      <div className="p-12 text-center text-slate-400 italic bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                         No documents uploaded by client yet.
                      </div>
                    ) : (
                      selectedClient.documents.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                           <div className="flex items-center gap-3">
                              <FileCheck className="w-5 h-5 text-emerald-500" />
                              <span className="text-sm font-bold text-slate-700">{doc.name}</span>
                           </div>
                           <div className="flex gap-2">
                              <button className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-bold text-blue-600">View</button>
                              <button className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-bold text-emerald-600">Verify</button>
                           </div>
                        </div>
                      ))
                    )}
                 </div>
              </section>
           </div>

           {/* Communication Panel */}
           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col h-[700px]">
              <div className="bg-slate-900 p-8 text-white">
                <h3 className="font-bold flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-400"/> Client Consultation
                </h3>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
                {selectedClient.messages.map(m => (
                  <div key={m.id} className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm ${m.senderId === currentUser.id ? 'bg-slate-900 text-white ml-auto rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none shadow-sm'}`}>
                    {m.text}
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-slate-100 bg-white">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={msgText}
                    onChange={e => setMsgText(e.target.value)}
                    placeholder="Provide guidance to client..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-4 ring-blue-50 outline-none"
                  />
                  <button onClick={() => sendMessage(selectedClient.id)} className="p-4 bg-blue-600 text-white rounded-2xl">
                    <Send className="w-5 h-5"/>
                  </button>
                </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic">Future Bound Tech</h1>
          <p className="text-slate-500 text-sm font-medium">Expert Workspace: <span className="text-blue-600 font-bold uppercase tracking-widest">{currentUser.sector?.replace('_', ' ')}</span></p>
        </div>
        <div className="bg-white px-8 py-4 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6">
           <div className="text-right">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Cases</div>
              <div className="text-2xl font-black text-blue-600">{myClients.length}</div>
           </div>
           <div className="w-[1px] h-10 bg-slate-100"/>
           <div className="text-right">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Success rate</div>
              <div className="text-2xl font-black text-emerald-600">98%</div>
           </div>
        </div>
      </header>

      <div className="flex items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
         <Info className="w-5 h-5 text-blue-600 shrink-0" />
         <p className="text-sm font-medium text-slate-600">
           Select a client below to enter their specialized filing workspace and manage documentation.
         </p>
      </div>

      <LeadTable 
        clients={myClients}
        actions={(client) => (
          <div className="flex items-center justify-end gap-3">
             <button 
                onClick={() => { setSelectedClient(client); setViewMode('WORKSPACE'); }}
                className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                Open Workspace <LayoutGrid className="w-3 h-3"/>
              </button>
          </div>
        )}
      />
    </div>
  );
};
