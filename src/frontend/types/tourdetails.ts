interface DaySchedule {
    id: number;
    title: string;
    description: string;
    activities: string[];
    meals?: string;
    accommodation?: string;
}

interface TourInclusions {
    included: string[];
    notIncluded: string[];
    requirements: string[];
}

export type { DaySchedule, TourInclusions };