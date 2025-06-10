import React, { useState, useEffect } from 'react';
import { AlarmClock, Briefcase, FilePen, Filter, Mail, Phone, Plus, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Employee, Department } from '../models/types';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, getDepartments } from '../utils/dataService';
import { useAuth } from '../contexts/AuthContext';
// import PermissionGuard from '../components/PermissionGuard';

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Partial<Employee>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState<string>('');
  // const { currentUser, canAddEmployee, canEditEmployee, canViewEmployee } = useAuth();
  const { canAddEmployee, canEditEmployee, canViewEmployee } = useAuth();

  // useEffect(() => {
  //   loadData();
  // }, []);
    useEffect(() => {
      (async () => {
        await loadData();
      })();
    }, []);

  const loadData = async () => {
    setEmployees(await getEmployees());
    setDepartments(await getDepartments());
  };

  const openAddModal = () => {
    setCurrentEmployee({});
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (employee: Employee) => {
    setCurrentEmployee(employee);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentEmployee({ ...currentEmployee, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentEmployee.firstName || !currentEmployee.lastName || !currentEmployee.email || !currentEmployee.position || !currentEmployee.departmentId) return;
    
    if (isEditing && currentEmployee.id) {
      await updateEmployee(currentEmployee.id, currentEmployee);
    } else {
      await createEmployee({
        firstName: currentEmployee.firstName as string,
        lastName: currentEmployee.lastName as string,
        email: currentEmployee.email as string,
        position: currentEmployee.position as string,
        departmentId: currentEmployee.departmentId as string,
        hireDate: currentEmployee.hireDate,
        phone: currentEmployee.phone,
      });
    }
    
    setIsModalOpen(false);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      await deleteEmployee(id);
      await loadData();
    }
  };

  // Get department name by ID
  const getDepartmentName = (departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    return department?.name || 'Unknown';
  };

  return (
    <div>
      <PageHeader 
        title="Employees" 
        subtitle="Manage your organization's employees"
        actionButton={
          canAddEmployee ? (
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </button>
          ) : null
        }
      />

      {/* Department Filter */}
      <div className="bg-white p-4 mb-4 rounded-md shadow flex flex-wrap gap-4 items-center">
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-sm font-medium">Filter by Department:</span>
        </div>
        
        <div>
          <select
            className="border border-gray-300 rounded-md text-sm p-1.5"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {employees.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No employees found. Click "Add Employee" to create one.
            </li>
          ) : (
            employees
              .filter(employee => canViewEmployee(employee.id))
              .filter(employee => !filterDepartment || employee.departmentId === filterDepartment)
              .map((employee) => (
              <li key={employee.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{employee.position}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-gray-500">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {getDepartmentName(employee.departmentId)}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Mail className="h-4 w-4 mr-1" />
                        {employee.email}
                      </div>
                      {employee.phone && (
                        <div className="flex items-center text-gray-500">
                          <Phone className="h-4 w-4 mr-1" />
                          {employee.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {/* {canEditEmployee(employee.id) ? ( */}
                    {canEditEmployee() ? (
                      <>
                        <button
                          onClick={() => openEditModal(employee)}
                          className="p-2 text-gray-400 hover:text-green-600 rounded-full hover:bg-gray-100"
                        >
                          <FilePen className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(employee.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <div className="p-2 text-gray-400">
                        {/* <AlarmClock className="h-5 w-5" title="Read-only access" /> */}
                        <AlarmClock className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {isEditing ? 'FilePen Employee' : 'Add Employee'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    required
                    value={currentEmployee.firstName || ''}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    style={{ padding: '0.5rem', border: '1px solid #d1d5db' }}
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    required
                    value={currentEmployee.lastName || ''}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    style={{ padding: '0.5rem', border: '1px solid #d1d5db' }}
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={currentEmployee.email || ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db' }}
                />
              </div>
              
              <div className="mt-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={currentEmployee.phone || ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db' }}
                />
              </div>
              
              <div className="mt-4">
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                  Position <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="position"
                  id="position"
                  required
                  value={currentEmployee.position || ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db' }}
                />
              </div>
              
              <div className="mt-4">
                <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  name="departmentId"
                  id="departmentId"
                  required
                  value={currentEmployee.departmentId || ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db' }}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="mt-4">
                <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Hire Date
                </label>
                <input
                  type="date"
                  name="hireDate"
                  id="hireDate"
                  value={currentEmployee.hireDate || ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db' }}
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {isEditing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;
