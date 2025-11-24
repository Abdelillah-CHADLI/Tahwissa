export interface Filters {
  category: string;
  priceRange: string;
  duration: string;
  rating: string;
  region: string; 
}

export interface FilterBarProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  duration: string;
  location: string;
  category: string;
  groupSize: string;
  guide?: {
    name: string;
    rating: number;
    toursCount: number;
  };
}

export interface TourCardProps {
  tour: Tour;
  onClick: (tourId: string) => void;
}