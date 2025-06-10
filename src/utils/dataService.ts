import { AxiosError } from "axios";
import { Department, Asset, Employee } from "../models/types";
import api from '../utils/api';


// Department operations
export const getDepartments = async (): Promise<Department[]> => {
  // initializeStorage();
  // return JSON.parse(localStorage.getItem('departments') || '[]');
  try {
    const response = await api.get(`/department`, {
      withCredentials: true,
    });
    return response.data as Department[];
  } catch (err) {
    if (err instanceof AxiosError) {
      const errorMessage = err.response?.data?.message || err.message || "Failed in getDepartments";
      console.log(errorMessage);
    } else {
      console.log(JSON.stringify(err))
    }
  }
  return [];
};

export const getDepartmentById = async (id: string): Promise<Department | undefined> => {
  const departments = await getDepartments();
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
    const response = await api.post(
      "/department",
      payload,
      {
        withCredentials: true,
      }
    );

    if (response.status === 201) {
      const newDepartment: Department = {
        id: (response.data as { id: number }).id.toString(),
        name: (response.data as { depName: string }).depName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newDepartment;
    }
  } catch (err) {
    console.error(`Failed to create department: ${err}`);
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
    const response = await api.patch(
      `/department/${id}`,
      payload,
      {
        withCredentials: true,
      }
    );
   

    if (response.status === 201) {
      const newDepartment: Department = {
        id: (response.data as { id: number }).id.toString(),
        name: (response.data as { depName: string }).depName,
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
    const response = await api.delete(
      `/department/${id}`,
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
    const response = await api.get(`/asset`, {
        withCredentials: true,
      });
    return response.data as Asset[];
  } catch (err) {
    if (err instanceof AxiosError) {
      const errorMessage = err.response?.data?.message || err.message || "Failed in get Assets";
      console.log(errorMessage);
    } else {
      console.log(JSON.stringify(err))
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

    const response = await api.post("/asset", payload, {
      withCredentials: true,
    });

    if (response.status === 201) {
      return response.data as Asset;
    }
  } catch (err) {
    console.error(`Failed to create an asset: ${err}`);
  }
  return null;
};

export const updateAsset = async (
  id: string,
  assetData: Partial<Asset>
): Promise<Asset | null> => {
  // const assets = getAssets();
  // const index = assets.findIndex((asset) => asset.id === id);

  // if (index === -1) return null;

  // assets[index] = {
  //   ...assets[index],
  //   ...assetData,
  //   updatedAt: new Date().toISOString(),
  // };

  // localStorage.setItem("assets", JSON.stringify(assets));
  // return assets[index];
    console.log(JSON.stringify(assetData));

  try {
    // let payload = {
    //   asset: {
    //     id: assetData.id,
    //     assetModel: assetData.assetModel,
    //     assetType: assetData.assetType,
    //     assetSN: assetData.assetSN,
    //     assetStatus: assetData.assetStatus,
    //     assetInvenrotyNumber: assetData.assetInventoryNumber,
    //     employeeId: assetData?.employeeId,
    //   },
    // };
    let payload = {asset: {...assetData}}

    console.log(JSON.stringify(payload))

    const response = await api.patch(`/asset/${id}`, payload, {
      withCredentials: true,
    });

    if (response.status === 201) {
      return response.data as Asset;
    }
  } catch (err) {
    console.error(`Failed to create an asset: ${err}`);
  }
  return null;
};

export const deleteAsset = async (id: string): Promise<boolean> => {
  // const assets = getAssets();
  // const newAssets = assets.filter((asset) => asset.id !== id);

  // if (newAssets.length === assets.length) return false;

  // localStorage.setItem("assets", JSON.stringify(newAssets));
  // return true;
    try {
    const response = await api.delete(
      `/asset/${id}`,
      {
        withCredentials: true,
      }
    );
    if (response.status === 204) {
      return true;
    }
  } catch (err) {
    console.error(`Failed to delete asset: ${err}`);
  }
  return false;
};

// Employee operations
export const getEmployees = async (): Promise<Employee[]> => {
  // initializeStorage();
  // return JSON.parse(localStorage.getItem("employees") || "[]");
  try {
    const response = await api.get(`/employee`, {
      withCredentials: true,
    });
    return response.data as Employee[];
  } catch (err) {
    if (err instanceof AxiosError) {
      const errorMessage = err.response?.data?.message || err.message || "Failed in getEmployees";
      console.log(errorMessage);
    } else {
      console.log(JSON.stringify(err))
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
    const response = await api.get(`/employee/${id}`, {
      withCredentials: true,
    });
    return response.data as Employee;
  } catch (err) {
    if (err instanceof AxiosError) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to login data";
      console.log(errorMessage);
    } else {
      console.log(JSON.stringify(err))
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
    const response = await api.post(
      "/employee",
      payload,
      {
        withCredentials: true,
      }
    );

    if (response.status === 201) {
      return response.data as Employee;
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
    const response = await api.patch(
      `/employee/${id}`,
      payload,
      {
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      return response.data as Employee;
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
    const response = await api.delete(
      `/employee/${id}`,
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
