export interface Employee {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    specialization: string[];
    languages: string[];
    location: string;
    joinDate: string;
    status: string;
    rating?: number;
    toursCompleted?: number;
    avatar?: string;
    experience: string;
}