
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthState, Role, User } from './types';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { SalesDashboard } from './components/SalesDashboard';
import { AgentDashboard } from './components/AgentDashboard';
import { ClientDashboard } from './components/ClientDashboard';
import { StaffManagement } from './components/StaffManagement';
import { getStoredUsers, getStoredClients } from './store';
import { Settings, BarChart3 } from 'lucide-react';

const PlaceholderView: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
    <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-blue-600 border border-slate-100">
      {icon}
    </div>
    <div>
      <h2 className="text-3xl font-black text-slate-900">{title}</h2>
      <p className="text-slate-500 mt-2">This module is being optimized for Future Bound Tech performance.</p>
    </div>
    <button onClick={() => window.history.back()} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all">
      Go Back
    </button>
  </div>
);

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('finserv_auth_v4');
    return saved ? JSON.parse(saved) : { user: null, isAuthenticated: false };
  });

  useEffect(() => {
    localStorage.setItem('finserv_auth_v4', JSON.stringify(auth));
  }, [auth]);

  const handleLogin = (email: string) => {
    const users = getStoredUsers();
    const user = users.find(u => u.email === email);
    if (user) {
      setAuth({ user, isAuthenticated: true });
      return true;
    }

    const clients = getStoredClients();
    const client = clients.find(c => c.email === email);
    if (client) {
      setAuth({ 
        user: { id: client.id, name: client.name, email: client.email, role: Role.CLIENT }, 
        isAuthenticated: true 
      });
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
  };

  return (
    <Router>
      <Layout auth={auth} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<LandingPage onLogin={handleLogin} />} />
          <Route 
            path="/login" 
            element={auth.isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/dashboard" 
            element={
              !auth.isAuthenticated || !auth.user ? <Navigate to="/login" /> : 
              auth.user.role === Role.ADMIN ? <AdminDashboard /> :
              auth.user.role === Role.SALES ? <SalesDashboard currentUser={auth.user as User} /> :
              auth.user.role === Role.AGENT ? <AgentDashboard currentUser={auth.user as User} /> :
              <ClientDashboard clientId={auth.user.id} />
            } 
          />
          <Route path="/staff" element={<StaffManagement />} />
          <Route path="/reports" element={<PlaceholderView title="Financial Intelligence" icon={<BarChart3 className="w-12 h-12" />} />} />
          <Route path="/settings" element={<PlaceholderView title="System Settings" icon={<Settings className="w-12 h-12" />} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
