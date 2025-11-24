import type { Tour } from '../types/explore';

export const tours: Tour[] = [
  {
    id: "1",
    title: "Sahara Desert 5-Day Adventure",
    description: "Experience the breathtaking beauty of the Sahara Desert with an expert guide. Sleep under the stars and discover ancient desert traditions.",
    location: "Tamamasset",
    duration: "5 Days / 4 Nights",
    rating: 4.9,
    price: 45000,
    category: "Adventure",
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800',
    groupSize: "4-12 people"
  },
  {
    id: "2",
    title: "Atlas Mountains Hiking Experience",
    description: "Explore the stunning Atlas Mountains with breathtaking views and authentic Berber villages along the way.",
    location: "Djurdjura",
    duration: "3 Days / 2 Nights",
    rating: 4.8,
    price: 28000,
    category: "Hiking",
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    groupSize: "6-10 people"
  },
  {
    id: "3",
    title: "Tuareg Cultural Immersion",
    description: "Immerse yourself in Tuareg culture with traditional music, crafts, and desert hospitality experiences.",
    location: "Tamamasset",
    duration: "2 Days / 1 Night",
    rating: 5.0,
    price: 18000,
    category: "Cultural",
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    groupSize: "4-8 people"
  },
  {
    id: "4",
    title: "Desert Camel Trekking Expedition",
    description: "Journey through the golden dunes on camelback like ancient traders. Experience authentic desert travel.",
    location: "Tamanrasset",
    duration: "4 Days / 3 Nights",
    rating: 4.7,
    price: 35000,
    category: "Adventure",
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeuzSa4oIXAdSFa_R-vWO2e1pCbShOgdlCnQ&s',
    groupSize: "8-15 people"
  },
  {
    id: "5",
    title: "Algerian Sahara Stargazing Tour",
    description: "Discover the clearest night skies in one of the world's best stargazing locations with expert astronomers.",
    location: "Djanet",
    duration: "2 Days / 1 Night",
    rating: 4.9,
    price: 22000,
    category: "Astronomy",
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    groupSize: "6-12 people"
  },
  {
    id: "6",
    title: "Traditional Berber Village Experience",
    description: "Live like locals in authentic Berber villages, learn traditional crafts and enjoy homemade cuisine.",
    location: "Ghardaia",
    duration: "3 Days / 2 Nights",
    rating: 4.8,
    price: 32000,
    category: "Cultural",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
    groupSize: "4-10 people"
  }
];

export const mockTours = tours;