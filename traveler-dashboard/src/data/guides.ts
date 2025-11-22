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

export const guides: Guide[] = [
  {
    id: '101',
    name: 'Ahmed Benali',
    subtitle: 'Certified Desert Guide',
    location: 'Tamanrasset, Algeria',
    rating: 4.9,
    reviews: 127,
    tours: 45,
    experience: '8 years',
    languages: ['Arabic', 'French', 'English'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
  },
  {
    id: '102',
    name: 'Yasmina Khelifa',
    subtitle: 'Cultural Heritage Expert',
    location: 'Constantine, Algeria',
    rating: 4.8,
    reviews: 89,
    tours: 32,
    experience: '6 years',
    languages: ['Arabic', 'French', 'Spanish'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
  },
  {
    id: '103',
    name: 'Karim Boudiaf',
    subtitle: 'Mountain Trekking Guide',
    location: 'Kabylie, Algeria',
    rating: 4.7,
    reviews: 156,
    tours: 67,
    experience: '10 years',
    languages: ['Arabic', 'French', 'English'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
  },
  {
    id: '104',
    name: 'Fatima Zohra',
    subtitle: 'Mediterranean Coast Specialist',
    location: 'Oran, Algeria',
    rating: 4.6,
    reviews: 78,
    tours: 28,
    experience: '5 years',
    languages: ['Arabic', 'French', 'Italian'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
  },
  {
    id: '105',
    name: 'Mohamed Touati',
    subtitle: 'Adventure & Wildlife Guide',
    location: 'Bejaia, Algeria',
    rating: 4.9,
    reviews: 134,
    tours: 52,
    experience: '7 years',
    languages: ['Arabic', 'French', 'German'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face'
  },
  {
    id: '106',
    name: 'Leila Mansouri',
    subtitle: 'Culinary & Cultural Guide',
    location: 'Algiers, Algeria',
    rating: 4.8,
    reviews: 95,
    tours: 41,
    experience: '4 years',
    languages: ['Arabic', 'French', 'English', 'Spanish'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face'
  }
];