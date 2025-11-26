import guideImage from '../assets/imgs/guide.png';

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
    image: guideImage
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
    image: guideImage
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
    image: guideImage
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
    image: guideImage
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
    image: guideImage
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
    image: guideImage
  }
];