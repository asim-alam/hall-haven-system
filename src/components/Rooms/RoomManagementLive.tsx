
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Eye, Building, Loader2 } from 'lucide-react';
import { supabaseService, DatabaseRoom, DatabaseBuilding } from '../../services/supabaseService';

const RoomManagementLive: React.FC = () => {
  const [rooms, setRooms] = useState<DatabaseRoom[]>([]);
  const [buildings, setBuildings] = useState<DatabaseBuilding[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBuilding, setFilterBuilding] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [roomsData, buildingsData] = await Promise.all([
        supabaseService.getRooms(),
        supabaseService.getBuildings()
      ]);
      setRooms(roomsData);
      setBuildings(buildingsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter(room => {
    const building = room.buildings;
    const matchesSearch = 
      room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBuilding = filterBuilding === 'ALL' || room.building_id === filterBuilding;
    const matchesStatus = filterStatus === 'ALL' || room.status === filterStatus;
    const matchesType = filterType === 'ALL' || room.type === filterType;
    
    return matchesSearch && matchesBuilding && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'AVAILABLE': 'bg-green-100 text-green-800',
      'OCCUPIED': 'bg-blue-100 text-blue-800',
      'MAINTENANCE': 'bg-red-100 text-red-800',
      'RESERVED': 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeColors: { [key: string]: string } = {
      'SINGLE': 'bg-purple-100 text-purple-800',
      'DOUBLE': 'bg-indigo-100 text-indigo-800',
      'SPECIAL_NEEDS': 'bg-orange-100 text-orange-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[type] || 'bg-gray-100 text-gray-800'}`}>
        {type.replace('_', ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading rooms...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-600">Manage rooms, buildings, and occupancy ({rooms.length} rooms)</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Building size={20} />
            <span>Add Building</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus size={20} />
            <span>Add Room</span>
          </button>
        </div>
      </div>

      {/* Building Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {buildings.map((building) => {
          const buildingRooms = rooms.filter(r => r.building_id === building.id);
          const occupiedRooms = buildingRooms.filter(r => r.status === 'OCCUPIED').length;
          const occupancyRate = buildingRooms.length > 0 ? Math.round((occupiedRooms / buildingRooms.length) * 100) : 0;

          return (
            <div key={building.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{building.name}</h3>
                <Building className="text-blue-500" size={24} />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{building.address}</p>
                <div className="flex justify-between text-sm">
                  <span>Total Rooms:</span>
                  <span className="font-medium">{buildingRooms.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Occupied:</span>
                  <span className="font-medium">{occupiedRooms}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Occupancy Rate:</span>
                  <span className="font-medium">{occupancyRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${occupancyRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterBuilding}
            onChange={(e) => setFilterBuilding(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Buildings</option>
            {buildings.map(building => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="RESERVED">Reserved</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Types</option>
            <option value="SINGLE">Single</option>
            <option value="DOUBLE">Double</option>
            <option value="SPECIAL_NEEDS">Special Needs</option>
          </select>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Building
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Fee
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRooms.slice(0, 50).map((room) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      Room {room.room_number}
                    </div>
                    <div className="text-sm text-gray-500">
                      Floor {room.floor}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {room.buildings?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(room.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {room.capacity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(room.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${room.monthly_fee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-800" title="Edit">
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <Building size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No rooms found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        )}
        
        {filteredRooms.length > 50 && (
          <div className="p-4 bg-gray-50 text-center text-sm text-gray-600">
            Showing first 50 of {filteredRooms.length} rooms. Use filters to narrow down results.
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomManagementLive;
