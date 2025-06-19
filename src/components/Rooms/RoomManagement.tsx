
import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Eye, Building } from 'lucide-react';
import { Room, Building as BuildingType, RoomType, RoomStatus } from '../../types';
import { mockDataService } from '../../services/mockDataService';

const RoomManagement: React.FC = () => {
  const [rooms] = useState<Room[]>(mockDataService.getRooms());
  const [buildings] = useState<BuildingType[]>(mockDataService.getBuildings());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBuilding, setFilterBuilding] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<RoomStatus | 'ALL'>('ALL');
  const [filterType, setFilterType] = useState<RoomType | 'ALL'>('ALL');

  const filteredRooms = rooms.filter(room => {
    const building = buildings.find(b => b.id === room.buildingId);
    const matchesSearch = 
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBuilding = filterBuilding === 'ALL' || room.buildingId === filterBuilding;
    const matchesStatus = filterStatus === 'ALL' || room.status === filterStatus;
    const matchesType = filterType === 'ALL' || room.type === filterType;
    
    return matchesSearch && matchesBuilding && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: RoomStatus) => {
    const statusColors = {
      [RoomStatus.AVAILABLE]: 'bg-green-100 text-green-800',
      [RoomStatus.OCCUPIED]: 'bg-blue-100 text-blue-800',
      [RoomStatus.MAINTENANCE]: 'bg-red-100 text-red-800',
      [RoomStatus.RESERVED]: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status}
      </span>
    );
  };

  const getTypeBadge = (type: RoomType) => {
    const typeColors = {
      [RoomType.SINGLE]: 'bg-purple-100 text-purple-800',
      [RoomType.DOUBLE]: 'bg-indigo-100 text-indigo-800',
      [RoomType.SPECIAL_NEEDS]: 'bg-orange-100 text-orange-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[type]}`}>
        {type.replace('_', ' ')}
      </span>
    );
  };

  const getBuildingName = (buildingId: string) => {
    return buildings.find(b => b.id === buildingId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-600">Manage rooms, buildings, and occupancy</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {buildings.map((building) => {
          const buildingRooms = rooms.filter(r => r.buildingId === building.id);
          const occupiedRooms = buildingRooms.filter(r => r.status === RoomStatus.OCCUPIED).length;
          const occupancyRate = Math.round((occupiedRooms / buildingRooms.length) * 100);

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
            onChange={(e) => setFilterStatus(e.target.value as RoomStatus | 'ALL')}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Status</option>
            {Object.values(RoomStatus).map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as RoomType | 'ALL')}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Types</option>
            {Object.values(RoomType).map(type => (
              <option key={type} value={type}>
                {type.replace('_', ' ')}
              </option>
            ))}
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
              {filteredRooms.slice(0, 20).map((room) => ( // Limit display for performance
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      Room {room.roomNumber}
                    </div>
                    <div className="text-sm text-gray-500">
                      Floor {room.floor}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getBuildingName(room.buildingId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(room.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {room.currentOccupants.length}/{room.capacity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(room.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${room.monthlyFee}
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
        
        {filteredRooms.length > 20 && (
          <div className="p-4 bg-gray-50 text-center text-sm text-gray-600">
            Showing first 20 of {filteredRooms.length} rooms. Use filters to narrow down results.
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomManagement;
