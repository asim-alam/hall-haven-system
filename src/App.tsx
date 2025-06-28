
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

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        role: data.role as UserRole,
        isActive: data.is_active,
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setUserProfile(profile);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUserProfile(profile);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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
        setUserProfile(null);
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

  if (!user || !userProfile) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          user={userProfile}
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
