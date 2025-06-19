
import React from 'react';
import { Building, Users, FileText, Wrench, DollarSign, TrendingUp } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, subtitle }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

interface DashboardStatsProps {
  stats: {
    totalRooms: number;
    occupiedRooms: number;
    availableRooms: number;
    maintenanceRooms: number;
    pendingApplications: number;
    approvedApplications: number;
    activeMaintenanceRequests: number;
    pendingInvoices: number;
    totalRevenue: number;
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const occupancyRate = Math.round((stats.occupiedRooms / stats.totalRooms) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <StatsCard
        title="Total Rooms"
        value={stats.totalRooms}
        icon={<Building className="w-6 h-6 text-white" />}
        color="bg-blue-500"
        subtitle={`${occupancyRate}% occupied`}
      />
      
      <StatsCard
        title="Available Rooms"
        value={stats.availableRooms}
        icon={<Building className="w-6 h-6 text-white" />}
        color="bg-green-500"
      />
      
      <StatsCard
        title="Pending Applications"
        value={stats.pendingApplications}
        icon={<FileText className="w-6 h-6 text-white" />}
        color="bg-orange-500"
      />
      
      <StatsCard
        title="Maintenance Requests"
        value={stats.activeMaintenanceRequests}
        icon={<Wrench className="w-6 h-6 text-white" />}
        color="bg-red-500"
      />
      
      <StatsCard
        title="Pending Invoices"
        value={stats.pendingInvoices}
        icon={<DollarSign className="w-6 h-6 text-white" />}
        color="bg-purple-500"
      />
      
      <StatsCard
        title="Total Revenue"
        value={`$${stats.totalRevenue.toLocaleString()}`}
        icon={<TrendingUp className="w-6 h-6 text-white" />}
        color="bg-indigo-500"
        subtitle="This month"
      />
      
      <StatsCard
        title="Approved Applications"
        value={stats.approvedApplications}
        icon={<Users className="w-6 h-6 text-white" />}
        color="bg-teal-500"
      />
      
      <StatsCard
        title="Rooms in Maintenance"
        value={stats.maintenanceRooms}
        icon={<Wrench className="w-6 h-6 text-white" />}
        color="bg-gray-500"
      />
    </div>
  );
};

export default DashboardStats;
