import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, User } from '../contexts/AuthContext';
import { LogIn, Monitor, Shield } from 'lucide-react';
import UserSelector from '../components/UserSelector';
import axios from "axios";

const LoginPage: React.FC = () => {
  const { currentUser, setCurrentUser, users } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string >('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
// ====================================================
    try {
      const payload = {
          user: name,
          pwd: password,        
      };

      const response = await axios.post(
        `http://localhost:3500/auth`,
         payload,
        {
          // headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response.data)

      const response2  = await axios.get<User>(
        `http://localhost:3500/user/detailes`,
        {
          withCredentials: true,
        }
      );
      console.log(response2.data)
      setCurrentUser(response2.data);


      // setLoginData(response.data);
      // setUser({ name, "jwt": response.data});




    } catch (err) {
      console.error(err)
      // setError(err?.response?.data?.message || err.message || "Failed to login data");
      // setLoginData(null);
    } finally {
      // setLoading(false);
    }












// ====================================================

    if (!currentUser) {
      setError('Please select a user to continue');
      return;
    }
    
    // Navigate to home page on successful login
    navigate('/');
  };

    // Handler for when the Name input changes
  const handleNameChange =(event: { target: { value: any; }; }) => {
    setName(event.target.value); // Update the name state with the input's current value
  };

  // Handler for when the Password input changes
  const handlePasswordChange = (event: { target: { value: any; }; }) => {
    setPassword(event.target.value); // Update the password state with the input's current value
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl">
            <Monitor className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
          IT Asset Hub
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Manage your organization's IT assets efficiently
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            <span>User Simulation (Debug)</span>
          </div>
          
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                Select User
              </label>
              <div className="mt-1">
                <UserSelector />
              </div>
            </div>

                    <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name} // The input's value is controlled by the state
            onChange={handleNameChange} // Call the handler function when the input changes
            required // Make the field required for basic HTML validation
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password" // Use type="password" for browser validation
            id="password"
            value={password} // The input's value is controlled by the state
            onChange={handlePasswordChange} // Call the handler function when the input changes
            required // Make the field required
          />
        </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
