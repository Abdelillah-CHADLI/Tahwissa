import { Dialog } from '../../ui';
import type { ComponentType } from 'react';
import { Mail, Phone, MapPin, Briefcase, Languages } from "lucide-react";
import type { Employee } from "../../../types/employee";

interface ViewModalProps {
    employee: Employee;
    onClose: () => void;
}

export function ViewModal({ employee, onClose }: ViewModalProps) {
    return (
        <Dialog open onClose={onClose} title="Team member details" wide>
                    <div className="space-y-6">
                        <EmployeeHeader employee={employee} />
                        <EmployeeDetails employee={employee} />
                        <EmployeeSpecialization employee={employee} />
                    </div>
        </Dialog>
    );
}

function EmployeeHeader({ employee }: { employee: Employee }) {
    return (
        <div className="flex gap-4 min-w-0">
            <div className="shrink-0 w-12 h-12 bg-brand-soft text-brand rounded-full flex items-center justify-center">
                {(employee.full_name || employee.users.email.split("@")[0] || "?")
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
            </div>
            <div>
                <h3 className="text-lg font-semibold">{employee.full_name || employee.users.email.split("@")[0]}</h3>
                <p className="text-gray-600">{employee.role || employee.users.role}</p>
                <span className={`px-2 py-1 rounded-full text-sm ${(employee.status || "active") === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                    }`}>
                    {employee.status || "active"}
                </span>
            </div>
        </div>
    );
}

function EmployeeDetails({ employee }: { employee: Employee }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <DetailItem icon={Mail} label="Email" value={employee.users.email} />
                <DetailItem icon={Phone} label="Phone" value={employee.phone || "-"} />
                <DetailItem icon={Briefcase} label="Role" value={employee.role || employee.users.role} />
            </div>

            <div className="space-y-4">
                {/* Removed Rating and Tours Completed fields as they are not present in the backend table */}
                <DetailItem icon={Briefcase} label="Experience" value={employee.experience || "-"} />
                <DetailItem icon={Languages} label="Languages" value={employee.languages ? (Array.isArray(employee.languages) ? employee.languages.join(", ") : employee.languages) : "-"} />
                <DetailItem icon={MapPin} label="Location" value={employee.location || "-"} />
            </div>
        </div>
    );
}

function DetailItem({ icon: Icon, label, value }: { icon: ComponentType<{ className?: string }>; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-gray-500" />
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="break-all">{value}</p>
            </div>
        </div>
    );
}

function EmployeeSpecialization({ employee }: { employee: Employee }) {
    const specializationArray = Array.isArray(employee.specialization) ? employee.specialization : [];
    return (
        <div>
            <h4 className="font-semibold mb-2">Specialization</h4>
            <div className="flex flex-wrap gap-2">
                {specializationArray && specializationArray.length > 0
                    ? specializationArray.map((spec: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                            {spec}
                        </span>
                    ))
                    : <span className="text-gray-400">-</span>}
            </div>
        </div>
    );
}