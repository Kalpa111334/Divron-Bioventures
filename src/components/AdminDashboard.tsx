import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { getEmployees, getAttendanceRecords, removeEmployee } from '../utils/storage';
import { Employee, AttendanceRecord } from '../types';
import { Download, LogOut, Plus, Trash2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import AddEmployeeModal from './AddEmployeeModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; employee: Employee | null }>({
    isOpen: false,
    employee: null
  });

  useEffect(() => {
    const loadData = () => {
      setEmployees(getEmployees().filter(emp => emp.role !== 'admin'));
      setAttendance(getAttendanceRecords());
    };

    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRemoveEmployee = (employee: Employee) => {
    setDeleteModal({ isOpen: true, employee });
  };

  const confirmDelete = () => {
    if (deleteModal.employee) {
      removeEmployee(deleteModal.employee.id);
      setEmployees(prev => prev.filter(emp => emp.id !== deleteModal.employee?.id));
      toast.success('Employee removed successfully');
    }
  };

  const downloadReport = (type: 'daily' | 'monthly' | 'yearly') => {
    const records = attendance.filter(record => {
      const recordDate = new Date(record.date);
      const selected = new Date(selectedDate);
      
      switch (type) {
        case 'daily':
          return format(recordDate, 'yyyy-MM-dd') === format(selected, 'yyyy-MM-dd');
        case 'monthly':
          return format(recordDate, 'yyyy-MM') === format(selected, 'yyyy-MM');
        case 'yearly':
          return format(recordDate, 'yyyy') === format(selected, 'yyyy');
      }
    });

    const csvContent = [
      ['Employee Name', 'Department', 'Salary', 'Date', 'Check In', 'Check Out'].join(','),
      ...records.map(record => {
        const employee = employees.find(emp => emp.id === record.employeeId);
        return [
          employee?.name || 'Unknown',
          employee?.department || 'Unknown',
          employee?.salary || 'N/A',
          record.date,
          record.checkIn,
          record.checkOut || 'Not checked out'
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${type}-${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Divron Admin Dashboard
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center px-4 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Employee List */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Employees</h2>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </button>
              </div>
              
              <div className="space-y-4">
                {employees.map(employee => (
                  <div
                    key={employee.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{employee.name}</h3>
                      <p className="text-sm text-gray-500">{employee.department}</p>
                      <p className="text-sm text-gray-500">
                        Salary: ${employee.salary?.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveEmployee(employee)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance Reports */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Attendance Reports
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-3">
                {['daily', 'monthly', 'yearly'].map((type) => (
                  <button
                    key={type}
                    onClick={() => downloadReport(type as 'daily' | 'monthly' | 'yearly')}
                    className="flex items-center w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg"
                  >
                    <Download className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="capitalize">
                      Download {type} Report
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onEmployeeAdded={() => {
          setEmployees(getEmployees().filter(emp => emp.role !== 'admin'));
        }}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, employee: null })}
        onConfirm={confirmDelete}
        employeeName={deleteModal.employee?.name || ''}
      />
    </div>
  );
};

export default AdminDashboard;