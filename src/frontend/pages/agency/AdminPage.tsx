import { useFeedback } from '../../components/ui/FeedbackProvider';
import { useState, useEffect } from "react";
import { UserPlus, Search, AlertCircle } from "lucide-react";
import { EmployeeList } from "../../components/agency/admin/EmployeeList";
import { AddEditModal } from "../../components/agency/admin/AddEditModal";
import { ViewModal } from "../../components/agency/admin/ViewModal";
import type { Employee } from "../../types/employee";
import api from "../../services/api";
import { PageState } from '../../components/ui';


export function AdminPage() {
  const { notify, confirm } = useFeedback();
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

            // Use backend structure directly
            setEmployees(result.employees);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch employees";
            setError(errorMessage);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleDeleteEmployee = async (id: string) => {
        if (await confirm("Are you sure you want to delete this employee?")) {
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

    const handleAddEmployee = async (employeeData: Omit<Employee, "employee_id">) => {
        setLoading(true);
        setError(null);

        try {
            const agencyId = getAgencyId();
            if (!agencyId) throw new Error('No agency account found.');

            const generatedPassword = `Emp-${crypto.randomUUID().slice(0, 12)}!`;
            await api.post(`/manager/employees`, {
                email: employeeData.users.email,
                password: generatedPassword,
                agency_id: agencyId,
                full_name: employeeData.full_name,
                phone: employeeData.phone,
                location: employeeData.location,
                experience: employeeData.experience,
                languages: employeeData.languages,
                role: employeeData.role,
                specialization: employeeData.specialization,
                status: employeeData.status,
            });

            await fetchEmployees();
            setIsAddModalOpen(false);
            notify(`Employee created. Temporary password: ${generatedPassword}`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to add employee";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.patch(`/manager/employeesOp/${id}/status`);

            // Update the employee list with the new status
            setEmployees(prevEmployees =>
                prevEmployees.map(emp =>
                    emp.employee_id === id
                        ? { ...emp, status: response.data.employee.status }
                        : emp
                )
            );

            notify(`${response.data.message}`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to toggle status";
            setError(errorMessage);
            notify(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleEditEmployee = async (employeeData: Omit<Employee, "employee_id">) => {
        setLoading(true);
        setError(null);
        try {
            if (!selectedEmployee) throw new Error('No employee selected');

            await api.put(`/manager/editEmployee/${selectedEmployee.employee_id}`, {
                full_name: employeeData.full_name,
                phone: employeeData.phone,
                location: employeeData.location,
                experience: employeeData.experience,
                languages: employeeData.languages,
                role: employeeData.role,
                specialization: employeeData.specialization,
                status: employeeData.status,
            });

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
        const name = employee.full_name || employee.users.email.split('@')[0];
        const email = employee.users.email;
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.toLowerCase().includes(searchQuery.toLowerCase());
        // status fallback for compatibility
        const matchesFilter = filterStatus === "all" || (employee.status || "active") === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Employee Management</h1>
                    <p className="text-gray-600">Manage your tour guides and staff</p>
                </div>
                <button
                    onClick={() => { setSelectedEmployee(null); setError(null); setIsAddModalOpen(true); }}
                    disabled={loading}
                    className="bg-brand text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-brand-dark disabled:opacity-50"
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

            <div className="panel panel-body">
                <div className="flex flex-col gap-3 mb-4 sm:flex-row">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                            aria-label="Search team members" placeholder="Search employees..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <select aria-label="Filter by team member status"
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
                    <PageState compact kind="loading" title="Loading your team" />
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
                <AddEditModal key={selectedEmployee?.employee_id || 'new'} busy={loading} error={error}
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
