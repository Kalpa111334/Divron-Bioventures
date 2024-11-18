import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addEmployee } from '../utils/storage';
import { Building2, Lock, Mail, User } from 'lucide-react';
import toast from 'react-hot-toast';

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: ''
  });
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'register') {
        addEmployee({
          ...formData,
          role: 'employee',
          joinDate: new Date().toISOString()
        });
        toast.success('Registration successful! Please login.');
        setMode('login');
      } else {
        await login(formData.email, formData.password);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'login' 
              ? "Please sign in to your account" 
              : "Register as a new employee"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div>
              <label className="flex items-center border rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500">
                <User className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  required
                  className="ml-2 flex-1 outline-none bg-transparent"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </label>
            </div>
          )}

          <div>
            <label className="flex items-center border rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500">
              <Mail className="h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                className="ml-2 flex-1 outline-none bg-transparent"
                placeholder="Email address"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </label>
          </div>

          <div>
            <label className="flex items-center border rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500">
              <Lock className="h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                className="ml-2 flex-1 outline-none bg-transparent"
                placeholder="Password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </label>
          </div>

          {mode === 'register' && (
            <div>
              <label className="flex items-center border rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500">
                <Building2 className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  required
                  className="ml-2 flex-1 outline-none bg-transparent"
                  placeholder="Department"
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                />
              </label>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {mode === 'login' ? 'Sign in' : 'Register'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            {mode === 'login' 
              ? "Don't have an account? Register" 
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;