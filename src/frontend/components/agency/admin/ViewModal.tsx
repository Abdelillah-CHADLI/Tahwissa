import { Mail, Phone, MapPin, Calendar, Star, Award, Briefcase, Languages } from "lucide-react";
import type { Employee } from "../../../types/employee";

interface ViewModalProps {
    employee: Employee;
    onClose: () => void;
}

export function ViewModal({ employee, onClose }: ViewModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-xl font-bold">Employee Details</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            ×
                        </button>
                    </div>

                    <div className="space-y-6">
                        <EmployeeHeader employee={employee} />
                        <EmployeeDetails employee={employee} />
                        <EmployeeSpecialization employee={employee} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function EmployeeHeader({ employee }: { employee: Employee }) {
    return (
        <div className="flex gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                {employee.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
                <h3 className="text-lg font-semibold">{employee.name}</h3>
                <p className="text-gray-600">{employee.role}</p>
                <span className={`px-2 py-1 rounded-full text-sm ${employee.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                    }`}>
                    {employee.status}
                </span>
            </div>
        </div>
    );
}

function EmployeeDetails({ employee }: { employee: Employee }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <DetailItem icon={Mail} label="Email" value={employee.email} />
                <DetailItem icon={Phone} label="Phone" value={employee.phone} />
                <DetailItem icon={MapPin} label="Location" value={employee.location} />
                <DetailItem
                    icon={Calendar}
                    label="Join Date"
                    value={new Date(employee.joinDate).toLocaleDateString()}
                />
            </div>

            <div className="space-y-4">
                <DetailItem icon={Star} label="Rating" value={`${employee.rating} / 5.0`} />
                <DetailItem icon={Award} label="Tours Completed" value={`${employee.toursCompleted} tours`} />
                <DetailItem icon={Briefcase} label="Experience" value={employee.experience} />
                <DetailItem icon={Languages} label="Languages" value={employee.languages.join(", ")} />
            </div>
        </div>
    );
}

function DetailItem({ icon: Icon, label, value }: any) {
    return (
        <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-gray-500" />
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p>{value}</p>
            </div>
        </div>
    );
}

function EmployeeSpecialization({ employee }: { employee: Employee }) {
    return (
        <div>
            <h4 className="font-semibold mb-2">Specialization</h4>
            <div className="flex flex-wrap gap-2">
                {employee.specialization.map((spec, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {spec}
                    </span>
                ))}
            </div>
        </div>
    );
}