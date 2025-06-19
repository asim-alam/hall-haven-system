
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import Sidebar from './components/Layout/Sidebar';
import DashboardLive from './components/Dashboard/DashboardLive';
import StudentManagementLive from './components/Students/StudentManagementLive';
import RoomManagementLive from './components/Rooms/RoomManagementLive';
import ApplicationsLive from './components/Applications/ApplicationsLive';
import MaintenanceListLive from './components/MaintenanceRequests/MaintenanceListLive';
import FinanceManagement from './components/Finance/FinanceManagement';
import Reports from './components/Reports/Reports';
import Settings from './components/Settings/Settings';
import LoginForm from './components/Auth/LoginForm';
import { UserRole } from './types';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Mock current user for demo - in a real app this would come from the profiles table
  const currentUser = user ? {
    id: user.id,
    email: user.email || 'admin@university.edu',
    firstName: 'Demo',
    lastName: 'User',
    role: UserRole.SUPER_ADMIN,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  } : null;

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      } else {
        console.log('Logout successful');
        setUser(null);
        setSession(null);
        setActiveSection('dashboard');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardLive />;
      case 'students':
        return <StudentManagementLive />;
      case 'rooms':
        return <RoomManagementLive />;
      case 'applications':
        return <ApplicationsLive />;
      case 'maintenance':
        return <MaintenanceListLive />;
      case 'finance':
        return <FinanceManagement />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardLive />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Hall Management System...</p>
        </div>
      </div>
    );
  }

  if (!user || !currentUser) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          user={currentUser}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
