import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GuideHeader from "../../components/guide_profile/GuideHeader";
import AboutSection from "../../components/guide_profile/AboutSection";
import ToursSection from "../../components/guide_profile/ToursSection";
import ContactSection from "../../components/guide_profile/ContactSection";
import { colors } from "../../assets/colors";
import { employeeService, profileService, tourService } from "../../services/api";
import { ROUTES } from "../../utils/routes";
import type { Tour } from "../../types/explore";
import defaultGuideImage from "../../assets/imgs/guide.png";
import defaultAgencyImage from "../../assets/imgs/agency.jpeg";
import defaultTourImage from "../../assets/imgs/tour1.jpeg";

type ProfileApiResponse = {
  success: boolean;
  data?: Record<string, unknown>;
  profile?: Record<string, unknown>;
  error?: string;
};

type ProfileRecord = {
  agency_id?: string;
  agency_name?: string;
  agency_description?: string;
  main_office_location?: string;
  support_email?: string;
  phone_number?: string;
  agency_logo?: string;
  rating?: number;
  num_raters?: number;
  manager_id?: string;
  manager?: {
    email?: string;
    role?: string;
  };
  guide_id?: string;
  guide_name?: string;
  guide_description?: string;
  main_location?: string;
  guide_photo?: string;
  ratings?: number;
  user?: {
    email?: string;
    role?: string;
  };
  [key: string]: unknown;
};

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

  agency_email?: string;
  agency_phone?: string;
  guide_email?: string;
  guide_phone?: string;
  emergency_phone?: string;
  support_email?: string;
  website?: string;
  agency_website?: string;
}

type BackendTour = {
  id?: string;
  tour_id?: string;
  title?: string;
  tour_title?: string;
  description?: string;
  tour_details?: string;
  price?: number;
  rating?: number;
  image?: string;
  images?: string[];
  tour_images?: Array<{ image_url?: string }>;
  duration?: string;
  location?: string;
  category?: string;
  groupSize?: string;
  group_size?: string;
  guide_id?: string;
  agency_id?: string;
  [key: string]: unknown;
};

const GuideProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<"about" | "tours" | "contact">("about");
  const [profileData, setProfileData] = useState<ProfileRecord | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [employeesCount, setEmployeesCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { profileId, profileType, initialData } = location.state || {};

  const mapBackendTourToTour = (tour: BackendTour): Tour => {
    const id = String(tour.id || tour.tour_id || "");
    const title = String(tour.title || tour.tour_title || "");
    const location = String(tour.location || "");
    const price = typeof tour.price === "number" ? tour.price : Number(tour.price) || 0;
    const duration = String(tour.duration || "");
    const category = String(tour.category || "");
    const groupSize = String(tour.groupSize || tour.group_size || "");
    const description = String(tour.description || tour.tour_details || title || "");
    const rating = typeof tour.rating === "number" ? tour.rating : 0;
  
    let image = defaultTourImage;
    if (Array.isArray(tour.images) && tour.images.length > 0 && typeof tour.images[0] === "string" && tour.images[0].trim()) {
      image = tour.images[0];
    } else if (Array.isArray(tour.tour_images) && tour.tour_images.length > 0) {
      const firstImage = tour.tour_images[0]?.image_url;
      if (typeof firstImage === "string" && firstImage.trim()) {
        image = firstImage;
      }
    } else if (typeof tour.image === "string" && tour.image.trim()) {
      image = tour.image;
    }

    return {
      id,
      tour_id: tour.tour_id,
      title,
      tour_title: tour.tour_title,
      description,
      price,
      rating,
      image,
      duration,
      location,
      category,
      groupSize,
      guide_id: tour.guide_id,
      agency_id: tour.agency_id,
      guide: undefined,
    };
  };

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
        
        const response = (await profileService.getProfile(
          profileId,
          profileType as 'agency' | 'guide'
        )) as ProfileApiResponse;

        const resolvedProfile = (response?.data || response?.profile) as ProfileRecord | undefined;

        if (response?.success && resolvedProfile) {
          setProfileData(resolvedProfile);

          // Load employees count for agencies
          if (profileType === 'agency') {
            try {
              const employeesResp = await employeeService.getEmployees(profileId);
              const list = (employeesResp?.employees as unknown) ?? [];
              setEmployeesCount(Array.isArray(list) ? list.length : 0);
            } catch {
              setEmployeesCount(0);
            }
          } else {
            setEmployeesCount(null);
          }
          
          // Always fetch tours from the tours endpoint to get images
          await fetchToursForProfile(profileId, profileType);
        } else {
          throw new Error(response?.error || 'Failed to fetch profile');
        }
      } catch (err) {
        setError('Failed to load profile data');
        if (initialData) {
          setProfileData(initialData);
          try {
            await fetchToursForProfile(profileId, profileType);
          } catch {
          }
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchToursForProfile = async (id: string, type: string) => {
      try {
        // Use getAgencyTours which fetches from browse endpoint with images
        const profileType = type === 'agency' ? 'agency' : 'guide';
        const toursData = await tourService.getAgencyTours(id, profileType);
        const allTours = Array.isArray(toursData) ? (toursData as BackendTour[]) : [];
        setTours(allTours.map(mapBackendTourToTour));
      } catch (_err) {

      }
    };

    fetchProfileData();
  }, [profileId, profileType, initialData]);

  const getMappedProfile = (): MappedProfile | null => {
    if (!profileData) return null;

    const pickString = (...values: unknown[]): string => {
      for (const v of values) {
        if (typeof v === 'string' && v.trim()) return v;
        if (typeof v === 'number' && Number.isFinite(v)) return String(v);
      }
      return '';
    };

    const readRelatedEmail = (rel: unknown): string => {
      if (!rel) return '';
      if (Array.isArray(rel)) {
        return pickString((rel[0] as any)?.email);
      }
      return pickString((rel as any).email);
    };

    const fallbackImage = profileType === 'agency' ? defaultAgencyImage : defaultGuideImage;
    const backendImage =
      profileType === 'agency'
        ? pickString(profileData.agency_logo)
        : pickString(profileData.guide_photo);
    const image =
      backendImage ||
      ((typeof initialData?.image === 'string' && initialData.image.trim()) ? initialData.image : '') ||
      fallbackImage;
    const initialName = typeof initialData?.name === 'string' ? initialData.name : '';
    const initialAbout = typeof initialData?.subtitle === 'string' ? initialData.subtitle : '';
    const initialLocation = typeof initialData?.location === 'string' ? initialData.location : '';

    const aboutFromBackend =
      profileType === 'agency'
        ? (typeof profileData.agency_description === 'string' ? profileData.agency_description : '')
        : (typeof profileData.guide_description === 'string' ? profileData.guide_description : '');
    const about = aboutFromBackend || initialAbout;

    if (profileType === 'agency') {
      const avgRating = profileData.num_raters && profileData.num_raters > 0 && profileData.rating
        ? (profileData.rating / profileData.num_raters).toFixed(1)
        : '0';

      const locationValue =
        (typeof profileData.main_office_location === 'string' && profileData.main_office_location.trim())
          ? profileData.main_office_location
          : initialLocation;

      const managerEmail = readRelatedEmail(profileData.manager);
      const emailValue = pickString(
        // Backend stores agency contact email as support_email (and manager.user email is also available)
        (profileData as any).agency_email,
        profileData.support_email,
        managerEmail,
        (profileData as any).email,
        managerEmail,
        profileData.support_email
      );

      const phoneValue = pickString(
        (profileData as any).agency_phone,
        (profileData as any).phone,
        profileData.phone_number
      );

      const websiteValue = pickString((profileData as any).agency_website, (profileData as any).website);

      return {
        name: profileData.agency_name || initialName || 'Unknown Agency',
        specialty: "Travel Agency",
        location: locationValue,
        rating: parseFloat(avgRating),
        toursCount: tours.length,
        experience: "",
        email: emailValue || 'Not provided',
        phone: phoneValue || 'Not provided',
        about,
        languages: [],
        certifications: [],
        type: "agency",
        image,
        num_raters: profileData.num_raters,
        employeesCount: typeof employeesCount === 'number' ? employeesCount : undefined,

  
        agency_email: pickString((profileData as any).agency_email, profileData.support_email, managerEmail) || undefined,
        agency_phone: pickString((profileData as any).agency_phone, profileData.phone_number) || undefined,
        emergency_phone: pickString((profileData as any).emergency_phone, (profileData as any).emergency_contact) || undefined,
        support_email: typeof profileData.support_email === 'string' ? profileData.support_email : undefined,
        website: typeof (profileData as any).website === 'string' ? (profileData as any).website : undefined,
        agency_website: typeof (profileData as any).agency_website === 'string' ? (profileData as any).agency_website : (typeof websiteValue === 'string' ? websiteValue : undefined),
      };
    } else {
      const avgRating = profileData.num_raters && profileData.num_raters > 0 && profileData.ratings
        ? (profileData.ratings / profileData.num_raters).toFixed(1)
        : '0';

      const locationValue =
        (typeof profileData.main_location === 'string' && profileData.main_location.trim())
          ? profileData.main_location
          : initialLocation;

      const userEmail = readRelatedEmail(profileData.user);
      const emailValue = pickString((profileData as any).email, userEmail, profileData.support_email);
      const phoneValue = pickString((profileData as any).phone, profileData.phone_number);
      const websiteValue = pickString((profileData as any).website);

      return {
        name: profileData.guide_name || initialName || 'Unknown Guide',
        specialty: "Local Guide",
        location: locationValue,
        rating: parseFloat(avgRating),
        toursCount: tours.length,
        experience: "",
        email: emailValue || 'Not provided',
        phone: phoneValue || 'Not provided',
        about,
        languages: [],
        certifications: [],
        type: "guide",
        image,
        num_raters: profileData.num_raters,

        guide_email: typeof (profileData as any).guide_email === 'string' ? (profileData as any).guide_email : undefined,
        guide_phone: typeof (profileData as any).guide_phone === 'string' ? (profileData as any).guide_phone : undefined,
        emergency_phone: pickString((profileData as any).emergency_phone, (profileData as any).emergency_contact) || undefined,
        support_email: typeof profileData.support_email === 'string' ? profileData.support_email : undefined,
        website: typeof websiteValue === 'string' ? websiteValue : undefined,
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