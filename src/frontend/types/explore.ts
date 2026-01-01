// types/explore.ts
export interface TourFilters {
  region: string;
  category: string;
  priceRange: string;
  provider: string;
}

export interface FilterBarProps {
  filters: TourFilters;
  setFilters: (filters: TourFilters) => void;
}

export interface Tour {
  id: string;
  tour_id?: string; // Backend uses tour_id
  title: string;
  tour_title?: string; // Backend field
  description: string;
  price: number;
  rating: number;
  image: string;
  duration: string;
  location: string;
  category: string;
  groupSize: string;
  guide_id?: string;
  agency_id?: string;
  start_date?: string;
  isEnded?: boolean;
  guide?: {
    name: string;
    rating: number;
    toursCount: number;
  };
}

export interface TourCardProps {
  tour: Tour;
  onClick: (tourId: string) => void;
  index?: number;
}