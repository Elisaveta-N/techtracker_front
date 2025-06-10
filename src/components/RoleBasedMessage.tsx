// import React from 'react';
import { useAuth } from '../contexts/AuthContext';
// import { CircleAlert, Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';

const RoleBasedMessage = () => {
  const { currentUser } = useAuth();

  // Return null if no user
  if (!currentUser) return null;

  // Determine which message to show based on role
  const getMessage = () => {
    switch (currentUser.role) {
      case 'ADMIN':
        return {
          title: 'Admin Access',
          message: 'You have full access to all features and data.',
          icon: <Eye className="h-5 w-5 text-green-500" />,
          color: 'bg-green-50 text-green-800 border-green-200'
        };
      case 'MANAGER':
        return {
          title: 'Manager Access',
          message: 'You have access to your department data in read-only mode.',
          icon: <Eye className="h-5 w-5 text-blue-500" />,
          color: 'bg-blue-50 text-blue-800 border-blue-200'
        };
      case 'USER':
        return {
          title: 'User Access',
          message: 'You can only view your assigned assets in read-only mode.',
          icon: <EyeOff className="h-5 w-5 text-gray-500" />,
          color: 'bg-gray-50 text-gray-800 border-gray-200'
        };
      default:
        return {
          title: 'Limited Access',
          message: 'Your access level is restricted.',
          icon: <LockKeyhole className="h-5 w-5 text-orange-500" />,
          color: 'bg-orange-50 text-orange-800 border-orange-200'
        };
    }
  };

  const { title, message, icon, color } = getMessage();

  return (
    <div className={`flex items-center p-3 rounded-md border mb-4 ${color}`}>
      <div className="mr-3">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-xs">{message}</p>
      </div>
    </div>
  );
};

export default RoleBasedMessage;
