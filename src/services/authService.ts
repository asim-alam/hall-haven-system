
import { User, UserRole } from '../types';

class AuthService {
  private currentUser: User | null = null;
  private sessionTimeout = 30 * 60 * 1000; // 30 minutes
  private sessionTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.loadSession();
    this.startSessionTimer();
  }

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Simulate API call - replace with actual backend integration
      const users = this.getMockUsers();
      const user = users.find(u => u.email === email);
      
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      // In real implementation, password would be hashed and verified
      if (password === 'password123') {
        this.currentUser = { ...user, lastLogin: new Date().toISOString() };
        this.saveSession();
        this.resetSessionTimer();
        
        return { success: true, user: this.currentUser };
      }

      return { success: false, error: 'Invalid email or password' };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  logout(): void {
    this.currentUser = null;
    this.clearSession();
    this.clearSessionTimer();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return this.currentUser ? roles.includes(this.currentUser.role) : false;
  }

  private saveSession(): void {
    if (this.currentUser) {
      localStorage.setItem('hms_user', JSON.stringify(this.currentUser));
      localStorage.setItem('hms_session', Date.now().toString());
    }
  }

  private loadSession(): void {
    const userData = localStorage.getItem('hms_user');
    const sessionTime = localStorage.getItem('hms_session');
    
    if (userData && sessionTime) {
      const sessionAge = Date.now() - parseInt(sessionTime);
      if (sessionAge < this.sessionTimeout) {
        this.currentUser = JSON.parse(userData);
      } else {
        this.clearSession();
      }
    }
  }

  private clearSession(): void {
    localStorage.removeItem('hms_user');
    localStorage.removeItem('hms_session');
  }

  private startSessionTimer(): void {
    this.sessionTimer = setInterval(() => {
      const sessionTime = localStorage.getItem('hms_session');
      if (sessionTime) {
        const sessionAge = Date.now() - parseInt(sessionTime);
        if (sessionAge >= this.sessionTimeout) {
          this.logout();
          window.location.href = '/login';
        }
      }
    }, 60000); // Check every minute
  }

  private resetSessionTimer(): void {
    if (this.currentUser) {
      localStorage.setItem('hms_session', Date.now().toString());
    }
  }

  private clearSessionTimer(): void {
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
      this.sessionTimer = null;
    }
  }

  // Mock users for development
  private getMockUsers(): User[] {
    return [
      {
        id: '1',
        email: 'admin@university.edu',
        firstName: 'John',
        lastName: 'Admin',
        role: UserRole.SUPER_ADMIN,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        email: 'hall.admin@university.edu',
        firstName: 'Sarah',
        lastName: 'Hall',
        role: UserRole.HALL_ADMIN,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '3',
        email: 'finance@university.edu',
        firstName: 'Mike',
        lastName: 'Finance',
        role: UserRole.FINANCE_OFFICER,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '4',
        email: 'maintenance@university.edu',
        firstName: 'Tom',
        lastName: 'Maintenance',
        role: UserRole.MAINTENANCE_STAFF,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '5',
        email: 'student@university.edu',
        firstName: 'Alice',
        lastName: 'Student',
        role: UserRole.STUDENT,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ];
  }
}

export const authService = new AuthService();
