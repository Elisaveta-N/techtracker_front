import React, { useState, useEffect } from 'react';
import { AlertTriangle, Pencil, Plus, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Department } from '../models/types';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../utils/dataService';
import { useAuth } from '../contexts/AuthContext';
import PermissionGuard from '../components/PermissionGuard';

const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Partial<Department>>({});
  const [isEditing, setIsEditing] = useState(false);
  const { currentUser, canAddDepartment, canEditDepartment, canViewDepartment } = useAuth();

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    const depts = await getDepartments();
    setDepartments(depts);
  };

  const openAddModal = () => {
    setCurrentDepartment({});
    setIsEditing(false);
    setNameError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (department: Department) => {
    setCurrentDepartment(department);
    setIsEditing(true);
    setNameError(null);
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentDepartment({ ...currentDepartment, [name]: value });
  };

  const [nameError, setNameError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentDepartment.name) return;
    
    // Check for duplicate department name
    const isDuplicate = departments.some(dept => 
      dept.name.toLowerCase() === currentDepartment.name?.toLowerCase() && 
      (!isEditing || dept.id !== currentDepartment.id)
    );
    
    if (isDuplicate) {
      setNameError("A department with this name already exists. Please choose a different name.");
      return;
    }
    
    setNameError(null);
    
    if (isEditing && currentDepartment.id) {
      await updateDepartment(currentDepartment.id, currentDepartment);
    } else {
      await createDepartment({
        name: currentDepartment.name as string,
        description: currentDepartment.description,
      });
    }
    
    setIsModalOpen(false);
    loadDepartments();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      await deleteDepartment(id);
      loadDepartments();
    }
  };

  return (
    <div>
      <PageHeader 
        title="Departments" 
        subtitle="Manage your organization's departments"
        actionButton={
          canAddDepartment ? (
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </button>
          ) : null
        }
      />

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {departments.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No departments found. Click "Add Department" to create one.
            </li>
          ) : (
            departments
              .filter(department => canViewDepartment(department.id))
              .map((department) => (
              <li key={department.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{department.name}</h3>
                    {department.description && (
                      <p className="text-sm text-gray-500">{department.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {canEditDepartment(department.id) ? (
                      <>
                        <button
                          onClick={() => openEditModal(department)}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(department.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <div className="p-2 text-gray-400">
                        <AlertTriangle className="h-5 w-5" title="Read-only access" />
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {isEditing ? 'Pencil Department' : 'Add Department'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={currentDepartment.name || ''}
                  onChange={(e) => {
                    handleInputChange(e);
                    setNameError(null); // Clear error when input changes
                  }}
                  className={`w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    nameError ? 'border-red-300' : 'border-gray-300'
                  }`}
                  style={{ padding: '0.5rem', border: nameError ? '1px solid #f87171' : '1px solid #d1d5db' }}
                />
                {nameError && (
                  <p className="mt-1 text-sm text-red-600">{nameError}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={currentDepartment.description || ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db' }}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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

export default DepartmentsPage;
