export interface AgencyProvider {
  id: string;
  name: string;
  location: { city: string; country: string };
  description: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  experienceYears: number;
  toursOffered: number;
  phone: string;
  email: string;
}

// Deprecated: dummy dataset removed. Kept only for backward compatibility.
export const mockAgencyProvider: AgencyProvider = {
  id: "",
  name: "",
  location: { city: "", country: "" },
  description: "",
  rating: 0,
  reviewsCount: 0,
  verified: false,
  experienceYears: 0,
  toursOffered: 0,
  phone: "",
  email: "",
};
