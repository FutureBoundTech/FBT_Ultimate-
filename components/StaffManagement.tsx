
import React, { useState, useEffect } from 'react';
import { User, Role, ServiceSector } from '../types';
import { getStoredUsers, setStoredUsers } from '../store';
import { PlusCircle, UserPlus, Mail, Shield, Briefcase, Trash2, X } from 'lucide-react';
import { Badge } from './ui/Badge';

export const StaffManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: Role.SALES,
    sector: ServiceSector.NONE
  });

  useEffect(() => {
    setUsers(getStoredUsers());
  }, []);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const createdUser: User = {
      ...newUser,
      id: `u-${Date.now()}`
    };
    const updatedUsers = [...users, createdUser];
    setUsers(updatedUsers);
    setStoredUsers(updatedUsers);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: Role.SALES, sector: ServiceSector.NONE });
  };

  const removeUser = (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      const updated = users.filter(u => u.id !== id);
      setUsers(updated);
      setStoredUsers(updated);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic">Staff Management</h1>
          <p className="text-slate-500 font-medium">Manage your elite team of CAs and Sales professionals.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-4 bg-blue-600 text-white rounded-[1.5rem] flex items-center gap-3 font-black uppercase tracking-widest text-xs hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95"
        >
          <UserPlus className="w-5 h-5" /> Add Team Member
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:bg-blue-50 transition-colors" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-blue-500 text-xl font-black shadow-lg">
                  {user.name[0]}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{user.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 font-medium text-xs">
                    <Mail className="w-3 h-3" /> {user.email}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-slate-50">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <Shield className="w-3 h-3" /> Access Role
                  </span>
                  <Badge variant={user.role === Role.ADMIN ? 'error' : user.role === Role.SALES ? 'info' : 'success'}>
                    {user.role}
                  </Badge>
                </div>
                
                {user.role === Role.AGENT && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                      <Briefcase className="w-3 h-3" /> Specialization
                    </span>
                    <span className="text-sm font-bold text-slate-700">{user.sector?.replace('_', ' ')}</span>
                  </div>
                )}
              </div>

              {user.role !== Role.ADMIN && (
                <button 
                  onClick={() => removeUser(user.id)}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-rose-500 hover:bg-rose-50 text-xs font-black uppercase tracking-widest transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" /> Revoke Access
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-3xl font-black text-slate-900 italic">New Member</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Staff Credential Creation</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><X className="w-6 h-6"/></button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Full Name</label>
                <input 
                  type="text" required 
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-blue-50 font-bold" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Professional Email</label>
                <input 
                  type="email" required 
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-blue-50 font-bold" 
                  placeholder="user@futurebound.tech"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Role</label>
                  <select 
                    value={newUser.role}
                    onChange={e => setNewUser({...newUser, role: e.target.value as Role})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-blue-50 font-black uppercase text-xs tracking-widest"
                  >
                    <option value={Role.SALES}>Sales</option>
                    <option value={Role.AGENT}>Expert Agent</option>
                  </select>
                </div>

                {newUser.role === Role.AGENT && (
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Vertical</label>
                    <select 
                      value={newUser.sector}
                      onChange={e => setNewUser({...newUser, sector: e.target.value as ServiceSector})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-blue-50 font-black uppercase text-xs tracking-widest"
                    >
                      <option value={ServiceSector.IT_RETURN}>IT Returns</option>
                      <option value={ServiceSector.GST}>GST Filing</option>
                      <option value={ServiceSector.LIC_POLICY}>LIC / Insurance</option>
                    </select>
                  </div>
                )}
              </div>

              <button className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95">
                Generate Access
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
