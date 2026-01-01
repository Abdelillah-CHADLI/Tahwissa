import { useState } from "react";
import type { Employee } from "../../../types/employee";

interface AddEditModalProps {
    employee?: Employee | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (employee: Omit<Employee, "id">) => void;
}

export function AddEditModal({ employee, isOpen, onClose, onSave }: AddEditModalProps) {
    const [formData, setFormData] = useState({
        full_name: employee?.full_name || "",
        email: employee?.users.email || "",
        phone: employee?.phone || "",
        role: employee?.role || employee?.users.role || "",
        location: employee?.location || "",
        experience: employee?.experience || "",
        status: employee?.status || "active",
        specialization: employee?.specialization ? (Array.isArray(employee.specialization) ? employee.specialization.join(", ") : employee.specialization) : "",
        languages: employee?.languages ? (Array.isArray(employee.languages) ? employee.languages.join(", ") : employee.languages) : "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            employee_id: employee?.employee_id || '',
            full_name: formData.full_name,
            phone: formData.phone,
            location: formData.location,
            experience: formData.experience,
            languages: formData.languages.split(",").map((l: string) => l.trim()),
            role: formData.role,
            specialization: formData.specialization.split(",").map((s: string) => s.trim()),
            users: {
                role: formData.role,
                email: formData.email,
            },
            status: formData.status,
            rating: employee?.rating || 4.5,
            toursCompleted: employee?.toursCompleted || 0,
            avatar: employee?.avatar || '',
            joinDate: employee?.joinDate || new Date().toISOString().split("T")[0],
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">
                        {employee ? "Edit Employee" : "Add New Employee"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                label="Full Name"
                                type="text"
                                required
                                value={formData.full_name}
                                onChange={(value: string) => setFormData({ ...formData, full_name: value })}
                            />

                            <FormField
                                label="Email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(value: string) => setFormData({ ...formData, email: value })}
                            />

                            <FormField
                                label="Phone"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(value: string) => setFormData({ ...formData, phone: value })}
                            />

                            <FormField
                                label="Role"
                                type="text"
                                placeholder="e.g., Tour Guide, Driver, Coordinator"
                                value={formData.role}
                                onChange={(value: string) => setFormData({ ...formData, role: value })}
                            />

                            <FormField
                                label="Location"
                                type="text"
                                required
                                value={formData.location}
                                onChange={(value: string) => setFormData({ ...formData, location: value })}
                            />

                            <FormField
                                label="Experience"
                                type="text"
                                required
                                placeholder="e.g., 5 years"
                                value={formData.experience}
                                onChange={(value: string) => setFormData({ ...formData, experience: value })}
                            />

                            <FormField
                                label="Specialization"
                                type="text"
                                placeholder="e.g., Desert Tours, Historical Sites"
                                value={formData.specialization}
                                onChange={(value: string) => setFormData({ ...formData, specialization: value })}
                            />

                            <FormField
                                label="Languages"
                                type="text"
                                placeholder="e.g., Arabic, French, English"
                                value={formData.languages}
                                onChange={(value: string) => setFormData({ ...formData, languages: value })}
                            />

                            <SelectField
                                label="Status"
                                value={formData.status}
                                onChange={(value: string) => setFormData({ ...formData, status: value })}
                                options={[
                                    { value: "active", label: "Active" },
                                    { value: "inactive", label: "Inactive" },
                                ]}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                {employee ? "Update" : "Add"} Employee
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function FormField({ label, type, required, placeholder, value, onChange }: any) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
                type={type}
                required={required}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
            />
        </div>
    );
}

function SelectField({ label, value, onChange, options }: any) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
            >
                {options.map((option: any) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}