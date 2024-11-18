export interface Employee {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'employee' | 'admin';
  department: string;
  salary: number;
  joinDate: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
}

export interface AuthState {
  user: Employee | null;
  isAuthenticated: boolean;
}