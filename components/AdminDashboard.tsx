
import React, { useState, useEffect } from 'react';
import { getStoredClients, getStoredUsers, setStoredUsers, setStoredClients, distributeLeadsToSales } from '../store';
import { Client, User, Role, LeadStatus, ServiceSector, CallStatus } from '../types';
import { LeadTable } from './LeadTable';
import { Users, LayoutDashboard, PlusCircle, FileUp, Trash2, TrendingUp, DollarSign } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', role: Role.SALES, sector: ServiceSector.NONE });

  useEffect(() => {
    setClients(getStoredClients());
    setUsers(getStoredUsers());
  }, []);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const createdUser: User = { ...newUser, id: `u-${Date.now()}` };
    const updatedUsers = [...users, createdUser];
    setUsers(updatedUsers);
    setStoredUsers(updatedUsers);
    setShowAddUser(false);
    setNewUser({ name: '', email: '', role: Role.SALES, sector: ServiceSector.NONE });
  };

  const handleBulkUpload = () => {
    // Expected format: Name, Email, Phone
    const lines = bulkText.trim().split('\n');
    const salesUsers = users.filter(u => u.role === Role.SALES);
    
    const newClients: Client[] = lines.map((line, idx) => {
      const [name, email, phone] = line.split(',').map(s => s.trim());
      return {
        id: `bulk-${Date.now()}-${idx}`,
        name: name || 'Unknown',
        email: email || '',
        phone: phone || '',
        password: 'password123',
        source: 'Bulk Import',
        status: LeadStatus.NEW,
        callStatus: CallStatus.PENDING,
        sector: ServiceSector.NONE,
        notes: ['Imported via bulk upload'],
        messages: [],
        lastUpdated: new Date().toISOString(),
        progress: 0
      };
    });

    const distributed = distributeLeadsToSales(newClients, salesUsers);
    const finalClients = [...distributed, ...clients];
    setClients(finalClients);
    setStoredClients(finalClients);
    setShowBulk(false);
    setBulkText('');
    alert(`Success! ${newClients.length} clients imported and distributed to ${salesUsers.length} sales persons.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Control</h1>
          <p className="text-slate-500 text-sm">Master control for client distribution and staff management.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setShowBulk(true)}
            className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <FileUp className="w-4 h-4" /> Bulk Upload
          </button>
          <button 
            onClick={() => setShowAddUser(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <PlusCircle className="w-4 h-4" /> Add Team Member
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Clients', value: clients.length, icon: <Users className="text-blue-600" />, color: 'bg-blue-50' },
          { label: 'Sales Velocity', value: 'High', icon: <TrendingUp className="text-indigo-600" />, color: 'bg-indigo-50' },
          { label: 'Active Staff', value: users.length, icon: <LayoutDashboard className="text-emerald-600" />, color: 'bg-emerald-50' },
          { label: 'Conversion', value: '24%', icon: <DollarSign className="text-amber-600" />, color: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.color}`}>{stat.icon}</div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Master Client List (All Sectors)</h2>
        <LeadTable clients={clients} />
      </div>

      {/* Bulk Upload Modal */}
      {showBulk && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-2xl font-black text-slate-900">Bulk Client Import</h3>
              <p className="text-slate-500 text-sm mt-1">Paste your data below. Format: Name, Email, Phone (One per line)</p>
            </div>
            <div className="p-8 space-y-4">
              <textarea 
                value={bulkText}
                onChange={e => setBulkText(e.target.value)}
                placeholder="Rahul Sharma, rahul@test.com, 9876543210&#10;Amit Kumar, amit@test.com, 9000000000"
                className="w-full h-64 border border-slate-200 p-4 rounded-2xl focus:ring-4 ring-blue-50 outline-none font-mono text-sm resize-none bg-slate-50"
              />
              <div className="flex gap-4">
                <button onClick={() => setShowBulk(false)} className="flex-1 py-4 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button 
                  onClick={handleBulkUpload}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-100"
                >
                  Import & Distribute
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-2xl font-black text-slate-900">New Staff Member</h3>
            </div>
            <form onSubmit={handleAddUser} className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
                <input type="text" required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 ring-blue-500 outline-none"/>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Role & Specialization</label>
                <div className="grid grid-cols-2 gap-3">
                  <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as Role})} className="w-full border border-slate-200 p-3 rounded-xl">
                    <option value={Role.SALES}>Sales</option>
                    <option value={Role.AGENT}>Agent</option>
                  </select>
                  {newUser.role === Role.AGENT && (
                    <select value={newUser.sector} onChange={e => setNewUser({...newUser, sector: e.target.value as ServiceSector})} className="w-full border border-slate-200 p-3 rounded-xl">
                      <option value={ServiceSector.IT_RETURN}>IT Returns</option>
                      <option value={ServiceSector.GST}>GST</option>
                      <option value={ServiceSector.LIC_POLICY}>LIC</option>
                    </select>
                  )}
                </div>
              </div>
              <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all mt-4">Generate Account</button>
              <button type="button" onClick={() => setShowAddUser(false)} className="w-full text-slate-400 text-sm font-bold">Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
