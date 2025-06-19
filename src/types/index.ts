
// Core type definitions for the Hall Seat Management System

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  HALL_ADMIN = 'HALL_ADMIN',
  FINANCE_OFFICER = 'FINANCE_OFFICER',
  MAINTENANCE_STAFF = 'MAINTENANCE_STAFF',
  STUDENT = 'STUDENT',
  REPORT_VIEWER = 'REPORT_VIEWER'
}

export interface Student extends User {
  studentId: string;
  department: string;
  yearOfStudy: number;
  profilePhoto?: string;
  phoneNumber: string;
  emergencyContact: EmergencyContact;
  specialNeeds?: string[];
  applicationStatus: ApplicationStatus;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email: string;
}

export interface Building {
  id: string;
  name: string;
  address: string;
  totalFloors: number;
  isActive: boolean;
}

export interface Room {
  id: string;
  buildingId: string;
  roomNumber: string;
  floor: number;
  type: RoomType;
  capacity: number;
  amenities: string[];
  monthlyFee: number;
  status: RoomStatus;
  currentOccupants: string[];
}

export enum RoomType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  SPECIAL_NEEDS = 'SPECIAL_NEEDS'
}

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
  RESERVED = 'RESERVED'
}

export interface Application {
  id: string;
  studentId: string;
  preferredRoomType: RoomType;
  preferredBuilding?: string;
  applicationDate: string;
  status: ApplicationStatus;
  priority: number;
  adminComments?: string;
  documents: string[];
}

export enum ApplicationStatus {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  WAITLISTED = 'WAITLISTED'
}

export interface MaintenanceRequest {
  id: string;
  roomId: string;
  studentId: string;
  category: MaintenanceCategory;
  description: string;
  priority: Priority;
  status: MaintenanceStatus;
  submittedAt: string;
  assignedTo?: string;
  completedAt?: string;
  feedback?: string;
}

export enum MaintenanceCategory {
  ELECTRICAL = 'ELECTRICAL',
  PLUMBING = 'PLUMBING',
  FURNITURE = 'FURNITURE',
  CLEANING = 'CLEANING',
  OTHER = 'OTHER'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum MaintenanceStatus {
  SUBMITTED = 'SUBMITTED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Invoice {
  id: string;
  studentId: string;
  roomId: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  generatedAt: string;
  paidAt?: string;
  lateFee: number;
}

export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}
