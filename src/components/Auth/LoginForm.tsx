
import React, { useState } from 'react';
import { User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';

interface LoginFormProps {
  onLoginSuccess: (user: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'STUDENT'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              role: formData.role
            }
          }
        });

        if (error) {
          setError(error.message);
        } else if (data.user) {
          // For demo purposes, we'll sign in immediately after signup
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
          });
          
          if (!signInError) {
            console.log('Sign up and login successful:', data.user.email);
            onLoginSuccess(data.user);
          } else {
            setError('Account created but login failed. Please try logging in manually.');
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) {
          setError(error.message);
        } else if (data.user) {
          console.log('Login successful:', data.user.email);
          onLoginSuccess(data.user);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleDemoLogin = async (email: string, role: string) => {
    setLoading(true);
    setError('');

    try {
      // Try to sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: 'password123'
      });

      if (!signInError && signInData.user) {
        console.log('Demo login successful:', signInData.user.email);
        onLoginSuccess(signInData.user);
        return;
      }

      // If sign in fails, try to create the account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: 'password123',
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: role.split(' ')[0],
            last_name: role.split(' ')[1] || 'User',
            role: role.replace(' ', '_').toUpperCase()
          }
        }
      });

      if (!signUpError && signUpData.user) {
        // Try to sign in again after creating account
        const { data: finalSignIn, error: finalSignInError } = await supabase.auth.signInWithPassword({
          email,
          password: 'password123'
        });

        if (!finalSignInError && finalSignIn.user) {
          console.log('Demo account created and logged in:', finalSignIn.user.email);
          onLoginSuccess(finalSignIn.user);
        } else {
          setError('Demo account created but login failed. Please try logging in manually.');
        }
      } else {
        setError(`Demo login failed: ${signUpError?.message || 'Unknown error'}`);
      }
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  // Demo accounts for easy testing
  const demoAccounts = [
    { email: 'admin@university.edu', role: 'Super Admin' },
    { email: 'hall.admin@university.edu', role: 'Hall Admin' },
    { email: 'finance@university.edu', role: 'Finance Officer' },
    { email: 'maintenance@university.edu', role: 'Maintenance Staff' },
    { email: 'student@university.edu', role: 'Student' },
    { email: 'student1@gmail.com', role: 'Student' }
  ];

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
          <p className="text-blue-100 mt-2">{isSignUp ? 'Create your account' : 'Sign in to your account'}</p>
        </div>

        {/* Form */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
              />
            </div>

            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Last name"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="HALL_ADMIN">Hall Admin</option>
                    <option value="FINANCE_OFFICER">Finance Officer</option>
                    <option value="MAINTENANCE_STAFF">Maintenance Staff</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (isSignUp ? 'Creating Account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Demo Accounts (Click to auto-login):</p>
            <div className="space-y-2">
              {demoAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => handleDemoLogin(account.email, account.role)}
                  disabled={loading}
                  className="w-full text-left px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border transition-colors disabled:opacity-50"
                >
                  <div className="font-medium text-gray-800">{account.role}</div>
                  <div className="text-gray-600">{account.email}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Password for all demo accounts: <span className="font-mono">password123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
