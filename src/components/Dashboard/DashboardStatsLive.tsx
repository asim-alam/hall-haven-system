
import React, { useState, useEffect } from 'react';
import { Building, Users, FileText, Wrench, DollarSign, TrendingUp, Loader2 } from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, subtitle, loading }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {loading ? (
          <div className="flex items-center mt-1">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        )}
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const DashboardStatsLive: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await supabaseService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const occupancyRate = stats ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <StatsCard
        title="Total Rooms"
        value={stats?.totalRooms || 0}
        icon={<Building className="w-6 h-6 text-white" />}
        color="bg-blue-500"
        subtitle={`${occupancyRate}% occupied`}
        loading={loading}
      />
      
      <StatsCard
        title="Available Rooms"
        value={stats?.availableRooms || 0}
        icon={<Building className="w-6 h-6 text-white" />}
        color="bg-green-500"
        loading={loading}
      />
      
      <StatsCard
        title="Pending Applications"
        value={stats?.pendingApplications || 0}
        icon={<FileText className="w-6 h-6 text-white" />}
        color="bg-orange-500"
        loading={loading}
      />
      
      <StatsCard
        title="Maintenance Requests"
        value={stats?.activeMaintenanceRequests || 0}
        icon={<Wrench className="w-6 h-6 text-white" />}
        color="bg-red-500"
        loading={loading}
      />
      
      <StatsCard
        title="Pending Invoices"
        value={stats?.pendingInvoices || 0}
        icon={<DollarSign className="w-6 h-6 text-white" />}
        color="bg-purple-500"
        loading={loading}
      />
      
      <StatsCard
        title="Total Revenue"
        value={stats ? `$${stats.totalRevenue.toLocaleString()}` : '$0'}
        icon={<TrendingUp className="w-6 h-6 text-white" />}
        color="bg-indigo-500"
        subtitle="This month"
        loading={loading}
      />
      
      <StatsCard
        title="Approved Applications"
        value={stats?.approvedApplications || 0}
        icon={<Users className="w-6 h-6 text-white" />}
        color="bg-teal-500"
        loading={loading}
      />
      
      <StatsCard
        title="Rooms in Maintenance"
        value={stats?.maintenanceRooms || 0}
        icon={<Wrench className="w-6 h-6 text-white" />}
        color="bg-gray-500"
        loading={loading}
      />
    </div>
  );
};

export default DashboardStatsLive;
