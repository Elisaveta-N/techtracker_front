import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
// import { getDepartments, getEmployees, getAssets } from "../utils/dataService";
import {getEmployees, getAssets } from "../utils/dataService";
import api from '../utils/api';

export type UserRole = "USER" | "MANAGER" | "ADMIN";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: string;
  role: UserRole;
  position: string;
}

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  // canViewAsset: (assetId: string) => boolean;
  canViewAsset: (assetId: string) => Promise<boolean>;
  // canEditAsset: (assetId: string) => boolean;
  canEditAsset: ()=> boolean;
  canViewDepartment: (departmentId: string) => boolean;
  // canEditDepartment: (departmentId: string) => boolean;
  canEditDepartment: ()=> boolean;
  // canViewEmployee: (employeeId: string) => boolean;
  canViewEmployee: (employeeId: string) => Promise<boolean>;
  // canEditEmployee: (employeeId: string) => boolean;
  canEditEmployee:()=> boolean;
  canAddAsset: boolean;
  canAddDepartment: boolean;
  canAddEmployee: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const predefinedUsers: User[] = [];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users] = useState<User[]>(predefinedUsers);

  // Check for stored user in localStorage
  useEffect(() => {
    (async () => {
      try {
        const response2 = await api.get<User>(
          `/user/detailes`,
          {
            withCredentials: true,
          }
        );
        if(response2.status === 200) {
          if(!currentUser || (currentUser.id !== response2.data.id) || (currentUser.role !== response2.data.role)){
            setCurrentUser(response2.data);
          }          
        }        
      } catch (error) {
        console.error("Fetch error:", error);
      }
    })();
  }, [currentUser, users]);

  // Check if user can view an asset
  const canViewAsset = async (assetId: string): Promise<boolean> => {
    if (!currentUser) return false;

    // Admin can view all
    if (currentUser.role === "ADMIN") return true;

    const assets = await getAssets();
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return false;

    // Manager can view assets in their department
    if (currentUser.role === "MANAGER") {
      const employees = await getEmployees();
      const departmentEmployees = employees.filter(
        (e) => e.departmentId === currentUser.departmentId
      );

      // Check if asset belongs to an employee in manager's department
      if (asset.departmentId === currentUser.departmentId) return true;

      // Check if asset is assigned to an employee in manager's department
      if (asset.employee) {
        return departmentEmployees.some((e) =>
          asset.employee?.includes(`${e.firstName} ${e.lastName}`)
        );
      }

      return false;
    }

    // Regular user can only view their assigned assets
    if (currentUser.role === "USER") {
      return (
        asset.employee?.includes(
          `${currentUser.firstName} ${currentUser.lastName}`
        ) || false
      );
    }

    return false;
  };

  // Check if user can edit an asset
  // const canEditAsset = (assetId: string): boolean => {
  const canEditAsset = (): boolean => {
    if (!currentUser) return false;
    return currentUser.role === "ADMIN";
  };

  // Check if user can view a department
  const canViewDepartment = (departmentId: string): boolean => {
    if (!currentUser) return false;

    // Admin can view all departments
    if (currentUser.role === "ADMIN") return true;

    // Manager can view their department
    if (currentUser.role === "MANAGER") {
      return currentUser.departmentId === departmentId;
    }

    // User can view their department
    return currentUser.departmentId === departmentId;
  };

  // Check if user can edit a department
  // const canEditDepartment = (departmentId: string): boolean => {
  const canEditDepartment = (): boolean => {
    if (!currentUser) return false;
    return currentUser.role === "ADMIN";
  };

  // Check if user can view an employee
  const canViewEmployee = async (employeeId: string): Promise<boolean> => {
    if (!currentUser) return false;

    // Admin can view all employees
    if (currentUser.role === "ADMIN") return true;

    const employees = await getEmployees();
    const employee = employees.find((e) => e.id === employeeId);
    if (!employee) return false;

    // Manager can view employees in their department
    if (currentUser.role === "MANAGER") {
      return employee.departmentId === currentUser.departmentId;
    }

    // User can only view themselves
    return (
      `${currentUser.firstName} ${currentUser.lastName}` ===
      `${employee.firstName} ${employee.lastName}`
    );
  };

  // Check if user can edit an employee
  // const canEditEmployee = (employeeId: string): boolean => {
  const canEditEmployee = (): boolean => {
    if (!currentUser) return false;
    return currentUser.role === "ADMIN";
  };

  // Check if user can add assets, departments, or employees
  const canAddAsset = currentUser?.role === "ADMIN";
  const canAddDepartment = currentUser?.role === "ADMIN";
  const canAddEmployee = currentUser?.role === "ADMIN";

  // Function to handle logout
  const logout = async () => {
    localStorage.removeItem("currentUserId");
    try{
        await api.get(`/logout`, {
          withCredentials: true,
          // headers: {
          //     'Referer': 'https://techtrackr.netlify.app'
          // }

      });
    } catch (err) {
      console.error(`logout error: ${JSON.stringify(err)}`)
    } finally {

    }
  
    setCurrentUser(null);
  };

  // When user changes, store in localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUserId", currentUser.id);
    }
  }, [currentUser]);

  const value = {
    currentUser,
    setCurrentUser,
    users,
    canViewAsset,
    canEditAsset,
    canViewDepartment,
    canEditDepartment,
    canViewEmployee,
    canEditEmployee,
    canAddAsset,
    canAddDepartment,
    canAddEmployee,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
