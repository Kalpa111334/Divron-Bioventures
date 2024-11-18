import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { getAttendanceRecords, addAttendanceRecord, updateAttendanceRecord } from '../utils/storage';
import { AttendanceRecord } from '../types';
import { Clock, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const EmployeeDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    // Update current time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    // Load attendance records
    const loadAttendance = () => {
      if (!user) return;

      const records = getAttendanceRecords();
      const today = format(new Date(), 'yyyy-MM-dd');
      
      const todayRec = records.find(
        record => record.employeeId === user.id && record.date === today
      );
      setTodayRecord(todayRec || null);

      const history = records
        .filter(record => record.employeeId === user.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setAttendanceHistory(history);
    };

    loadAttendance();
    const recordsTimer = setInterval(loadAttendance, 30000); // Refresh every 30 seconds

    return () => {
      clearInterval(timer);
      clearInterval(recordsTimer);
    };
  }, [user]);

  const handleCheckIn = () => {
    if (!user) return;

    const now = new Date();
    const record = addAttendanceRecord({
      employeeId: user.id,
      date: format(now, 'yyyy-MM-dd'),
      checkIn: format(now, 'HH:mm:ss'),
      checkOut: null
    });

    setTodayRecord(record);
    toast.success('Check-in recorded successfully!');
  };

  const handleCheckOut = () => {
    if (!user || !todayRecord) return;

    const now = new Date();
    updateAttendanceRecord(todayRecord.id, {
      checkOut: format(now, 'HH:mm:ss')
    });

    setTodayRecord({
      ...todayRecord,
      checkOut: format(now, 'HH:mm:ss')
    });

    toast.success('Check-out recorded successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Divron Attendance
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
            {/* Current Time and Attendance */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  {format(currentTime, 'HH:mm:ss')}
                </h2>
                <p className="text-gray-500">
                  {format(currentTime, 'EEEE, MMMM d, yyyy')}
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Today's Attendance
                  </h3>
                  {todayRecord ? (
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        Check In: <span className="font-medium">{todayRecord.checkIn}</span>
                      </p>
                      {todayRecord.checkOut ? (
                        <p className="text-gray-600">
                          Check Out: <span className="font-medium">{todayRecord.checkOut}</span>
                        </p>
                      ) : (
                        <button
                          onClick={handleCheckOut}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Check Out
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={handleCheckIn}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Check In
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Attendance History */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Attendance History
              </h2>
              
              <div className="space-y-4">
                {attendanceHistory.map(record => (
                  <div
                    key={record.id}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">
                        {format(new Date(record.date), 'MMM d, yyyy')}
                      </span>
                      <span className="text-sm text-gray-500">
                        {record.checkIn} - {record.checkOut || 'Not checked out'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;