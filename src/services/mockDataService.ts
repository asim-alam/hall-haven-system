import { Building, Room, Student, Application, MaintenanceRequest, Invoice, UserRole, RoomType, RoomStatus, ApplicationStatus, MaintenanceCategory, Priority, MaintenanceStatus, InvoiceStatus } from '../types';

class MockDataService {
  // Mock Buildings
  getBuildings(): Building[] {
    return [
      {
        id: 'bld-1',
        name: 'North Hall',
        address: '123 University Ave',
        totalFloors: 5,
        isActive: true
      },
      {
        id: 'bld-2',
        name: 'South Residence',
        address: '456 Campus Dr',
        totalFloors: 4,
        isActive: true
      },
      {
        id: 'bld-3',
        name: 'East Tower',
        address: '789 College St',
        totalFloors: 8,
        isActive: true
      }
    ];
  }

  // Mock Rooms
  getRooms(): Room[] {
    const rooms: Room[] = [];
    const buildings = this.getBuildings();
    
    buildings.forEach(building => {
      for (let floor = 1; floor <= building.totalFloors; floor++) {
        for (let roomNum = 1; roomNum <= 10; roomNum++) {
          const roomNumber = `${floor}${roomNum.toString().padStart(2, '0')}`;
          const roomTypes = Object.values(RoomType);
          const randomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
          
          rooms.push({
            id: `${building.id}-${roomNumber}`,
            buildingId: building.id,
            roomNumber,
            floor,
            type: randomType,
            capacity: randomType === RoomType.SINGLE ? 1 : 2,
            amenities: ['WiFi', 'Desk', 'Wardrobe', 'Bed'],
            monthlyFee: randomType === RoomType.SINGLE ? 800 : randomType === RoomType.DOUBLE ? 600 : 900,
            status: Math.random() > 0.3 ? RoomStatus.AVAILABLE : RoomStatus.OCCUPIED,
            currentOccupants: []
          });
        }
      }
    });
    
    return rooms;
  }

  // Mock Students
  getStudents(): Student[] {
    return [
      {
        id: 'std-1',
        email: 'alice.student@university.edu',
        firstName: 'Alice',
        lastName: 'Johnson',
        role: UserRole.STUDENT,
        isActive: true,
        createdAt: '2024-01-15T00:00:00Z',
        studentId: 'STU2024001',
        department: 'Computer Science',
        yearOfStudy: 2,
        phoneNumber: '+1-555-0101',
        emergencyContact: {
          name: 'Mary Johnson',
          relationship: 'Mother',
          phoneNumber: '+1-555-0102',
          email: 'mary.johnson@email.com'
        },
        applicationStatus: ApplicationStatus.APPROVED
      },
      {
        id: 'std-2',
        email: 'bob.student@university.edu',
        firstName: 'Bob',
        lastName: 'Smith',
        role: UserRole.STUDENT,
        isActive: true,
        createdAt: '2024-01-16T00:00:00Z',
        studentId: 'STU2024002',
        department: 'Engineering',
        yearOfStudy: 1,
        phoneNumber: '+1-555-0201',
        emergencyContact: {
          name: 'John Smith',
          relationship: 'Father',
          phoneNumber: '+1-555-0202',
          email: 'john.smith@email.com'
        },
        applicationStatus: ApplicationStatus.UNDER_REVIEW
      }
    ];
  }

  // Mock Applications
  getApplications(): Application[] {
    return [
      {
        id: 'app-1',
        studentId: 'std-1',
        preferredRoomType: RoomType.SINGLE,
        preferredBuilding: 'bld-1',
        applicationDate: '2024-01-20T00:00:00Z',
        status: ApplicationStatus.APPROVED,
        priority: 85,
        adminComments: 'Excellent academic record',
        documents: ['transcript.pdf', 'id-document.pdf']
      },
      {
        id: 'app-2',
        studentId: 'std-2',
        preferredRoomType: RoomType.DOUBLE,
        applicationDate: '2024-01-22T00:00:00Z',
        status: ApplicationStatus.UNDER_REVIEW,
        priority: 70,
        documents: ['transcript.pdf']
      }
    ];
  }

  // Mock Maintenance Requests
  getMaintenanceRequests(): MaintenanceRequest[] {
    return [
      {
        id: 'mnt-1',
        roomId: 'bld-1-101',
        studentId: 'std-1',
        category: MaintenanceCategory.ELECTRICAL,
        description: 'Light fixture not working in the study area',
        priority: Priority.MEDIUM,
        status: MaintenanceStatus.ASSIGNED,
        submittedAt: '2024-06-15T10:00:00Z',
        assignedTo: '4'
      },
      {
        id: 'mnt-2',
        roomId: 'bld-2-205',
        studentId: 'std-2',
        category: MaintenanceCategory.PLUMBING,
        description: 'Leaky faucet in bathroom',
        priority: Priority.HIGH,
        status: MaintenanceStatus.IN_PROGRESS,
        submittedAt: '2024-06-16T14:30:00Z',
        assignedTo: '4'
      }
    ];
  }

  // Mock Invoices
  getInvoices(): Invoice[] {
    return [
      {
        id: 'inv-1',
        studentId: 'std-1',
        roomId: 'bld-1-101',
        amount: 800,
        dueDate: '2024-07-01T00:00:00Z',
        status: InvoiceStatus.PAID,
        generatedAt: '2024-06-01T00:00:00Z',
        paidAt: '2024-06-15T00:00:00Z',
        lateFee: 0
      },
      {
        id: 'inv-2',
        studentId: 'std-2',
        roomId: 'bld-2-205',
        amount: 600,
        dueDate: '2024-07-01T00:00:00Z',
        status: InvoiceStatus.PENDING,
        generatedAt: '2024-06-01T00:00:00Z',
        lateFee: 0
      }
    ];
  }

  // Dashboard Statistics
  getDashboardStats() {
    const rooms = this.getRooms();
    const applications = this.getApplications();
    const maintenanceRequests = this.getMaintenanceRequests();
    const invoices = this.getInvoices();

    return {
      totalRooms: rooms.length,
      occupiedRooms: rooms.filter(r => r.status === RoomStatus.OCCUPIED).length,
      availableRooms: rooms.filter(r => r.status === RoomStatus.AVAILABLE).length,
      maintenanceRooms: rooms.filter(r => r.status === RoomStatus.MAINTENANCE).length,
      pendingApplications: applications.filter(a => a.status === ApplicationStatus.UNDER_REVIEW).length,
      approvedApplications: applications.filter(a => a.status === ApplicationStatus.APPROVED).length,
      activeMaintenanceRequests: maintenanceRequests.filter(m => m.status !== MaintenanceStatus.COMPLETED).length,
      pendingInvoices: invoices.filter(i => i.status === InvoiceStatus.PENDING).length,
      totalRevenue: invoices.filter(i => i.status === InvoiceStatus.PAID).reduce((sum, inv) => sum + inv.amount, 0)
    };
  }
}

export const mockDataService = new MockDataService();
