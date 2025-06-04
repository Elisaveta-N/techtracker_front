import axios, { AxiosError, AxiosResponse } from "axios";
import { Department, Asset, Employee } from "../models/types";

// Initialize localStorage with default data if empty
const initializeStorage = () => {
  // Departments
  if (!localStorage.getItem("departments")) {
    const defaultDepartments: Department[] = [
      {
        id: "1",
        name: "IT",
        description: "Information Technology Department",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "HR",
        description: "Human Resources Department",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem("departments", JSON.stringify(defaultDepartments));
  }

  // Assets
  if (!localStorage.getItem("assets")) {
    const defaultAssets: Asset[] = [
      {
        id: "1",
        assetModel: "Dell XPS 15",
        assetSN: "DL-XPS-1234",
        assetType: "laptop",
        assetStatus: "inOperation",
        assetInventoryNumber: "INV-001",
        employee: "John Doe",
        purchaseDate: "2023-01-15",
        purchasePrice: 1299.99,
        departmentId: "1",
        notes: "New developer laptop",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        assetModel: "iPhone 13",
        assetSN: "IP-13-5678",
        assetType: "smartphone",
        assetStatus: "inOperation",
        assetInventoryNumber: "INV-002",
        employee: "Jane Smith",
        purchaseDate: "2023-02-20",
        purchasePrice: 899.99,
        departmentId: "2",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        assetModel: "Dell U2720Q Monitor",
        assetSN: "DL-U27-5432",
        assetType: "monitor",
        assetStatus: "inStock",
        assetInventoryNumber: "INV-003",
        purchaseDate: "2023-03-05",
        purchasePrice: 499.99,
        departmentId: "1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "4",
        assetModel: "Dell WD19TB Dock",
        assetSN: "DL-WD19-7890",
        assetType: "dockstation",
        assetStatus: "inRepaire",
        assetInventoryNumber: "INV-004",
        notes: "USB ports not working",
        purchaseDate: "2022-11-10",
        purchasePrice: 249.99,
        departmentId: "1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "5",
        assetModel: "HP EliteDesk 800",
        assetSN: "HP-800-1111",
        assetType: "computer",
        assetStatus: "writeOff",
        assetInventoryNumber: "INV-005",
        notes: "Outdated hardware",
        purchaseDate: "2019-05-15",
        purchasePrice: 799.99,
        departmentId: "2",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem("assets", JSON.stringify(defaultAssets));
  }

  // Employees
  if (!localStorage.getItem("employees")) {
    const defaultEmployees: Employee[] = [
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@company.com",
        position: "Software Developer",
        departmentId: "1",
        hireDate: "2022-03-10",
        phone: "555-123-4567",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@company.com",
        position: "HR Manager",
        departmentId: "2",
        hireDate: "2021-06-15",
        phone: "555-987-6543",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem("employees", JSON.stringify(defaultEmployees));
  }
};

// Generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Department operations
export const getDepartments = async (): Promise<Department[]> => {
  // initializeStorage();
  // return JSON.parse(localStorage.getItem('departments') || '[]');
  try {
    const response = await axios.get(`http://localhost:3500/department`);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(err?.message || "Failed to get data");
    } else {
      console.log(`JS error: ${err}`);
    }
  }
  return [];
};

export const getDepartmentById = (id: string): Department | undefined => {
  const departments = getDepartments();
  return departments.find((dept) => dept.id === id);
};

export const createDepartment = async (
  dep: Omit<Department, "id" | "createdAt" | "updatedAt">
): Promise<Department | null> => {
  // const departments = await getDepartments();
  // const newDepartment: Department = {
  //   ...department,
  //   id: generateId(),
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // };

  // departments.push(newDepartment);
  // localStorage.setItem('departments', JSON.stringify(departments));
  // return newDepartment;
  try {
    const payload = {
      department: {
        depName: dep.name,
      },
    };
    const response = await axios.post(
      "http://localhost:3500/department",
      payload,
      {
        withCredentials: true,
      }
    );

    if (response.status === 201) {
      const newDepartment: Department = {
        id: response.data.id.toString(),
        name: response.data.depName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newDepartment;
    }
  } catch (err) {
    console.error(`Failed to delete department: ${err}`);
  }
  return null;
};

export const updateDepartment = async (
  id: string,
  departmentData: Partial<Department>
): Promise<Department | null> => {
  // const departments = await getDepartments();
  // const index = departments.findIndex((dept) => dept.id === id);

  // if (index === -1) return null;

  // departments[index] = {
  //   ...departments[index],
  //   ...departmentData,
  //   updatedAt: new Date().toISOString(),
  // };

  // localStorage.setItem("departments", JSON.stringify(departments));
  // return departments[index];
  try {
    const payload = {
      department: {
        depName: departmentData.name,
      },
    };
    const response = await axios.patch(
      `http://localhost:3500/department/${id}`,
      payload,
      {
        withCredentials: true,
      }
    );

    if (response.status === 201) {
      const newDepartment: Department = {
        id: response.data.id.toString(),
        name: response.data.depName,
        updatedAt: new Date().toISOString(),
      };
      return newDepartment;
    }
  } catch (err) {
    console.error(`Failed to patch department: ${err}`);
  }
  return null;
};

export const deleteDepartment = async (id: string): Promise<boolean> => {
  // const departments = getDepartments();
  // const newDepartments = departments.filter((dept) => dept.id !== id);

  // if (newDepartments.length === departments.length) return false;

  // localStorage.setItem("departments", JSON.stringify(newDepartments));
  // return true;
  try {
    const response = await axios.delete(
      `http://localhost:3500/department/${id}`,
      {
        withCredentials: true,
      }
    );
    if (response.status === 204) {
      return true;
    }
  } catch (err) {
    console.error(`Failed to delete department: ${err}`);
  }
  return false;
};

// Asset operations
export const getAssets = async (): Promise<Asset[]> => {
  // initializeStorage();
  // return JSON.parse(localStorage.getItem("assets") || "[]");
  try {
    const response = await axios.get(`http://localhost:3500/asset`);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(err?.message || "Failed to get data");
    } else {
      console.log(`JS error: ${err}`);
    }
  }
  return [];
};

export const getAssetById = async (id: string): Promise<Asset | undefined> => {
  const assets = await getAssets();
  return assets.find((asset) => asset.id === id);
};

export const createAsset = async (
  asset: Omit<Asset, "id" | "createdAt" | "updatedAt">
): Promise<Asset | null> => {
  // const assets = getAssets();
  // const newAsset: Asset = {
  //   ...asset,
  //   id: generateId(),
  //   assetType: asset.assetType as
  //     | "computer"
  //     | "smartphone"
  //     | "dockstation"
  //     | "laptop"
  //     | "monitor",
  //   assetStatus: asset.assetStatus as
  //     | "inOperation"
  //     | "inRepaire"
  //     | "inStock"
  //     | "writeOff",
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // };

  // assets.push(newAsset);
  // localStorage.setItem("assets", JSON.stringify(assets));
  // return newAsset;
  console.log(JSON.stringify(asset));

  try {
    let payload = {
      asset: {
        assetModel: asset.assetModel,
        assetType: asset.assetType,
        assetSN: asset.assetSN,
        assetStatus: asset.assetStatus,
        assetInvenrotyNumber: asset.assetInventoryNumber,
        employeeId: asset?.employeeId,
      },
    };

    console.log(JSON.stringify(payload))

    // const response = await axios.post("http://localhost:3500/asset", payload, {
    //   withCredentials: true,
    // });

    // if (response.status === 201) {
    //   const newAsset: Asset = {
    //     ...response.data,
    //   };
    //   return newAsset;
    // }
  } catch (err) {
    console.error(`Failed to delete department: ${err}`);
  }
  return null;
};

export const updateAsset = (
  id: string,
  assetData: Partial<Asset>
): Asset | null => {
  const assets = getAssets();
  const index = assets.findIndex((asset) => asset.id === id);

  if (index === -1) return null;

  assets[index] = {
    ...assets[index],
    ...assetData,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem("assets", JSON.stringify(assets));
  return assets[index];
};

export const deleteAsset = (id: string): boolean => {
  const assets = getAssets();
  const newAssets = assets.filter((asset) => asset.id !== id);

  if (newAssets.length === assets.length) return false;

  localStorage.setItem("assets", JSON.stringify(newAssets));
  return true;
};

// Employee operations
export const getEmployees = async (): Promise<Employee[]> => {
  // initializeStorage();
  // return JSON.parse(localStorage.getItem("employees") || "[]");
  try {
    const response = await axios.get(`http://localhost:3500/employee`);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(err?.message || "Failed to get data");
    } else {
      console.log(`JS error: ${err}`);
    }
  }
  return [];
};

export const getEmployeeById = async (
  id: string
): Promise<Employee | undefined> => {
  // const employees = getEmployees();
  // return employees.find((emp) => emp.id === id);
  try {
    const response = await axios.get(`http://localhost:3500/employee/${id}`);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(err?.message || "Failed to get data");
    } else {
      console.log(`JS error: ${err}`);
    }
  }
  return;
};

export const createEmployee = async (
  emp: Omit<Employee, "id" | "createdAt" | "updatedAt">
): Promise<Employee | null> => {
  // const employees = getEmployees();
  // const newEmployee: Employee = {
  //   ...employee,
  //   id: generateId(),
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // };

  // employees.push(newEmployee);
  // localStorage.setItem("employees", JSON.stringify(employees));
  // return newEmployee;
  try {
    const payload = {
      employee: {
        firstName: emp.firstName,
        lastName: emp.lastName,
        departmentId: emp.departmentId,
      },
    };
    const response = await axios.post(
      "http://localhost:3500/employee",
      payload,
      {
        withCredentials: true,
      }
    );

    if (response.status === 201) {
      return response.data;
    }
  } catch (err) {
    console.error(`Failed to create employee: ${err}`);
  }
  return null;
};

export const updateEmployee = async (
  id: string,
  employeeData: Partial<Employee>
): Promise<Employee | null> => {
  // const employees = getEmployees();
  // const index = employees.findIndex((emp) => emp.id === id);

  // if (index === -1) return null;

  // employees[index] = {
  //   ...employees[index],
  //   ...employeeData,
  //   updatedAt: new Date().toISOString(),
  // };

  // localStorage.setItem("employees", JSON.stringify(employees));
  // return employees[index];
  try {
    const payload = {
      employee: {
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        departmentId: employeeData.departmentId,
      },
    };
    const response = await axios.patch(
      `http://localhost:3500/employee/${id}`,
      payload,
      {
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      return response.data;
    }
  } catch (err) {
    console.error(`Failed to create employee: ${err}`);
  }
  return null;
};

export const deleteEmployee = async (id: string): Promise<boolean> => {
  // const employees = getEmployees();
  // const newEmployees = employees.filter((emp) => emp.id !== id);

  // if (newEmployees.length === employees.length) return false;

  // localStorage.setItem("employees", JSON.stringify(newEmployees));
  // return true;
  try {
    const response = await axios.delete(
      `http://localhost:3500/employee/${id}`,
      {
        withCredentials: true,
      }
    );
    if (response.status === 204) {
      return true;
    }
  } catch (err) {
    console.error(`Failed to delete employee: ${err}`);
  }
  return false;
};
