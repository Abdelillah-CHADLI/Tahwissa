export interface Guide {
  id: string;
  name: string;
  subtitle: string;
  location: string;
  rating: number;
  reviews: number;
  tours: number;
  experience: string;
  languages: string[];
  verified: boolean;
  image: string;
}

// Deprecated: dummy dataset removed. Kept only for backward compatibility.
export const guides: Guide[] = [];