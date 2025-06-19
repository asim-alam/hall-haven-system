
import React from 'react';
import { User, UserRole } from '../../types';
import { Home, Users, Building, FileText, Wrench, DollarSign, BarChart3, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  user: User;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activeSection, onSectionChange, onLogout }) => {
  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home }
    ];

    switch (user.role) {
      case UserRole.SUPER_ADMIN:
      case UserRole.HALL_ADMIN:
        return [
          ...baseItems,
          { id: 'students', label: 'Students', icon: Users },
          { id: 'rooms', label: 'Rooms & Buildings', icon: Building },
          { id: 'applications', label: 'Applications', icon: FileText },
          { id: 'maintenance', label: 'Maintenance', icon: Wrench },
          { id: 'finance', label: 'Finance', icon: DollarSign },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
      
      case UserRole.FINANCE_OFFICER:
        return [
          ...baseItems,
          { id: 'students', label: 'Students', icon: Users },
          { id: 'finance', label: 'Finance', icon: DollarSign },
          { id: 'reports', label: 'Financial Reports', icon: BarChart3 }
        ];
      
      case UserRole.MAINTENANCE_STAFF:
        return [
          ...baseItems,
          { id: 'maintenance', label: 'Maintenance Tasks', icon: Wrench },
          { id: 'rooms', label: 'Room Status', icon: Building }
        ];
      
      case UserRole.STUDENT:
        return [
          ...baseItems,
          { id: 'profile', label: 'My Profile', icon: Users },
          { id: 'application', label: 'Room Application', icon: FileText },
          { id: 'maintenance', label: 'Maintenance Requests', icon: Wrench },
          { id: 'invoices', label: 'My Invoices', icon: DollarSign }
        ];
      
      case UserRole.REPORT_VIEWER:
        return [
          ...baseItems,
          { id: 'reports', label: 'Reports', icon: BarChart3 }
        ];
      
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="bg-white h-screen w-64 shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">HMS</h1>
        <p className="text-sm text-gray-600">Hall Management</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div>
            <p className="font-medium text-gray-800">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-gray-500">{user.role.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
