// types/employee.ts

export interface Employee {
    employee_id: string;
    full_name: string | null;
    phone: string | null;
    location: string | null;
    experience: string | null;

    // These can be either string (JSON string) or array (parsed)
    // Backend will handle conversion
    languages: string | string[] | null;

    role: string | null;

    // These can be either string (JSON string) or array (parsed)
    specialization: string | string[] | null;

    // Status field from database
    status: 'active' | 'inactive' | string;

    // Nested user data from join
    users: {
        role: string;
        email: string;
    };

    // Optional legacy fields for compatibility
    rating?: number;
    toursCompleted?: number;
    avatar?: string;
    joinDate?: string;
}