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

export const agencies: Agency[] = [
  {
    id: '1',
    name: 'Explore Algeria Tours',
    subtitle: 'Full-Service Travel Agency',
    location: 'Algiers, Algeria',
    rating: 4.7,
    reviews: 234,
    tours: 156,
    teamSize: '15-20 employees',
    verified: true,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=400&fit=crop'
  },
  {
    id: '2',
    name: 'Sahara Adventures Agency',
    subtitle: 'Desert & Adventure Tours',
    location: 'Tamanrasset, Algeria',
    rating: 4.9,
    reviews: 187,
    tours: 98,
    teamSize: '10-15 employees',
    verified: true,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=400&fit=crop'
  },
  {
    id: '3',
    name: 'Mediterranean Coast Tours',
    subtitle: 'Coastal & Beach Experiences',
    location: 'Oran, Algeria',
    rating: 4.6,
    reviews: 143,
    tours: 72,
    teamSize: '8-10 employees',
    verified: true,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=400&fit=crop'
  },
  {
    id: '4',
    name: 'Atlas Mountain Guides',
    subtitle: 'Mountain Trekking & Hiking',
    location: 'Kabylie, Algeria',
    rating: 4.8,
    reviews: 156,
    tours: 89,
    teamSize: '12-15 employees',
    verified: true,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=400&fit=crop'
  },
  {
    id: '5',
    name: 'Cultural Heritage Tours',
    subtitle: 'Historical & Archaeological Experiences',
    location: 'Constantine, Algeria',
    rating: 4.5,
    reviews: 98,
    tours: 45,
    teamSize: '6-8 employees',
    verified: true,
    image: 'https://images.unsplash.com/photo-1596383513331-ec1d6dcd6fbb?w=800&h=400&fit=crop'
  },
  {
    id: '6',
    name: 'Desert Nomad Expeditions',
    subtitle: 'Authentic Bedouin Experiences',
    location: 'Djanet, Algeria',
    rating: 4.9,
    reviews: 201,
    tours: 67,
    teamSize: '8-12 employees',
    verified: true,
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&h=400&fit=crop'
  }
];