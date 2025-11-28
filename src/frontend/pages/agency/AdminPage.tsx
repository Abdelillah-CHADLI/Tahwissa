import { useState } from "react";
import { UserPlus, Search, } from "lucide-react";
import { EmployeeList } from "../../components/agency/admin/EmployeeList";
import { AddEditModal } from "../../components/agency/admin/AddEditModal";
import { ViewModal } from "../../components/agency/admin/ViewModal";
import type { Employee } from "../../types/employee";
import { employees as initEmployees } from "../../data/employees";

export function AdminPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>(initEmployees);

    const filteredEmployees = employees.filter((employee) => {
        const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === "all" || employee.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleDeleteEmployee = (id: string) => {
        if (confirm("Are you sure you want to delete this employee?")) {
            setEmployees(employees.filter((e) => e.id !== id));
        }
    };

    const handleToggleStatus = (id: string) => {
        setEmployees(
            employees.map((e) =>
                e.id === id
                    ? { ...e, status: e.status === "active" ? "inactive" : "active" }
                    : e
            )
        );
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Employee Management</h1>
                    <p className="text-gray-600">Manage your tour guides and staff</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <UserPlus className="w-4 h-4" />
                    Add Employee
                </button>
            </div>

            {/* Search and Filter */}
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
            </div>

            {/* Modals */}
            {(isAddModalOpen || isEditModalOpen) && (
                <AddEditModal
                    employee={selectedEmployee}
                    isOpen={isAddModalOpen || isEditModalOpen}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        setIsEditModalOpen(false);
                        setSelectedEmployee(null);
                    }}
                    onSave={(employeeData) => {
                        if (selectedEmployee) {
                            setEmployees(employees.map(e =>
                                e.id === selectedEmployee.id ? { ...employeeData, id: e.id } : e
                            ));
                        } else {
                            setEmployees([...employees, { ...employeeData, id: Date.now().toString() }]);
                        }
                        setIsAddModalOpen(false);
                        setIsEditModalOpen(false);
                        setSelectedEmployee(null);
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