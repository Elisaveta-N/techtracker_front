import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Briefcase, House, LogOut, Menu, Monitor, Users, X } from 'lucide-react';
import './index.css';
import DepartmentsPage from './pages/DepartmentsPage';
import AssetsPage from './pages/AssetsPage';
import EmployeesPage from './pages/EmployeesPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage.tsx';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Navigation component with logout functionality
const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg mr-2">
                <Monitor className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                ITAssetHub
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <House className="w-4 h-4 mr-1" />
              Home
            </Link>
            
            {/* Only MANAGER and ADMIN can see Departments */}
            {(currentUser.role === 'MANAGER' || currentUser.role === 'ADMIN') && (
              <Link to="/departments" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                Departments
              </Link>
            )}
            
            {/* All roles can see Assets, but with different permissions */}
            <Link to="/assets" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <Monitor className="w-4 h-4 mr-1" />
              Assets
            </Link>
            
            {/* Only MANAGER and ADMIN can see Employees */}
            {(currentUser.role === 'MANAGER' || currentUser.role === 'ADMIN') && (
              <Link to="/employees" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Employees
              </Link>
            )}
            
            <button 
              onClick={logout}
              className="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" 
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <House className="w-5 h-5 mr-2" />
                Home
              </div>
            </Link>
            
            {/* Only MANAGER and ADMIN can see Departments */}
            {(currentUser.role === 'MANAGER' || currentUser.role === 'ADMIN') && (
              <Link to="/departments" 
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Departments
                </div>
              </Link>
            )}
            
            <Link to="/assets" 
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Monitor className="w-5 h-5 mr-2" />
                Assets
              </div>
            </Link>
            
            {/* Only MANAGER and ADMIN can see Employees */}
            {(currentUser.role === 'MANAGER' || currentUser.role === 'ADMIN') && (
              <Link to="/employees" 
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Employees
                </div>
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="text-gray-600 hover:text-red-600 hover:bg-gray-50 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
            >
              <div className="flex items-center">
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </div>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export function App() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

// Separate component for routes to use the auth context
const AppRoutes = () => {
  const { currentUser } = useAuth();

  return (
    <>
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/login" element={!currentUser ? <LoginPage /> : <Navigate to="/" />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          
          <Route path="/departments" element={
            <ProtectedRoute>
              <DepartmentsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/assets" element={
            <ProtectedRoute>
              <AssetsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/employees" element={
            <ProtectedRoute>
              <EmployeesPage />
            </ProtectedRoute>
          } />
          
          {/* Redirect to login if no matching route and not logged in */}
          <Route path="*" element={<Navigate to={currentUser ? "/" : "/login"} />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
