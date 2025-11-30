import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GuideHeader from "../../components/guide_profile/GuideHeader";
import AboutSection from "../../components/guide_profile/AboutSection";
import ToursSection from "../../components/guide_profile/ToursSection";
import ContactSection from "../../components/guide_profile/ContactSection";
import { colors } from "../../assets/colors";
import { profileService, tourService } from "../../services/api";
import { ROUTES } from "../../utils/routes";
import type { Tour } from "../../types/explore";

interface ProfileApiResponse {
  success: boolean;
  data: {
    agency_id?: string;
    agency_name?: string;
    rating?: number;
    num_raters?: number;
    manager_id?: string;
    manager?: {
      email: string;
      role: string;
    };
    guide_id?: string;
    guide_name?: string;
    ratings?: number;
    user?: {
      email: string;
      role: string;
    };
    tours?: Array<{
      tour_id: string;
      tour_title: string;
      location: string;
      price: number;
      start_date?: string;
      guide_id?: string | null;
    }>;
  };
}

interface MappedProfile {
  name: string;
  specialty: string;
  location: string;
  rating: number;
  toursCount: number;
  experience: string;
  email: string;
  phone: string;
  about: string;
  languages: string[];
  certifications: string[];
  type: 'guide' | 'agency';
  image?: string;
  employeesCount?: number;
  establishedYear?: number;
  num_raters?: number;
}

interface TourServiceResponse {
  success: boolean;
  data: Tour[] | Array<{
    tour_id: string;
    tour_title: string;
    location: string;
    price: number;
    agency_id?: string;
    guide_id?: string;
    [key: string]: unknown;
  }>;
}

const GuideProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<"about" | "tours" | "contact">("about");
  const [profileData, setProfileData] = useState<ProfileApiResponse['data'] | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { profileId, profileType, initialData } = location.state || {};

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!profileId || !profileType) {
        setError("Missing profile information");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        if (initialData && initialData.tours && initialData.tours.length > 0) {
          const mappedTours = initialData.tours.map((tour: any) => ({
            id: tour.tour_id,
            title: tour.tour_title,
            location: tour.location,
            price: tour.price,
            rating: 0,
            image: "../src/frontend/data/mock_img.jpg",
            category: "Adventure",
            duration: "1 day",
            description: tour.tour_title
          } as Tour));
          setTours(mappedTours);
        }
        
        const response = await profileService.getProfile(profileId, profileType as 'agency' | 'guide');
        
        if (response.success) {
          setProfileData(response.data);
          
          if (!initialData?.tours || initialData.tours.length === 0) {
            if (response.data.tours && response.data.tours.length > 0) {
              const mappedTours = response.data.tours.map((tour: any) => ({
                id: tour.tour_id,
                title: tour.tour_title,
                location: tour.location,
                price: tour.price,
                rating: 0,
                image: "../src/frontend/data/mock_img.jpg",
                category: "Adventure",
                duration: "1 day",
                description: tour.tour_title
              } as Tour));
              setTours(mappedTours);
            } else {
              await fetchToursForProfile(profileId, profileType);
            }
          }
        } else {
          throw new Error(response.error || 'Failed to fetch profile');
        }
      } catch (err) {
        setError('Failed to load profile data');
        if (initialData) {
          setProfileData(initialData);
          if (initialData.tours && initialData.tours.length > 0) {
            const mappedTours = initialData.tours.map((tour: any) => ({
              id: tour.tour_id,
              title: tour.tour_title,
              location: tour.location,
              price: tour.price,
              rating: 0,
              image: "../src/frontend/data/mock_img.jpg",
              category: "Adventure",
              duration: "1 day",
              description: tour.tour_title
            } as Tour));
            setTours(mappedTours);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchToursForProfile = async (id: string, type: string) => {
      try {
        if (type === 'agency') {
          const toursResponse = await tourService.searchTours({ provider: 'agency' }) as TourServiceResponse;
          if (toursResponse.success) {
            const agencyTours = toursResponse.data.filter((tour: Tour | { agency_id?: string }) => 
              'agency_id' in tour && tour.agency_id === id
            ) as Tour[];
            setTours(agencyTours);
          }
        } else {
          const toursResponse = await tourService.searchTours({ provider: 'guide' }) as TourServiceResponse;
          if (toursResponse.success) {
            const guideTours = toursResponse.data.filter((tour: Tour | { guide_id?: string }) => 
              'guide_id' in tour && tour.guide_id === id
            ) as Tour[];
            setTours(guideTours);
          }
        }
      } catch (err) {
      }
    };

    fetchProfileData();
  }, [profileId, profileType, initialData]);

  const getMappedProfile = (): MappedProfile | null => {
    if (!profileData) return null;

    if (profileType === 'agency') {
      const avgRating = profileData.num_raters && profileData.num_raters > 0 && profileData.rating
        ? (profileData.rating / profileData.num_raters).toFixed(1)
        : '0';

      return {
        name: profileData.agency_name || 'Unknown Agency',
        specialty: "Travel Agency",
        location: "", // Removed location
        rating: parseFloat(avgRating),
        toursCount: tours.length,
        experience: "Professional Service",
        email: profileData.manager?.email || "contact@agency.com",
        phone: "+213 XXX XXX XXX",
        about: `Professional travel agency ${profileData.agency_name} providing quality tours and experiences.`,
        languages: ["Arabic", "French", "English"],
        certifications: [
          "Licensed Travel Agency",
          "Quality Certified",
          "Professional Service"
        ],
        type: "agency",
        image: "../src/frontend/data/mock_img.jpg",
        employeesCount: 10,
        establishedYear: 2020,
        num_raters: profileData.num_raters
      };
    } else {
      const avgRating = profileData.num_raters && profileData.num_raters > 0 && profileData.ratings
        ? (profileData.ratings / profileData.num_raters).toFixed(1)
        : '0';

      return {
        name: profileData.guide_name || 'Unknown Guide',
        specialty: "Local Guide",
        location: "", // Removed location
        rating: parseFloat(avgRating),
        toursCount: tours.length,
        experience: "Professional Guide",
        email: profileData.user?.email || "guide@example.com",
        phone: "+213 XXX XXX XXX",
        about: `Professional local guide ${profileData.guide_name} with extensive knowledge and experience.`,
        languages: ["Arabic", "French", "English"],
        certifications: [
          "Licensed Tour Guide",
          "First Aid Certified",
          "Local Expert"
        ],
        type: "guide",
        image: "../src/frontend/data/mock_img.jpg",
        num_raters: profileData.num_raters
      };
    }
  };

  const handleTourClick = (tour: Tour) => {
    navigate(ROUTES.DETAILS, {
      state: {
        tourId: tour.id,
        tourData: tour
      }
    });
  };

  const handleBack = () => {
    navigate(ROUTES.GUIDES);
  };

  const renderActiveSection = () => {
    if (!profile) return null;

    switch (activeSection) {
      case "about":
        return <AboutSection guide={profile} />;
      case "tours":
        return (
          <ToursSection
            guideName={profile.name}
            tours={tours}
            onTourClick={handleTourClick}
            loading={loading}
          />
        );
      case "contact":
        return <ContactSection guide={profile} />;
      default:
        return <AboutSection guide={profile} />;
    }
  };

  const profile = getMappedProfile();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#348086] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={handleBack}
            className="bg-[#348086] text-white px-6 py-2 rounded-lg hover:bg-[#2a6970] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-lg mb-4">Profile not found</div>
          <button
            onClick={handleBack}
            className="bg-[#348086] text-white px-6 py-2 rounded-lg hover:bg-[#2a6970] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={handleBack}
            className={`text-[${colors.primary.green}] font-medium hover:text-[${colors.primary.darkTeal}] transition-colors`}
          >
            ← Back to Guides & Agencies
          </button>
        </div>
      </div>

      <GuideHeader guide={profile} />

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-center gap-8">
            <button
              onClick={() => setActiveSection("about")}
              className={`font-medium pb-2 transition-colors ${
                activeSection === "about"
                  ? `text-[${colors.primary.green}] border-b-2 border-[${colors.primary.green}]`
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveSection("tours")}
              className={`font-medium pb-2 transition-colors ${
                activeSection === "tours"
                  ? `text-[${colors.primary.green}] border-b-2 border-[${colors.primary.green}]`
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Tours ({tours.length})
            </button>
            <button
              onClick={() => setActiveSection("contact")}
              className={`font-medium pb-2 transition-colors ${
                activeSection === "contact"
                  ? `text-[${colors.primary.green}] border-b-2 border-[${colors.primary.green}]`
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Contact
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {renderActiveSection()}
      </div>
    </div>
  );
};

export default GuideProfilePage;