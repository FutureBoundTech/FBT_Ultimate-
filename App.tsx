
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthState, Role, User, Client } from './types';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { SalesDashboard } from './components/SalesDashboard';
import { AgentDashboard } from './components/AgentDashboard';
import { ClientDashboard } from './components/ClientDashboard';
import { getStoredUsers, getStoredClients } from './store';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('finserv_auth_v2');
    return saved ? JSON.parse(saved) : { user: null, isAuthenticated: false };
  });

  useEffect(() => {
    localStorage.setItem('finserv_auth_v2', JSON.stringify(auth));
  }, [auth]);

  const handleLogin = (email: string) => {
    // Check staff first
    const users = getStoredUsers();
    const user = users.find(u => u.email === email);
    if (user) {
      setAuth({ user, isAuthenticated: true });
      return true;
    }

    // Check clients
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

  const RoleDashboard = () => {
    if (!auth.isAuthenticated || !auth.user) return <Navigate to="/login" />;
    
    switch (auth.user.role) {
      case Role.ADMIN: return <AdminDashboard />;
      case Role.SALES: return <SalesDashboard currentUser={auth.user as User} />;
      case Role.AGENT: return <AgentDashboard currentUser={auth.user as User} />;
      case Role.CLIENT: return <ClientDashboard clientId={auth.user.id} />;
      default: return <Navigate to="/" />;
    }
  };

  return (
    <Router>
      <Layout auth={auth} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/login" 
            element={auth.isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
          />
          <Route path="/dashboard" element={<RoleDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
