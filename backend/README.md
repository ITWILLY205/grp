# School Management System Backend

Prisma + Express + TypeScript backend for the School Management System.

## Features

- **Authentication**: JWT-based auth with bcrypt password hashing
- **User Roles**: Admin, Teacher, Student, Parent, Discipline Master
- **Academic Management**: Years, Terms, Classes, Streams, Subjects
- **Student Management**: CRUD with class/stream assignment
- **Teacher Management**: CRUD with subject/stream assignments
- **Marks Recording**: CAT + Exam scores with automatic grade calculation
- **Attendance**: Daily attendance tracking with statistics
- **Discipline**: Incident reporting with automatic mark deductions
- **Notifications**: Role-based and user-specific notifications
- **Reports**: Student performance, class summary, discipline, attendance
- **Dashboard**: Statistics and recent activity

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: MySQL
- **Auth**: JWT + bcrypt
- **Validation**: Zod

## Setup

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Generate Prisma client**:
   ```bash
   npm run db:generate
   ```

4. **Run database migrations**:
   ```bash
   npm run db:migrate
   # Or if using existing database: npm run db:push
   ```

5. **Seed initial data**:
   ```bash
   npm run db:seed
   ```

6. **Start development server**:
   ```bash
   npm run dev
   ```

   Or for production:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login (Admin/Teacher/Discipline Master)
- `POST /api/auth/student-login` - Student login (by student_id + full_name)
- `POST /api/auth/register` - Register new user (Admin only)
- `POST /api/auth/change-password` - Change password

### Users
- `GET /api/users` - List all users (Admin)
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin)

### Students
- `GET /api/students` - List all students
- `GET /api/students/:id` - Get student details (with marks, attendance, incidents)
- `POST /api/students` - Create student (Admin)
- `PATCH /api/students/:id` - Update student (Admin)
- `DELETE /api/students/:id` - Delete student (Admin)

### Teachers
- `GET /api/teachers` - List all teachers (with assignments)
- `GET /api/teachers/:id` - Get teacher details
- `POST /api/teachers` - Create teacher (Admin)
- `PATCH /api/teachers/:id` - Update teacher (Admin)
- `DELETE /api/teachers/:id` - Delete teacher (Admin)

### Academics
- `GET /api/academics/years` - List academic years
- `POST /api/academics/years` - Create year (Admin)
- `GET /api/academics/terms` - List terms
- `POST /api/academics/terms` - Create term (Admin)
- `GET /api/academics/classes` - List classes (with student count)
- `POST /api/academics/classes` - Create class (Admin)
- `GET /api/academics/streams` - List streams
- `POST /api/academics/streams` - Create stream (Admin)
- `GET /api/academics/subjects` - List subjects
- `POST /api/academics/subjects` - Create subject (Admin)
- `GET /api/academics/assignments` - List teacher assignments
- `POST /api/academics/assignments` - Assign teacher (Admin)
- `DELETE /api/academics/assignments/:id` - Remove assignment (Admin)

### Marks
- `GET /api/marks/student/:id` - Get student marks
- `GET /api/marks/class/:classId` - Get class marks (with filters)
- `POST /api/marks` - Record/update mark
- `POST /api/marks/bulk` - Bulk update marks
- `DELETE /api/marks/:id` - Delete mark (Admin)

### Attendance
- `GET /api/attendance/student/:id` - Get student attendance
- `GET /api/attendance/class/:classId` - Get class attendance for date
- `POST /api/attendance` - Mark attendance (bulk)
- `GET /api/attendance/stats/:classId` - Attendance statistics

### Discipline
- `GET /api/discipline` - List all incidents
- `GET /api/discipline/student/:id` - Student incidents
- `POST /api/discipline` - Create incident (auto-deducts marks)
- `PATCH /api/discipline/:id` - Update incident
- `DELETE /api/discipline/:id` - Delete incident

### Notifications
- `GET /api/notifications/my` - Get my notifications
- `GET /api/notifications/unread-count` - Unread notification count
- `PATCH /api/notifications/:id/read` - Mark as read
- `POST /api/notifications` - Send notification (Admin)
- `DELETE /api/notifications/:id` - Delete notification

### Reports
- `GET /api/reports/student-performance/:studentId` - Student report
- `GET /api/reports/class-summary/:classId` - Class ranking report
- `GET /api/reports/discipline-summary` - Discipline report
- `GET /api/reports/attendance/:classId` - Attendance report

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/recent` - Recent activity

### Health
- `GET /api/health` - Health check

## Default Credentials (After Seeding)

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Teacher | teacher1 | teacher123 |
| Discipline Master | discipline1 | dm123 |
| Student | student1 | student123 |

## Database Schema

The Prisma schema includes:
- Users (with role-based access)
- Academic Years & Terms
- Classes & Streams
- Subjects
- Teachers & Students (linked to Users)
- Teacher Assignments (teacher-subject-stream-term)
- Marks (CAT + Exam scores)
- Attendance (daily records)
- Discipline Incidents (with mark deductions)
- Notifications (role-based messaging)

## Development

- Run `npm run db:studio` to open Prisma Studio for database management
- Run `npm run db:migrate` after changing schema.prisma
- Run `npm run db:generate` to regenerate Prisma client
