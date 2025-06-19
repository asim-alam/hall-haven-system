
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { mockDataService } from '../services/mockDataService';

// Components
import LoginForm from '../components/Auth/LoginForm';
import Sidebar from '../components/Layout/Sidebar';
import DashboardStats from '../components/Dashboard/DashboardStats';
import StudentManagement from '../components/Students/StudentManagement';
import RoomManagement from '../components/Rooms/RoomManagement';
import MaintenanceList from '../components/MaintenanceRequests/MaintenanceList';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setActiveSection('dashboard');
  };

  const renderContent = () => {
    if (!user) return null;

    const dashboardStats = mockDataService.getDashboardStats();

    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-gray-600">
                Here's what's happening in your hall management system
              </p>
            </div>
            <DashboardStats stats={dashboardStats} />
          </div>
        );
      
      case 'students':
        return <StudentManagement />;
      
      case 'rooms':
        return <RoomManagement />;
      
      case 'maintenance':
        return <MaintenanceList />;
      
      case 'applications':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Management</h2>
            <p className="text-gray-600">Application management module coming soon...</p>
          </div>
        );
      
      case 'finance':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Finance Management</h2>
            <p className="text-gray-600">Finance management module coming soon...</p>
          </div>
        );
      
      case 'reports':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Reports & Analytics</h2>
            <p className="text-gray-600">Reports and analytics module coming soon...</p>
          </div>
        );
      
      case 'profile':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Profile</h2>
            <p className="text-gray-600">Student profile management coming soon...</p>
          </div>
        );
      
      case 'application':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Room Application</h2>
            <p className="text-gray-600">Room application form coming soon...</p>
          </div>
        );
      
      case 'invoices':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Invoices</h2>
            <p className="text-gray-600">Invoice management for students coming soon...</p>
          </div>
        );
      
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Settings</h2>
            <p className="text-gray-600">System settings and configuration coming soon...</p>
          </div>
        );
      
      default:
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Module Under Development</h2>
            <p className="text-gray-600">This module is currently being developed...</p>
          </div>
        );
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

  if (!user) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        user={user} 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
