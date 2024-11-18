import { Employee, AttendanceRecord } from '../types';

const STORAGE_KEYS = {
  EMPLOYEES: 'divron_employees',
  ATTENDANCE: 'divron_attendance'
};

// Initialize default admin if not exists
const initializeAdmin = () => {
  const employees = getEmployees();
  if (!employees.some(emp => emp.role === 'admin')) {
    const admin: Employee = {
      id: 'admin-1',
      name: 'Admin',
      email: 'admin@divron.com',
      password: 'admin123', // In production, use hashed passwords
      role: 'admin',
      department: 'Administration',
      joinDate: new Date().toISOString()
    };
    setEmployees([admin]);
  }
};

export const getEmployees = (): Employee[] => {
  const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
  return data ? JSON.parse(data) : [];
};

export const setEmployees = (employees: Employee[]) => {
  localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
};

export const getAttendanceRecords = (): AttendanceRecord[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
  return data ? JSON.parse(data) : [];
};

export const setAttendanceRecords = (records: AttendanceRecord[]) => {
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
};

export const addEmployee = (employee: Omit<Employee, 'id'>) => {
  const employees = getEmployees();
  const newEmployee: Employee = {
    ...employee,
    id: `emp-${Date.now()}`
  };
  setEmployees([...employees, newEmployee]);
  return newEmployee;
};

export const removeEmployee = (id: string) => {
  const employees = getEmployees();
  const filteredEmployees = employees.filter(emp => emp.id !== id);
  setEmployees(filteredEmployees);
  
  // Remove associated attendance records
  const records = getAttendanceRecords();
  const filteredRecords = records.filter(record => record.employeeId !== id);
  setAttendanceRecords(filteredRecords);
};

export const addAttendanceRecord = (record: Omit<AttendanceRecord, 'id'>) => {
  const records = getAttendanceRecords();
  const newRecord: AttendanceRecord = {
    ...record,
    id: `att-${Date.now()}`
  };
  setAttendanceRecords([...records, newRecord]);
  return newRecord;
};

export const updateAttendanceRecord = (id: string, updates: Partial<AttendanceRecord>) => {
  const records = getAttendanceRecords();
  const updatedRecords = records.map(record => 
    record.id === id ? { ...record, ...updates } : record
  );
  setAttendanceRecords(updatedRecords);
};

// Initialize the admin account
initializeAdmin();