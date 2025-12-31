import { useState, useEffect } from "react";
import { UserPlus, Search, AlertCircle } from "lucide-react";
import { EmployeeList } from "../../components/agency/admin/EmployeeList";
import { AddEditModal } from "../../components/agency/admin/AddEditModal";
import { ViewModal } from "../../components/agency/admin/ViewModal";
import type { Employee } from "../../types/employee";
import api from "../../services/api";

interface BackendEmployee {
    employee_id: string;
    users: {
        role: string;
        email: string;
    };
}

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
        const direct = localStorage.getItem('agencyId');
        if (direct) return direct;
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        try {
            const user = JSON.parse(userStr) as any;
            return user.agencyId || user.profileId || null;
        } catch {
            return null;
        }
    };

    // --- API Calls ---
    const fetchEmployees = async () => {
        setFetchLoading(true);
        setError(null);
        try {
            const agencyId = getAgencyId();
            if (!agencyId) throw new Error('No agency account found.');

            const response = await api.get(`/manager/employeesOp/${agencyId}`);
            const result = response.data;

            // Transform backend data to frontend format, providing defaults for all fields
            const transformedEmployees: Employee[] = result.employees.map((emp: BackendEmployee) => ({
                id: emp.employee_id,
                name: emp.users.email.split('@')[0],
                email: emp.users.email,
                role: emp.users.role,
                phone: "Not available",
                status: "active",
                specialization: [],
                languages: [],
                location: "Not available",
                joinDate: new Date().toISOString(),
                rating: 0,
                toursCompleted: 0,
                avatar: "",
                experience: "Not available"
            }));

            setEmployees(transformedEmployees);
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
                await api.delete(`/manager/employeesOp/${id}`);

                await fetchEmployees();
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Failed to delete employee";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAddEmployee = async (employeeData: Omit<Employee, "id">) => {
        setLoading(true);
        setError(null);

        try {
            const agencyId = getAgencyId();
            if (!agencyId) throw new Error('No agency account found.');

            const generatedPassword = `Emp-${Math.random().toString(36).slice(2, 10)}!`;
            await api.post(`/manager/employees`, {
                email: employeeData.email,
                password: generatedPassword,
                agency_id: agencyId,
            });

            await fetchEmployees();
            setIsAddModalOpen(false);
            alert(`Employee created. Temporary password: ${generatedPassword}`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to add employee";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Remove toggle status and edit since backend doesn't support them
    const handleToggleStatus = async (id: string) => {
        void id;
        alert("Status toggle not supported by backend API");
    };

    const handleEditEmployee = async (employeeData: Omit<Employee, "id">) => {
        void employeeData;
        alert("Edit employee functionality not implemented in backend");
        setIsEditModalOpen(false);
        setSelectedEmployee(null);
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