
import React, { useState, useEffect } from 'react';
import { Client, LeadStatus, ServiceSector, CallStatus, User } from '../types';
import { getStoredClients, setStoredClients, getStoredUsers, getNextAgentForSector } from '../store';
import { LeadTable } from './LeadTable';
import { Phone, CheckCircle, Clock, XCircle, MessageSquare } from 'lucide-react';

interface SalesDashboardProps {
  currentUser: User;
}

export const SalesDashboard: React.FC<SalesDashboardProps> = ({ currentUser }) => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    setClients(getStoredClients());
  }, []);

  const handleCallFeedback = (id: string, callStatus: CallStatus) => {
    const updated = clients.map(c => {
      if (c.id === id) {
        return {
          ...c,
          callStatus,
          status: callStatus === CallStatus.INTERESTED ? LeadStatus.CONTACTED : c.status,
          lastUpdated: new Date().toISOString(),
          notes: [...c.notes, `Call Status updated to: ${callStatus}`]
        };
      }
      return c;
    });
    setClients(updated);
    setStoredClients(updated);
  };

  const handleQualify = (id: string, sector: ServiceSector) => {
    const users = getStoredUsers();
    const assignedAgentId = getNextAgentForSector(sector, clients, users);

    const updated = clients.map(c => {
      if (c.id === id) {
        return {
          ...c,
          sector,
          assignedAgentId,
          status: LeadStatus.QUALIFIED,
          progress: 5,
          lastUpdated: new Date().toISOString(),
          notes: [...c.notes, `Qualified for ${sector}. Assigned to Agent ${assignedAgentId}`]
        };
      }
      return c;
    });
    setClients(updated);
    setStoredClients(updated);
    alert(`Success! Lead qualified and assigned to Agent in ${sector} sector.`);
  };

  // Exclusive View: Only leads assigned to this specific sales person
  const myClients = clients.filter(c => c.assignedSalesId === currentUser.id);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Your Lead Pipeline</h1>
          <p className="text-slate-500 text-sm">You are currently managing <span className="text-blue-600 font-bold">{myClients.length}</span> unique prospects.</p>
        </div>
      </header>

      <div className="grid gap-6">
        {myClients.map(client => (
          <div key={client.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-slate-900">{client.name}</h3>
                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                  client.callStatus === CallStatus.INTERESTED ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {client.callStatus}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-2"><Phone className="w-3 h-3"/> {client.phone}</div>
                <div className="flex items-center gap-2 font-medium text-slate-400">{client.email}</div>
                <div className="col-span-2 mt-2 p-3 bg-slate-50 rounded-xl text-xs italic">
                  Last Update: {new Date(client.lastUpdated).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-3">
              <div className="flex gap-2">
                <button onClick={() => handleCallFeedback(client.id, CallStatus.UNANSWERED)} className="p-2 bg-slate-50 hover:bg-slate-200 rounded-xl text-slate-400" title="Unanswered"><Clock className="w-5 h-5"/></button>
                <button onClick={() => handleCallFeedback(client.id, CallStatus.NOT_CONNECTED)} className="p-2 bg-rose-50 hover:bg-rose-100 rounded-xl text-rose-400" title="Not Connected"><XCircle className="w-5 h-5"/></button>
                <button onClick={() => handleCallFeedback(client.id, CallStatus.INTERESTED)} className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-emerald-600 font-bold text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4"/> Interested
                </button>
              </div>

              {client.callStatus === CallStatus.INTERESTED && client.status !== LeadStatus.QUALIFIED && (
                <div className="flex gap-2 p-2 bg-blue-50 rounded-2xl">
                  <button onClick={() => handleQualify(client.id, ServiceSector.IT_RETURN)} className="flex-1 py-1.5 bg-white text-blue-600 rounded-lg text-[10px] font-bold shadow-sm">IT RETURN</button>
                  <button onClick={() => handleQualify(client.id, ServiceSector.GST)} className="flex-1 py-1.5 bg-white text-blue-600 rounded-lg text-[10px] font-bold shadow-sm">GST</button>
                  <button onClick={() => handleQualify(client.id, ServiceSector.LIC_POLICY)} className="flex-1 py-1.5 bg-white text-blue-600 rounded-lg text-[10px] font-bold shadow-sm">LIC</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {myClients.length === 0 && (
          <div className="text-center py-20 bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-200">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No leads assigned to you yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
