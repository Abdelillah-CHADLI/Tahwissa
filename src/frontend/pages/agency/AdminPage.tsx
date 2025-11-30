import { useState, useEffect } from "react";
import { UserPlus, Search, AlertCircle } from "lucide-react";
import { EmployeeList } from "../../components/agency/admin/EmployeeList";
import { AddEditModal } from "../../components/agency/admin/AddEditModal";
import { ViewModal } from "../../components/agency/admin/ViewModal";
import type { Employee } from "../../types/employee";

const API_BASE_URL = "http://localhost:5000";

export function AdminPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fetchLoading, setFetchLoading] = useState(true);

    const getAgencyId = () => {
        return localStorage.getItem('agencyId') || "550e8400-e29b-41d4-a716-446655440101";
    };

    // --- API Calls ---
    const fetchEmployees = async () => {
        setFetchLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/manager/employees?agency_id=${getAgencyId()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch employees: ${response.statusText}`);
            }

            const employeesData = await response.json();
            setEmployees(employeesData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch employees";
            setError(errorMessage);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleDeleteEmployee = async (id: string) => {
        if (confirm("Are you sure you want to delete this employee?")) {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/manager/employees/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to delete employee: ${response.statusText}`);
                }

                await fetchEmployees();
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Failed to delete employee";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleToggleStatus = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const employee = employees.find(e => e.id === id);
            if (!employee) return;

            const newStatus = employee.status === "active" ? "inactive" : "active";

            const response = await fetch(`${API_BASE_URL}/manager/employees/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: newStatus
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to update employee status: ${response.statusText}`);
            }

            await fetchEmployees();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to update employee status";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEmployee = async (employeeData: Omit<Employee, "id">) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/manager/employees`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: employeeData.email,
                    password: "123",
                    agency_id: getAgencyId(),
                    name: employeeData.name,
                    role: employeeData.role,
                    phone: employeeData.phone
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Failed to add employee: ${response.statusText}`);
            }

            await fetchEmployees();
            setIsAddModalOpen(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to add employee";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleEditEmployee = async (employeeData: Omit<Employee, "id">) => {
        if (!selectedEmployee) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/manager/employees/${selectedEmployee.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: employeeData.email,
                    name: employeeData.name,
                    role: employeeData.role,
                    phone: employeeData.phone,
                    status: employeeData.status
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Failed to update employee: ${response.statusText}`);
            }

            await fetchEmployees();
            setIsEditModalOpen(false);
            setSelectedEmployee(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to update employee";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // --- Effects ---
    useEffect(() => {
        fetchEmployees();
    }, []);

    // --- Filter Logic ---
    const filteredEmployees = employees.filter((employee) => {
        const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === "all" || employee.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Employee Management</h1>
                    <p className="text-gray-600">Manage your tour guides and staff</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
                >
                    <UserPlus className="w-4 h-4" />
                    Add Employee
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="ml-auto text-red-700 hover:text-red-900"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex gap-4 mb-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                            placeholder="Search employees..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                {fetchLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <EmployeeList
                        employees={filteredEmployees}
                        onView={(employee) => {
                            setSelectedEmployee(employee);
                            setIsViewModalOpen(true);
                        }}
                        onEdit={(employee) => {
                            setSelectedEmployee(employee);
                            setIsEditModalOpen(true);
                        }}
                        onToggleStatus={handleToggleStatus}
                        onDelete={handleDeleteEmployee}
                    />
                )}
            </div>

            {(isAddModalOpen || isEditModalOpen) && (
                <AddEditModal
                    employee={selectedEmployee}
                    isOpen={isAddModalOpen || isEditModalOpen}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        setIsEditModalOpen(false);
                        setSelectedEmployee(null);
                        setError(null);
                    }}
                    onSave={(employeeData) => {
                        if (selectedEmployee) {
                            handleEditEmployee(employeeData);
                        } else {
                            handleAddEmployee(employeeData);
                        }
                    }}
                />
            )}

            {isViewModalOpen && selectedEmployee && (
                <ViewModal
                    employee={selectedEmployee}
                    onClose={() => {
                        setIsViewModalOpen(false);
                        setSelectedEmployee(null);
                    }}
                />
            )}
        </div>
    );
}