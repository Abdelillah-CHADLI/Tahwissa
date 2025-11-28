import { Users, MapPin, Star, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import type { Employee } from "../../../types/employee";
import { useState } from "react";

interface EmployeeListProps {
    employees: Employee[];
    onView: (employee: Employee) => void;
    onEdit: (employee: Employee) => void;
    onToggleStatus: (id: string) => void;
    onDelete: (id: string) => void;
}

export function EmployeeList({ employees, onView, onEdit, onToggleStatus, onDelete }: EmployeeListProps) {
    return (
        <div className="space-y-4">
            {employees.map((employee) => (
                <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    onView={onView}
                    onEdit={onEdit}
                    onToggleStatus={onToggleStatus}
                    onDelete={onDelete}
                />
            ))}

            {employees.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2" />
                    No employees found
                </div>
            )}
        </div>
    );
}

function EmployeeCard({ employee, onView, onEdit, onToggleStatus, onDelete }: any) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
                <div className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        {employee.name.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div>
                        <h3 className="font-semibold">{employee.name}</h3>
                        <p className="text-gray-600 text-sm">{employee.role}</p>
                        <p className="text-gray-500 text-sm">{employee.email}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${employee.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                        }`}>
                        {employee.status}
                    </span>

                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                <button
                                    onClick={() => {
                                        onView(employee);
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                </button>
                                <button
                                    onClick={() => {
                                        onEdit(employee);
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        onToggleStatus(employee.id);
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    {employee.status === "active" ? "Deactivate" : "Activate"}
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete(employee.id);
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-3 flex gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {employee.location}
                </div>
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {employee.rating}
                </div>
                <div>{employee.toursCompleted} tours</div>
            </div>
        </div>
    );
}