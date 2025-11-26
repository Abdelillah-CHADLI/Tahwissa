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

export const mockAgencyProvider: AgencyProvider = {
  id: "agency-1",
  name: "Sahara Adventures Agency",
  location: { city: "Tamanrasset", country: "Algeria" },
  description:
    "We are a family-owned travel agency specializing in authentic Sahara desert experiences. Our expert guides are native Tuareg with deep knowledge of the desert and its culture.",
  rating: 4.8,
  reviewsCount: 234,
  verified: true,
  experienceYears: 12,
  toursOffered: 15,
  phone: "+213 555 123 456",
  email: "contact@saharaadventures.dz",
};
