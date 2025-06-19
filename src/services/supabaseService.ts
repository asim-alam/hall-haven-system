
import { supabase } from "@/integrations/supabase/client";

export interface DatabaseStudent {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  student_id: string;
  department: string;
  year_of_study: number;
  phone_number: string;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
  emergency_contact_email: string;
  application_status: string;
  created_at: string;
}

export interface DatabaseBuilding {
  id: string;
  name: string;
  address: string;
  total_floors: number;
  is_active: boolean;
  created_at: string;
}

export interface DatabaseRoom {
  id: string;
  building_id: string;
  room_number: string;
  floor: number;
  type: string;
  capacity: number;
  amenities: string[];
  monthly_fee: number;
  status: string;
  created_at: string;
  buildings?: DatabaseBuilding;
}

export interface DatabaseMaintenanceRequest {
  id: string;
  room_id: string;
  student_id: string;
  category: string;
  description: string;
  priority: string;
  status: string;
  submitted_at: string;
  assigned_to?: string;
  completed_at?: string;
  feedback?: string;
  rooms?: DatabaseRoom;
  students?: DatabaseStudent;
}

export interface DatabaseApplication {
  id: string;
  student_id: string;
  preferred_room_type: string;
  preferred_building_id?: string;
  application_date: string;
  status: string;
  priority: number;
  admin_comments?: string;
  documents: string[];
  students?: DatabaseStudent;
  buildings?: DatabaseBuilding;
}

export interface DatabaseInvoice {
  id: string;
  student_id: string;
  room_id: string;
  amount: number;
  due_date: string;
  status: string;
  generated_at: string;
  paid_at?: string;
  late_fee: number;
  students?: DatabaseStudent;
  rooms?: DatabaseRoom;
}

export interface DatabaseRoomAssignment {
  id: string;
  student_id: string;
  room_id: string;
  assigned_at: string;
  check_in_date?: string;
  check_out_date?: string;
  is_active: boolean;
  students?: DatabaseStudent;
  rooms?: DatabaseRoom;
}

class SupabaseService {
  async getStudents(): Promise<DatabaseStudent[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching students:', error);
      return [];
    }

    return data || [];
  }

  async getBuildings(): Promise<DatabaseBuilding[]> {
    const { data, error } = await supabase
      .from('buildings')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching buildings:', error);
      return [];
    }

    return data || [];
  }

  async getRooms(): Promise<DatabaseRoom[]> {
    const { data, error } = await supabase
      .from('rooms')
      .select(`
        *,
        buildings (*)
      `)
      .order('room_number');

    if (error) {
      console.error('Error fetching rooms:', error);
      return [];
    }

    return data || [];
  }

  async getMaintenanceRequests(): Promise<DatabaseMaintenanceRequest[]> {
    const { data, error } = await supabase
      .from('maintenance_requests')
      .select(`
        *,
        rooms (*,
          buildings (*)
        ),
        students (*)
      `)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error fetching maintenance requests:', error);
      return [];
    }

    return data || [];
  }

  async getApplications(): Promise<DatabaseApplication[]> {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        students (*),
        buildings (*)
      `)
      .order('application_date', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      return [];
    }

    return data || [];
  }

  async getInvoices(): Promise<DatabaseInvoice[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        students (*),
        rooms (*,
          buildings (*)
        )
      `)
      .order('generated_at', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }

    return data || [];
  }

  async getRoomAssignments(): Promise<DatabaseRoomAssignment[]> {
    const { data, error } = await supabase
      .from('room_assignments')
      .select(`
        *,
        students (*),
        rooms (*,
          buildings (*)
        )
      `)
      .eq('is_active', true)
      .order('assigned_at', { ascending: false });

    if (error) {
      console.error('Error fetching room assignments:', error);
      return [];
    }

    return data || [];
  }

  async getDashboardStats() {
    const [rooms, applications, maintenanceRequests, invoices] = await Promise.all([
      this.getRooms(),
      this.getApplications(),
      this.getMaintenanceRequests(),
      this.getInvoices()
    ]);

    return {
      totalRooms: rooms.length,
      occupiedRooms: rooms.filter(r => r.status === 'OCCUPIED').length,
      availableRooms: rooms.filter(r => r.status === 'AVAILABLE').length,
      maintenanceRooms: rooms.filter(r => r.status === 'MAINTENANCE').length,
      pendingApplications: applications.filter(a => a.status === 'UNDER_REVIEW').length,
      approvedApplications: applications.filter(a => a.status === 'APPROVED').length,
      activeMaintenanceRequests: maintenanceRequests.filter(m => m.status !== 'COMPLETED').length,
      pendingInvoices: invoices.filter(i => i.status === 'PENDING').length,
      totalRevenue: invoices.filter(i => i.status === 'PAID').reduce((sum, inv) => sum + inv.amount, 0)
    };
  }
}

export const supabaseService = new SupabaseService();
