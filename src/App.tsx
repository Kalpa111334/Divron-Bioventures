import React from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import AuthForm from './components/AuthForm';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';

const DashboardRouter: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return user?.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <DashboardRouter />
    </AuthProvider>
  );
}

export default App;