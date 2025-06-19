
import React, { useState } from 'react';
import { Plus, Search, Filter, Clock, User, AlertTriangle } from 'lucide-react';
import { MaintenanceRequest, MaintenanceCategory, Priority, MaintenanceStatus, UserRole } from '../../types';
import { mockDataService } from '../../services/mockDataService';
import { authService } from '../../services/authService';

const MaintenanceList: React.FC = () => {
  const [requests] = useState<MaintenanceRequest[]>(mockDataService.getMaintenanceRequests());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<MaintenanceStatus | 'ALL'>('ALL');
  const [filterPriority, setFilterPriority] = useState<Priority | 'ALL'>('ALL');
  
  const currentUser = authService.getCurrentUser();
  const isStudent = currentUser?.role === UserRole.STUDENT;
  const isMaintenanceStaff = currentUser?.role === UserRole.MAINTENANCE_STAFF;

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.roomId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'ALL' || request.status === filterStatus;
    const matchesPriority = filterPriority === 'ALL' || request.priority === filterPriority;
    
    // Filter by user role
    if (isStudent) {
      return matchesSearch && matchesStatus && matchesPriority && request.studentId === currentUser.id;
    }
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: MaintenanceStatus) => {
    const statusColors = {
      [MaintenanceStatus.SUBMITTED]: 'bg-blue-100 text-blue-800',
      [MaintenanceStatus.ASSIGNED]: 'bg-yellow-100 text-yellow-800',
      [MaintenanceStatus.IN_PROGRESS]: 'bg-purple-100 text-purple-800',
      [MaintenanceStatus.COMPLETED]: 'bg-green-100 text-green-800',
      [MaintenanceStatus.CANCELLED]: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getPriorityBadge = (priority: Priority) => {
    const priorityColors = {
      [Priority.LOW]: 'bg-gray-100 text-gray-800',
      [Priority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
      [Priority.HIGH]: 'bg-orange-100 text-orange-800',
      [Priority.URGENT]: 'bg-red-100 text-red-800'
    };

    const priorityIcons = {
      [Priority.LOW]: null,
      [Priority.MEDIUM]: null,
      [Priority.HIGH]: <AlertTriangle size={12} />,
      [Priority.URGENT]: <AlertTriangle size={12} />
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${priorityColors[priority]}`}>
        {priorityIcons[priority]}
        <span>{priority}</span>
      </span>
    );
  };

  const getCategoryIcon = (category: MaintenanceCategory) => {
    // Simple icon representation for categories
    const icons = {
      [MaintenanceCategory.ELECTRICAL]: '⚡',
      [MaintenanceCategory.PLUMBING]: '🔧',
      [MaintenanceCategory.FURNITURE]: '🪑',
      [MaintenanceCategory.CLEANING]: '🧹',
      [MaintenanceCategory.OTHER]: '📝'
    };
    return icons[category];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isStudent ? 'My Maintenance Requests' : 'Maintenance Requests'}
          </h1>
          <p className="text-gray-600">
            {isStudent 
              ? 'Track your maintenance requests and updates'
              : isMaintenanceStaff
              ? 'Manage and update maintenance tasks'
              : 'Monitor all maintenance activities'
            }
          </p>
        </div>
        {(isStudent || !isMaintenanceStaff) && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus size={20} />
            <span>New Request</span>
          </button>
        )}
      </div>

      {/* Quick Stats for Admin/Staff */}
      {!isStudent && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.values(MaintenanceStatus).map(status => {
            const count = requests.filter(r => r.status === status).length;
            return (
              <div key={status} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600">{status.replace('_', ' ')}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as MaintenanceStatus | 'ALL')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              {Object.values(MaintenanceStatus).map(status => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as Priority | 'ALL')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Priority</option>
              {Object.values(Priority).map(priority => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{getCategoryIcon(request.category)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {request.category.replace('_', ' ')} - Room {request.roomId.split('-').pop()}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Request ID: {request.id.toUpperCase()}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{request.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>Submitted: {formatDate(request.submittedAt)}</span>
                  </div>
                  {request.assignedTo && (
                    <div className="flex items-center space-x-1">
                      <User size={16} />
                      <span>Assigned to Staff</span>
                    </div>
                  )}
                  {request.completedAt && (
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>Completed: {formatDate(request.completedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                {getStatusBadge(request.status)}
                {getPriorityBadge(request.priority)}
                
                {isMaintenanceStaff && request.status !== MaintenanceStatus.COMPLETED && (
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Update Status
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No maintenance requests found</p>
            <p className="text-sm">
              {isStudent 
                ? "You haven't submitted any maintenance requests yet"
                : "No maintenance requests match your current filters"
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceList;
