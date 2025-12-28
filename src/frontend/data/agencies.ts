export interface Agency {
  id: string;
  name: string;
  subtitle: string;
  location: string;
  rating: number;
  reviews: number;
  tours: number;
  teamSize: string;
  verified: boolean;
  image: string;
}

// Deprecated: dummy dataset removed. Kept only for backward compatibility.
export const agencies: Agency[] = [];