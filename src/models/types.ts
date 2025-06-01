export interface Department {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  assetModel: string;
  employee?: string;
  assetType: 'computer' | 'smartphone' | 'dockstation' | 'laptop' | 'monitor';
  assetSN: string;
  assetStatus: 'inOperation' | 'inRepaire' | 'inStock' | 'writeOff';
  assetInventoryNumber: string;
  departmentId?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  departmentId: string;
  hireDate?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}
