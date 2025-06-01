import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Monitor, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import RoleBasedMessage from '../components/RoleBasedMessage';

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          IT Asset Management System
        </h1>
        <p className="text-gray-600">
          Track and manage your organization's IT equipment, departments, and employees.
        </p>
        
        {/* Display role-based access message */}
        <RoleBasedMessage />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Only MANAGER and ADMIN can see Departments */}
        {(currentUser?.role === 'MANAGER' || currentUser?.role === 'ADMIN') && (
          <Link 
            to="/departments" 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-50">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Departments
            </h2>
            <p className="text-gray-600 text-sm">
              Manage company departments and organizational structure.
            </p>
          </Link>
        )}

        {/* All users can see Assets */}
        <Link 
          to="/assets" 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-50">
              <Monitor className="h-6 w-6 text-purple-600" />
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Assets
          </h2>
          <p className="text-gray-600 text-sm">
            {currentUser?.role === 'USER' 
              ? "View your assigned IT equipment and hardware." 
              : "Track IT equipment, hardware, and other company assets."}
          </p>
        </Link>

        {/* Only MANAGER and ADMIN can see Employees */}
        {(currentUser?.role === 'MANAGER' || currentUser?.role === 'ADMIN') && (
          <Link 
            to="/employees" 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-50">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Employees
            </h2>
            <p className="text-gray-600 text-sm">
              Manage employee information and asset assignments.
            </p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomePage;
