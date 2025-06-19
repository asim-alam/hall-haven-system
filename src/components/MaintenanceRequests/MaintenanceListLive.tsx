
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Clock, User, AlertTriangle, Loader2 } from 'lucide-react';
import { supabaseService, DatabaseMaintenanceRequest } from '../../services/supabaseService';

const MaintenanceListLive: React.FC = () => {
  const [requests, setRequests] = useState<DatabaseMaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await supabaseService.getMaintenanceRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error loading maintenance requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.rooms?.room_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'ALL' || request.status === filterStatus;
    const matchesPriority = filterPriority === 'ALL' || request.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'SUBMITTED': 'bg-blue-100 text-blue-800',
      'ASSIGNED': 'bg-yellow-100 text-yellow-800',
      'IN_PROGRESS': 'bg-purple-100 text-purple-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityColors: { [key: string]: string } = {
      'LOW': 'bg-gray-100 text-gray-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'URGENT': 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${priorityColors[priority] || 'bg-gray-100 text-gray-800'}`}>
        {(priority === 'HIGH' || priority === 'URGENT') && <AlertTriangle size={12} />}
        <span>{priority}</span>
      </span>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'ELECTRICAL': '⚡',
      'PLUMBING': '🔧',
      'FURNITURE': '🪑',
      'CLEANING': '🧹',
      'OTHER': '📝'
    };
    return icons[category] || '📝';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading maintenance requests...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
          <p className="text-gray-600">Monitor all maintenance activities ({requests.length} requests)</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus size={20} />
          <span>New Request</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].map(status => {
          const count = requests.filter(r => r.status === status).length;
          return (
            <div key={status} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600">{status.replace('_', ' ')}</div>
            </div>
          );
        })}
      </div>

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
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
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
                      {request.category.replace('_', ' ')} - Room {request.rooms?.room_number}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Request ID: {request.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{request.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>Submitted: {formatDate(request.submitted_at)}</span>
                  </div>
                  {request.assigned_to && (
                    <div className="flex items-center space-x-1">
                      <User size={16} />
                      <span>Assigned to Staff</span>
                    </div>
                  )}
                  {request.completed_at && (
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>Completed: {formatDate(request.completed_at)}</span>
                    </div>
                  )}
                  {request.students && (
                    <div className="flex items-center space-x-1">
                      <User size={16} />
                      <span>Student: {request.students.first_name} {request.students.last_name}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                {getStatusBadge(request.status)}
                {getPriorityBadge(request.priority)}
                
                {request.status !== 'COMPLETED' && (
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
            <p className="text-sm">No maintenance requests match your current filters</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceListLive;
