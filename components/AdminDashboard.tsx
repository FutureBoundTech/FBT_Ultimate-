
import React, { useState, useEffect } from 'react';
import { getStoredClients, getStoredUsers, setStoredClients } from '../store';
import { Client, Role, LeadStatus, ServiceSector, CallStatus } from '../types';
import { LeadTable } from './LeadTable';
import { Users, FileUp, PlusCircle, LayoutDashboard, Search, Database } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setClients(getStoredClients());
  }, []);

  const handleBulkUpload = () => {
    const lines = bulkText.trim().split('\n');
    const newClients: Client[] = lines.map((line, idx) => {
      const [name, email, phone] = line.split(',').map(s => s.trim());
      return {
        id: `bulk-${Date.now()}-${idx}`,
        name: name || 'Unknown',
        email: email || '',
        phone: phone || '',
        password: 'password123',
        source: 'Admin Bulk Import',
        status: LeadStatus.NEW,
        callStatus: CallStatus.PENDING,
        sector: ServiceSector.NONE,
        notes: ['Imported by Admin'],
        messages: [],
        documents: [],
        lastUpdated: new Date().toISOString(),
        progress: 0
      };
    });

    const updated = [...newClients, ...clients];
    setClients(updated);
    setStoredClients(updated);
    setShowBulk(false);
    setBulkText('');
    alert(`Imported ${newClients.length} leads successfully.`);
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic">Future Bound Tech</h1>
          <p className="text-slate-500 font-medium">Master Administrator Console</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowBulk(true)}
            className="px-6 py-3 bg-white border border-slate-200 rounded-2xl flex items-center gap-2 font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
          >
            <FileUp className="w-4 h-4" /> Bulk Excel Import
          </button>
          <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl flex items-center gap-2 font-bold shadow-xl hover:bg-slate-800 transition-all">
            <PlusCircle className="w-4 h-4" /> Add Single Lead
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'System Database', value: clients.length, icon: <Database className="text-blue-600" />, sub: 'Total Clients' },
          { label: 'Active Pipeline', value: clients.filter(c => c.status === LeadStatus.IN_PROGRESS).length, icon: <LayoutDashboard className="text-indigo-600" />, sub: 'Processing' },
          { label: 'Staff Online', value: '5/5', icon: <Users className="text-emerald-600" />, sub: 'Full Coverage' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="p-4 bg-slate-50 rounded-2xl">{stat.icon}</div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</div>
              <div className="text-3xl font-black text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-500 font-medium">{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">Master Data View</h2>
          <div className="relative w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search database..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 ring-blue-500 text-sm"
            />
          </div>
        </div>
        <LeadTable clients={filteredClients} />
      </div>

      {showBulk && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10 border-b border-slate-100">
              <h3 className="text-2xl font-black text-slate-900">Bulk Ingestion</h3>
              <p className="text-slate-500 text-sm mt-1">Paste CSV/Excel data format: Name, Email, Phone</p>
            </div>
            <div className="p-10 space-y-6">
              <textarea 
                value={bulkText}
                onChange={e => setBulkText(e.target.value)}
                placeholder="Rahul, rahul@email.com, 9000000000&#10;Sneha, sneha@email.com, 8888888888"
                className="w-full h-64 bg-slate-50 border border-slate-200 p-6 rounded-2xl outline-none focus:ring-4 ring-blue-50 font-mono text-sm resize-none"
              />
              <div className="flex gap-4">
                <button onClick={() => setShowBulk(false)} className="flex-1 py-4 border border-slate-200 rounded-2xl font-bold text-slate-600">Cancel</button>
                <button onClick={handleBulkUpload} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100">Process Import</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
