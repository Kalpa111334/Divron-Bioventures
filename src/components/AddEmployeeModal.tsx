import React, { useState } from 'react';
import { X } from 'lucide-react';
import { addEmployee } from '../utils/storage';
import toast from 'react-hot-toast';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmployeeAdded: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onEmployeeAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    salary: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.department || !formData.salary) {
      toast.error('All fields are required');
      return;
    }

    if (isNaN(Number(formData.salary)) || Number(formData.salary) <= 0) {
      toast.error('Please enter a valid salary');
      return;
    }

    try {
      addEmployee({
        ...formData,
        salary: Number(formData.salary),
        role: 'employee',
        joinDate: new Date().toISOString()
      });
      
      toast.success('Employee added successfully');
      onEmployeeAdded();
      onClose();
      setFormData({ name: '', email: '', password: '', department: '', salary: '' });
    } catch (error) {
      toast.error('Failed to add employee');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Add New Employee</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Engineering"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary
            </label>
            <input
              type="number"
              value={formData.salary}
              onChange={e => setFormData({ ...formData, salary: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="50000"
              min="0"
              step="1000"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;