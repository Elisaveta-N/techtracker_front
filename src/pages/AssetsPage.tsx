import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Filter,
  Pencil,
  Plus,
  Squircle,
  Trash2,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { Asset, Department, Employee } from "../models/types";
import {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
  getDepartments,
  getEmployees,
} from "../utils/dataService";
import { useAuth } from "../contexts/AuthContext";
import PermissionGuard from "../components/PermissionGuard";

const AssetsPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<Partial<Asset>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [sortField, setSortField] = useState<keyof Asset>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const { currentUser, canAddAsset, canEditAsset } = useAuth();

  const [employees, setEmployees] = useState<Employee[]>([]);

  // useEffect(() => {
  //   loadData();
  // }, []);
  useEffect(() => {
    (async () => {
      await loadData();
    })();
  }, []);

  const loadData = async () => {
    setAssets(await getAssets());
    setDepartments(await getDepartments());
    setEmployees(await getEmployees());
  };

  const openAddModal = () => {
    setCurrentAsset({ assetStatus: "inStock", assetType: "laptop" });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (asset: Asset) => {
    setCurrentAsset(asset);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentAsset({ ...currentAsset, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !currentAsset.assetModel ||
      !currentAsset.assetSN ||
      !currentAsset.assetType ||
      !currentAsset.assetStatus ||
      !currentAsset.assetInventoryNumber
    )
      return;

    if (isEditing && currentAsset.id) {
      updateAsset(currentAsset.id, currentAsset);
    } else {
      await createAsset({
        assetModel: currentAsset.assetModel as string,
        assetSN: currentAsset.assetSN as string,
        assetType: currentAsset.assetType as
          | "computer"
          | "smartphone"
          | "dockstation"
          | "laptop"
          | "monitor",
        assetStatus: currentAsset.assetStatus as
          | "inOperation"
          | "inRepaire"
          | "inStock"
          | "writeOff",
        assetInventoryNumber: currentAsset.assetInventoryNumber as string,
        employee: currentAsset.employee,
        departmentId: currentAsset.departmentId,
        purchaseDate: currentAsset.purchaseDate,
        purchasePrice: currentAsset.purchasePrice
          ? Number(currentAsset.purchasePrice)
          : undefined,
        notes: currentAsset.notes,
      });
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      deleteAsset(id);
      loadData();
    }
  };

  const handleSort = (field: keyof Asset) => {
    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "inOperation":
        return "bg-green-100 text-green-800";
      case "inRepaire":
        return "bg-yellow-100 text-yellow-800";
      case "inStock":
        return "bg-blue-100 text-blue-800";
      case "writeOff":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "inOperation":
        return "In Operation";
      case "inRepaire":
        return "In Repair";
      case "inStock":
        return "In Stock";
      case "writeOff":
        return "Write Off";
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "computer":
        return "Computer";
      case "smartphone":
        return "Smartphone";
      case "dockstation":
        return "Dock Station";
      case "laptop":
        return "Laptop";
      case "monitor":
        return "Monitor";
      default:
        return type;
    }
  };

  // Filter assets based on user permissions
  const filterAssetsByPermission = (assets: Asset[]): Asset[] => {
    if (!currentUser) return [];

    if (currentUser.role === "ADMIN") {
      return assets;
    }

    if (currentUser.role === "MANAGER") {
      // Manager can see assets from their department
      return assets.filter(
        async (asset) =>
          asset.departmentId === currentUser.departmentId ||
          (asset.employee &&
            (await getEmployees()).some(
              (emp) =>
                emp.departmentId === currentUser.departmentId &&
                asset.employee?.includes(`${emp.firstName} ${emp.lastName}`)
            ))
      );
    }

    if (currentUser.role === "USER") {
      // User can only see their assigned assets
      return assets.filter((asset) =>
        asset.employee?.includes(
          `${currentUser.firstName} ${currentUser.lastName}`
        )
      );
    }

    return [];
  };

  // Sort and filter assets
  const sortedAndFilteredAssets = filterAssetsByPermission(assets)
    .filter((asset) => !filterType || asset.assetType === filterType)
    .filter((asset) => !filterStatus || asset.assetStatus === filterStatus)
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const getDepartmentName = (departmentId?: string) => {
    if (!departmentId) return "N/A";
    const department = departments.find((dept) => dept.id === departmentId);
    return department?.name || "Unknown";
  };

  return (
    <div>
      <PageHeader
        title="Assets"
        subtitle="Manage your IT equipment and assets"
        actionButton={
          canAddAsset ? (
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </button>
          ) : null
        }
      />

      {/* Filters */}
      <div className="bg-white p-4 mb-4 rounded-md shadow flex flex-wrap gap-4 items-center">
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <div>
          <select
            className="border border-gray-300 rounded-md text-sm p-1.5"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="computer">Computer</option>
            <option value="smartphone">Smartphone</option>
            <option value="dockstation">Dock Station</option>
            <option value="laptop">Laptop</option>
            <option value="monitor">Monitor</option>
          </select>
        </div>

        <div>
          <select
            className="border border-gray-300 rounded-md text-sm p-1.5"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="inOperation">In Operation</option>
            <option value="inRepaire">In Repair</option>
            <option value="inStock">In Stock</option>
            <option value="writeOff">Write Off</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("assetInventoryNumber")}
                >
                  <div className="flex items-center">
                    Inventory #
                    {sortField === "assetInventoryNumber" &&
                      (sortDirection === "asc" ? (
                        <Squircle className="h-4 w-4 ml-1" />
                      ) : (
                        <Squircle className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("assetModel")}
                >
                  <div className="flex items-center">
                    Model
                    {sortField === "assetModel" &&
                      (sortDirection === "asc" ? (
                        <Squircle className="h-4 w-4 ml-1" />
                      ) : (
                        <Squircle className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("assetSN")}
                >
                  <div className="flex items-center">
                    Serial Number
                    {sortField === "assetSN" &&
                      (sortDirection === "asc" ? (
                        <Squircle className="h-4 w-4 ml-1" />
                      ) : (
                        <Squircle className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("assetType")}
                >
                  <div className="flex items-center">
                    Type
                    {sortField === "assetType" &&
                      (sortDirection === "asc" ? (
                        <Squircle className="h-4 w-4 ml-1" />
                      ) : (
                        <Squircle className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("assetStatus")}
                >
                  <div className="flex items-center">
                    Status
                    {sortField === "assetStatus" &&
                      (sortDirection === "asc" ? (
                        <Squircle className="h-4 w-4 ml-1" />
                      ) : (
                        <Squircle className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Employee
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAndFilteredAssets.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No assets found.
                  </td>
                </tr>
              ) : (
                sortedAndFilteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {asset.assetInventoryNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.assetModel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.assetSN}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getTypeLabel(asset.assetType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          asset.assetStatus
                        )}`}
                      >
                        {getStatusLabel(asset.assetStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.employee || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {canEditAsset(asset.id) ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(asset)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(asset.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end text-gray-400">
                          <AlertTriangle
                            className="h-4 w-4"
                            title="Read-only access"
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {isEditing ? "Edit Asset" : "Add Asset"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="assetInventoryNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Inventory Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="assetInventoryNumber"
                    id="assetInventoryNumber"
                    required
                    value={currentAsset.assetInventoryNumber || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    style={{ padding: "0.5rem", border: "1px solid #d1d5db" }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="assetModel"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Asset Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="assetModel"
                    id="assetModel"
                    required
                    value={currentAsset.assetModel || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    style={{ padding: "0.5rem", border: "1px solid #d1d5db" }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="assetSN"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Serial Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="assetSN"
                    id="assetSN"
                    required
                    value={currentAsset.assetSN || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    style={{ padding: "0.5rem", border: "1px solid #d1d5db" }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="assetType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Asset Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="assetType"
                    id="assetType"
                    required
                    value={currentAsset.assetType || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    style={{ padding: "0.5rem", border: "1px solid #d1d5db" }}
                  >
                    <option value="">Select Type</option>
                    <option value="computer">Computer</option>
                    <option value="smartphone">Smartphone</option>
                    <option value="dockstation">Dock Station</option>
                    <option value="laptop">Laptop</option>
                    <option value="monitor">Monitor</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="assetStatus"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="assetStatus"
                    id="assetStatus"
                    required
                    value={currentAsset.assetStatus || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    style={{ padding: "0.5rem", border: "1px solid #d1d5db" }}
                  >
                    <option value="inOperation">In Operation</option>
                    <option value="inRepaire">In Repair</option>
                    <option value="inStock">In Stock</option>
                    <option value="writeOff">Write Off</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="employeeSelect"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Employee
                  </label>
                  <select
                    name="employeeSelect"
                    id="employeeSelect"
                    value={(() => {
                      if (!currentAsset.employee) return "";
                      const matchingEmployee = employees.find(
                        (emp) =>
                          `${emp.firstName} ${emp.lastName}` ===
                          currentAsset.employee
                      );
                      return matchingEmployee ? matchingEmployee.id : "";
                    })()}
                    onChange={(e) => {
                      const selectedEmployeeId = e.target.value;
                      if (selectedEmployeeId) {
                        const selectedEmployee = employees.find(
                          (emp) => emp.id === selectedEmployeeId
                        );
                        if (selectedEmployee) {
                          setCurrentAsset({
                            ...currentAsset,
                            employee: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
                            departmentId: selectedEmployee.departmentId,
                          });
                        }
                      } else {
                        setCurrentAsset({
                          ...currentAsset,
                          employee: "",
                          departmentId: "",
                        });
                      }
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    style={{ padding: "0.5rem", border: "1px solid #d1d5db" }}
                  >
                    <option value="">None</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} { emp.position && `(${emp.position})`}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {currentAsset.departmentId &&
                      `Department: ${
                        departments.find(
                          (d) => d.id === currentAsset.departmentId
                        )?.name || "Unknown"
                      }`}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    id="notes"
                    rows={3}
                    value={currentAsset.notes || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    style={{ padding: "0.5rem", border: "1px solid #d1d5db" }}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  {isEditing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetsPage;
