// Initialize localStorage with default data if empty
const initializeStorage = () => {
  // Departments
  if (!localStorage.getItem('departments')) {
    const defaultDepartments = [
      {
        id: '1',
        name: 'IT',
        description: 'Information Technology Department',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'HR',
        description: 'Human Resources Department',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem('departments', JSON.stringify(defaultDepartments));
  }

  // Assets
  if (!localStorage.getItem('assets')) {
    const defaultAssets = [
      {
        id: '1',
        assetModel: 'Dell XPS 15',
        assetSN: 'DL-XPS-1234',
        assetType: 'laptop',
        assetStatus: 'inOperation',
        assetInventoryNumber: 'INV-001',
        employee: 'John Doe',
        purchaseDate: '2023-01-15',
        purchasePrice: 1299.99,
        departmentId: '1',
        notes: 'New developer laptop',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        assetModel: 'iPhone 13',
        assetSN: 'IP-13-5678',
        assetType: 'smartphone',
        assetStatus: 'inOperation',
        assetInventoryNumber: 'INV-002',
        employee: 'Jane Smith',
        purchaseDate: '2023-02-20',
        purchasePrice: 899.99,
        departmentId: '2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        assetModel: 'Dell U2720Q Monitor',
        assetSN: 'DL-U27-5432',
        assetType: 'monitor',
        assetStatus: 'inStock',
        assetInventoryNumber: 'INV-003',
        purchaseDate: '2023-03-05',
        purchasePrice: 499.99,
        departmentId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        assetModel: 'Dell WD19TB Dock',
        assetSN: 'DL-WD19-7890',
        assetType: 'dockstation',
        assetStatus: 'inRepaire',
        assetInventoryNumber: 'INV-004',
        notes: 'USB ports not working',
        purchaseDate: '2022-11-10',
        purchasePrice: 249.99,
        departmentId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '5',
        assetModel: 'HP EliteDesk 800',
        assetSN: 'HP-800-1111',
        assetType: 'computer',
        assetStatus: 'writeOff',
        assetInventoryNumber: 'INV-005',
        notes: 'Outdated hardware',
        purchaseDate: '2019-05-15',
        purchasePrice: 799.99,
        departmentId: '2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
    localStorage.setItem('assets', JSON.stringify(defaultAssets));
  }

  // Employees
  if (!localStorage.getItem('employees')) {
    const defaultEmployees = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        position: 'Software Developer',
        departmentId: '1',
        hireDate: '2022-03-10',
        phone: '555-123-4567',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        position: 'HR Manager',
        departmentId: '2',
        hireDate: '2021-06-15',
        phone: '555-987-6543',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem('employees', JSON.stringify(defaultEmployees));
  }
};

// Generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Department operations
export const getDepartments = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem('departments') || '[]');
};

export const getDepartmentById = (id) => {
  const departments = getDepartments();
  return departments.find(dept => dept.id === id);
};

export const createDepartment = (department) => {
  const departments = getDepartments();
  const newDepartment = {
    ...department,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  departments.push(newDepartment);
  localStorage.setItem('departments', JSON.stringify(departments));
  return newDepartment;
};

export const updateDepartment = (id, departmentData) => {
  const departments = getDepartments();
  const index = departments.findIndex(dept => dept.id === id);
  
  if (index === -1) return null;
  
  departments[index] = {
    ...departments[index],
    ...departmentData,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem('departments', JSON.stringify(departments));
  return departments[index];
};

export const deleteDepartment = (id) => {
  const departments = getDepartments();
  const newDepartments = departments.filter(dept => dept.id !== id);
  
  if (newDepartments.length === departments.length) return false;
  
  localStorage.setItem('departments', JSON.stringify(newDepartments));
  return true;
};

// Asset operations
export const getAssets = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem('assets') || '[]');
};

export const getAssetById = (id) => {
  const assets = getAssets();
  return assets.find(asset => asset.id === id);
};

export const createAsset = (asset) => {
  const assets = getAssets();
  const newAsset = {
    ...asset,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  assets.push(newAsset);
  localStorage.setItem('assets', JSON.stringify(assets));
  return newAsset;
};

export const updateAsset = (id, assetData) => {
  const assets = getAssets();
  const index = assets.findIndex(asset => asset.id === id);
  
  if (index === -1) return null;
  
  assets[index] = {
    ...assets[index],
    ...assetData,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem('assets', JSON.stringify(assets));
  return assets[index];
};

export const deleteAsset = (id) => {
  const assets = getAssets();
  const newAssets = assets.filter(asset => asset.id !== id);
  
  if (newAssets.length === assets.length) return false;
  
  localStorage.setItem('assets', JSON.stringify(newAssets));
  return true;
};

// Employee operations
export const getEmployees = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem('employees') || '[]');
};

export const getEmployeeById = (id) => {
  const employees = getEmployees();
  return employees.find(emp => emp.id === id);
};

export const createEmployee = (employee) => {
  const employees = getEmployees();
  
  // Verify department exists
  const departments = getDepartments();
  const departmentExists = departments.some(dept => dept.id === employee.departmentId);
  
  // If department doesn't exist and we have a department ID, create a placeholder department
  if (employee.departmentId && !departmentExists) {
    console.warn(`Department ID ${employee.departmentId} not found, creating placeholder department`);
    createDepartment({
      id: employee.departmentId,
      name: "Department " + employee.departmentId,
      description: "Auto-created department",
    });
  }
  
  const newEmployee = {
    ...employee,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  employees.push(newEmployee);
  localStorage.setItem('employees', JSON.stringify(employees));
  return newEmployee;
};

export const updateEmployee = (id, employeeData) => {
  const employees = getEmployees();
  const index = employees.findIndex(emp => emp.id === id);
  
  if (index === -1) return null;
  
  // Verify department exists if department is being updated
  if (employeeData.departmentId) {
    const departments = getDepartments();
    const departmentExists = departments.some(dept => dept.id === employeeData.departmentId);
    
    // If department doesn't exist, create a placeholder department
    if (!departmentExists) {
      console.warn(`Department ID ${employeeData.departmentId} not found, creating placeholder department`);
      createDepartment({
        id: employeeData.departmentId,
        name: "Department " + employeeData.departmentId,
        description: "Auto-created department",
      });
    }
  }
  
  employees[index] = {
    ...employees[index],
    ...employeeData,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem('employees', JSON.stringify(employees));
  return employees[index];
};

export const deleteEmployee = (id) => {
  const employees = getEmployees();
  const newEmployees = employees.filter(emp => emp.id !== id);
  
  if (newEmployees.length === employees.length) return false;
  
  localStorage.setItem('employees', JSON.stringify(newEmployees));
  return true;
};
