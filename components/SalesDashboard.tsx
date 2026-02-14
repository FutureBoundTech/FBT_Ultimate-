
import React, { useState, useEffect } from 'react';
import { Client, LeadStatus, ServiceSector, CallStatus, User } from '../types';
import { getStoredClients, updateClient, getLeadsForSalesPerson, getNextAgentForSector } from '../store';
import { Phone, CheckCircle, Clock, XCircle, UserX, UserCheck } from 'lucide-react';

interface SalesDashboardProps {
  currentUser: User;
}

export const SalesDashboard: React.FC<SalesDashboardProps> = ({ currentUser }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [myLeads, setMyLeads] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const allClients = await getStoredClients();
    setClients(allClients);
    const leads = await getLeadsForSalesPerson(currentUser.id);
    setMyLeads(leads);
    setLoading(false);
  };

  const handleFeedback = async (id: string, callStatus: CallStatus) => {
    const client = clients.find(c => c.id === id);
    if (!client) return;
    
    const updatedClient = {
      ...client,
      callStatus,
      status: callStatus === CallStatus.INTERESTED ? LeadStatus.CONTACTED : client.status,
      notes: [...client.notes, `Sales Feedback: ${callStatus}`],
      lastUpdated: new Date().toISOString()
    };
    
    setClients(clients.map(c => c.id === id ? updatedClient : c));
    await updateClient(id, updatedClient);
    await loadData();
  };

  const handleQualify = async (id: string, sector: ServiceSector) => {
    const assignedAgentId = await getNextAgentForSector(sector);
    const client = clients.find(c => c.id === id);
    if (!client) return;
    
    const updatedClient = {
      ...client,
      sector,
      assignedAgentId,
      status: LeadStatus.QUALIFIED,
      notes: [...client.notes, `Qualified for ${sector}. Circular assignment to Agent ${assignedAgentId}`],
      lastUpdated: new Date().toISOString(),
      progress: 5
    };
    
    setClients(clients.map(c => c.id === id ? updatedClient : c));
    await updateClient(id, updatedClient);
    await loadData();
    alert(`Assigned to ${sector} agent.`);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <header className="border-b border-slate-200 pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Sales Pipeline</h1>
          <p className="text-slate-500 font-medium">Viewing your unique data chunk (<span className="text-blue-600">20 Leads</span>)</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assignment Mode</div>
          <div className="text-sm font-bold text-emerald-600 flex items-center gap-1 justify-end"><UserCheck className="w-3 h-3"/> Unique Chunks Active</div>
        </div>
      </header>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500">Loading pipeline...</p>
        </div>
      ) : myLeads.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-500">No leads assigned to your chunk yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {myLeads.map(lead => (
            <div key={lead.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-slate-900">{lead.name}</h3>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${lead.callStatus === CallStatus.INTERESTED ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {lead.callStatus}
                  </span>
                </div>
                <div className="flex gap-4 text-xs font-medium text-slate-400">
                  <span><Phone className="w-3 h-3 inline mr-1 text-blue-500"/> {lead.phone}</span>
                  <span>{lead.email}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[300px]">
                <div className="flex gap-1 justify-center">
                  <button onClick={() => handleFeedback(lead.id, CallStatus.UNANSWERED)} className="p-2 bg-slate-50 text-slate-400 hover:bg-slate-100 rounded-xl" title="Unanswered"><Clock className="w-4 h-4"/></button>
                  <button onClick={() => handleFeedback(lead.id, CallStatus.NOT_CONNECTED)} className="p-2 bg-rose-50 text-rose-400 hover:bg-rose-100 rounded-xl" title="Not Connected"><UserX className="w-4 h-4"/></button>
                  <button onClick={() => handleFeedback(lead.id, CallStatus.INTERESTED)} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-xs flex items-center gap-2">
                    <CheckCircle className="w-3 h-3"/> Interested
                  </button>
                </div>

                {lead.callStatus === CallStatus.INTERESTED && lead.status !== LeadStatus.QUALIFIED && (
                  <div className="grid grid-cols-3 gap-1 p-1 bg-blue-50 rounded-xl">
                    {Object.values(ServiceSector).filter(s => s !== ServiceSector.NONE).map(s => (
                      <button key={s} onClick={() => handleQualify(lead.id, s)} className="py-1 bg-white text-blue-600 rounded-lg text-[9px] font-black shadow-sm uppercase">{s.replace('_', ' ')}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
