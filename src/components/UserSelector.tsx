import React from 'react';
import { User, useAuth } from '../contexts/AuthContext.tsx';
import { Users } from 'lucide-react';

const UserSelector: React.FC = () => {
  const { currentUser, setCurrentUser, users } = useAuth();

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    const selectedUser = users.find(user => user.id === userId) || null;
    setCurrentUser(selectedUser);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800';
      case 'USER':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex flex-col">
        <select
          value={currentUser?.id || ''}
          onChange={handleUserChange}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          style={{ border: '1px solid #d1d5db' }}
        >
          <option value="">Select a user</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName} ({user.position})
            </option>
          ))}
        </select>
        
        {currentUser && (
          <div className="mt-2">
            <div className="flex items-center">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(currentUser.role)}`}>
                {currentUser.role}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <p>Email: {currentUser.email}</p>
              <p>Department ID: {currentUser.departmentId}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSelector;
