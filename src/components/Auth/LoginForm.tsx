
import React, { useState } from 'react';
import { User, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface LoginFormProps {
  onLoginSuccess: (user: UserProfile) => void;
  mockUsers: UserProfile[];
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, mockUsers }) => {
  const [loading, setLoading] = useState(false);

  const handleUserSelect = async (user: UserProfile) => {
    setLoading(true);
    console.log('Selected user:', user.email, 'with role:', user.role);
    
    // Simulate a brief loading time
    setTimeout(() => {
      onLoginSuccess(user);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <User size={40} />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Hall Management System</h1>
          <p className="text-blue-100 mt-2">Select Account to Access (Demo Mode)</p>
        </div>

        {/* Account Selection */}
        <div className="p-6">
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Authentication is temporarily disabled. Select any account below to access the system.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Accounts:</h3>
            
            {mockUsers.map((user, index) => (
              <button
                key={index}
                onClick={() => handleUserSelect(user)}
                disabled={loading}
                className="w-full text-left p-4 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                    <div className="text-xs text-blue-600 font-medium">
                      {user.role.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {loading && (
            <div className="mt-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Accessing account...</p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Authentication system is temporarily disabled for testing purposes.
              All accounts are accessible without login credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
