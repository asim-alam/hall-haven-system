
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import DashboardLive from './components/Dashboard/DashboardLive';
import StudentManagementLive from './components/Students/StudentManagementLive';
import RoomManagementLive from './components/Rooms/RoomManagementLive';
import ApplicationsLive from './components/Applications/ApplicationsLive';
import MaintenanceListLive from './components/MaintenanceRequests/MaintenanceListLive';
import { UserRole } from './types';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  // Mock current user - in a real app this would come from authentication
  const currentUser = {
    id: '1',
    email: 'admin@university.edu',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.SUPER_ADMIN,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  };

  const handleLogout = () => {
    console.log('Logout clicked');
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
      default:
        return <DashboardLive />;
    }
  };

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
