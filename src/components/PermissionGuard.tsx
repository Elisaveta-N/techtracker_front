import React, { ReactNode } from 'react';
import { LockKeyhole } from 'lucide-react';

interface PermissionGuardProps {
  hasPermission: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  hasPermission, 
  children, 
  fallback 
}) => {
  if (hasPermission) {
    return <>{children}</>;
  }

  return fallback ? (
    <>{fallback}</>
  ) : (
    <div className="bg-gray-50 p-8 rounded-md border border-gray-200 text-center">
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-full bg-gray-100">
          <LockKeyhole className="h-6 w-6 text-gray-400" />
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">Access Restricted</h3>
      <p className="text-sm text-gray-500">
        You don't have permission to access this content.
      </p>
    </div>
  );
};

export default PermissionGuard;
