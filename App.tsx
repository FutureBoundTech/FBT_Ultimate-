
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthState, Role, User } from './types';
import { LandingPage } from './components/LandingPage';
import { ClientLogin } from './components/ClientLogin';
import { ClientRegistration } from './components/ClientRegistration';
import { EmployeeLogin } from './components/EmployeeLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { SalesDashboard } from './components/SalesDashboard';
import { AgentDashboard } from './components/AgentDashboard';
import { ClientDashboard } from './components/ClientDashboard';
import { Layout } from './components/Layout';
import { StaffManagement } from './components/StaffManagement';
import { loginUser, seedDatabase } from './store';
import { Settings, BarChart3 } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';

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
  // Load auth from localStorage on initial mount
  const [auth, setAuth] = useState<AuthState>(() => {
    try {
      const stored = localStorage.getItem('finserv_auth_v4');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load auth from localStorage:', e);
    }
    return { user: null, isAuthenticated: false };
  });

  useEffect(() => {
    localStorage.setItem('finserv_auth_v4', JSON.stringify(auth));
  }, [auth]);

  // Seed database on first load
  useEffect(() => {
    seedDatabase();
  }, []);

  const handleClientLogin = async (email: string, password: string) => {
    const result = await loginUser(email, password);
    if (result && result.type === 'client') {
      setAuth({ user: result.user, isAuthenticated: true });
      return true;
    }
    return false;
  };

  const handleEmployeeLogin = async (email: string, password: string) => {
    const result = await loginUser(email, password);
    if (result && result.type === 'staff') {
      setAuth({ user: result.user, isAuthenticated: true });
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
  };

  // If authenticated, redirect to dashboard
  if (auth.isAuthenticated && auth.user) {
    // Handle both string 'CLIENT' and enum Role.CLIENT
    const userRole = (auth.user.role as string) || 'CLIENT';
    const userId = auth.user.id;
    
    // Safety check - if user has no id, redirect to login
    if (!userId) {
      setAuth({ user: null, isAuthenticated: false });
      return (
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      );
    }
    
    // Default dashboard based on role
    const DefaultDashboard = userRole === 'ADMIN' ? (
      <AdminDashboard />
    ) : userRole === 'SALES' ? (
      <SalesDashboard currentUser={auth.user as User} />
    ) : userRole === 'AGENT' ? (
      <AgentDashboard currentUser={auth.user as User} />
    ) : (
      <ClientDashboard clientId={userId} />
    );
    
    return (
      <Router>
        <ErrorBoundary>
          <Layout auth={auth} onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={DefaultDashboard} />
              <Route path="/dashboard" element={DefaultDashboard} />
              <Route path="/staff" element={<StaffManagement />} />
              <Route path="/reports" element={<PlaceholderView title="Financial Intelligence" icon={<BarChart3 className="w-12 h-12" />} />} />
              <Route path="/settings" element={<PlaceholderView title="System Settings" icon={<Settings className="w-12 h-12" />} />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Layout>
        </ErrorBoundary>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Client Login */}
        <Route 
          path="/login" 
          element={<ClientLogin onLogin={handleClientLogin} />} 
        />
        
        {/* Client Registration */}
        <Route 
          path="/register" 
          element={<ClientRegistration onSuccess={(user) => {
            if (user) {
              setAuth({ user: user as User, isAuthenticated: true });
            }
          }} />} 
        />
        
        {/* Employee Login */}
        <Route 
          path="/employee-login" 
          element={<EmployeeLogin onLogin={handleEmployeeLogin} />} 
        />
        
        {/* Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={<AdminDashboard />} 
        />
        
        {/* Other Routes */}
        <Route path="/staff" element={<StaffManagement />} />
        <Route path="/reports" element={<PlaceholderView title="Financial Intelligence" icon={<BarChart3 className="w-12 h-12" />} />} />
        <Route path="/settings" element={<PlaceholderView title="System Settings" icon={<Settings className="w-12 h-12" />} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
