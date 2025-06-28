
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

// Mock users for temporary bypass
const mockUsers: UserProfile[] = [
  {
    id: '1',
    email: 'admin@university.edu',
    firstName: 'John',
    lastName: 'Admin',
    role: 'SUPER_ADMIN' as UserRole,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'hall.admin@university.edu',
    firstName: 'Sarah',
    lastName: 'Hall',
    role: 'HALL_ADMIN' as UserRole,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    email: 'finance@university.edu',
    firstName: 'Mike',
    lastName: 'Finance',
    role: 'FINANCE_OFFICER' as UserRole,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    email: 'maintenance@university.edu',
    firstName: 'Tom',
    lastName: 'Maintenance',
    role: 'MAINTENANCE_STAFF' as UserRole,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    email: 'student@university.edu',
    firstName: 'Alice',
    lastName: 'Student',
    role: 'STUDENT' as UserRole,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    email: 'student1@gmail.com',
    firstName: 'Bob',
    lastName: 'Johnson',
    role: 'STUDENT' as UserRole,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUserSelect = (selectedUser: UserProfile) => {
    console.log('Switching to user:', selectedUser.email, 'Role:', selectedUser.role);
    setUserProfile(selectedUser);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    setUserProfile(null);
    setActiveSection('dashboard');
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

  if (!userProfile) {
    return <LoginForm onLoginSuccess={handleUserSelect} mockUsers={mockUsers} />;
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
