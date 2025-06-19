
# Hall Seat Management System

A comprehensive web application for managing university hall accommodations, built with modern web technologies.

## 🏠 Project Overview

The Hall Seat Management System is a complete solution for managing student housing in university halls. It provides role-based access control, room management, application processing, maintenance tracking, and financial management.

## ✨ Features Implemented (Phase 1)

### 🔐 Authentication & User Management
- Role-based login system with 6 user types:
  - Super Admin
  - Hall Admin  
  - Finance Officer
  - Maintenance Staff
  - Student
  - Report Viewer
- Session management with automatic timeout
- Demo accounts for easy testing

### 👥 Student Management
- Comprehensive student profiles
- Academic information tracking
- Application status monitoring
- Contact management

### 🏢 Room & Building Management
- Multi-building support
- Room categorization (Single, Double, Special Needs)
- Real-time occupancy tracking
- Room status management (Available, Occupied, Maintenance, Reserved)
- Amenities and pricing management

### 📋 Maintenance Request System
- Category-based request submission
- Priority levels (Low, Medium, High, Urgent)
- Status tracking workflow
- Staff assignment capabilities
- Student and staff interfaces

### 📊 Dashboard & Analytics
- Role-specific dashboards
- Real-time statistics
- Occupancy rates and metrics
- Financial summaries

## 🛠 Technical Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router** for navigation
- **Tanstack Query** for state management

### Development Tools
- **Vite** for build tooling
- **ESLint** for code quality
- **Git** for version control

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hall-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## 👤 Demo Accounts

Use these accounts to test different user roles:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@university.edu | password123 |
| Hall Admin | hall.admin@university.edu | password123 |
| Finance Officer | finance@university.edu | password123 |
| Maintenance Staff | maintenance@university.edu | password123 |
| Student | student@university.edu | password123 |

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Dashboard components
│   ├── Layout/         # Layout components
│   ├── Students/       # Student management
│   ├── Rooms/          # Room management
│   └── MaintenanceRequests/ # Maintenance system
├── services/           # Business logic services
│   ├── authService.ts  # Authentication service
│   └── mockDataService.ts # Mock data provider
├── types/              # TypeScript type definitions
└── pages/              # Page components
```

## 🎯 Key Features by User Role

### Super Admin / Hall Admin
- Complete system oversight
- Student and room management
- Application processing
- Maintenance coordination
- Financial tracking
- System configuration

### Finance Officer
- Invoice management
- Payment tracking
- Financial reporting
- Fee configuration

### Maintenance Staff
- Task assignment and tracking
- Room condition monitoring
- Work order management
- Status updates

### Students
- Profile management
- Room applications
- Maintenance requests
- Invoice viewing
- Status tracking

## 📋 TODO (Future Phases)

- [ ] Mobile responsive design improvements
- [ ] External payment integration
- [ ] Email notification system
- [ ] Advanced reporting and analytics
- [ ] Document management system
- [ ] Check-in/Check-out workflows
- [ ] IoT device integration
- [ ] Real-time notifications
- [ ] Advanced search and filtering
- [ ] Bulk operations

## 🔧 Backend Integration Notes

This Phase 1 implementation uses mock data services. For production deployment:

1. Replace mock services with actual Spring Boot backend
2. Implement proper authentication with JWT tokens
3. Add database integration (MySQL/PostgreSQL)
4. Set up proper API endpoints
5. Implement file upload capabilities
6. Add email service integration

## 📝 Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for consistent styling
- Implement proper error handling
- Write clean, documented code
- Follow the established component structure
- Use proper Git commit messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests as needed
5. Submit a pull request

## 📄 License

This project is developed for educational and institutional use.
