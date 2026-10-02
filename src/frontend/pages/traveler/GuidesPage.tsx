import { PageState, Button } from '../../components/ui';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import SearchSection from "../../components/guides_agencies/SearchSection";
import TabNavigation from "../../components/guides_agencies/TabNavigation";
import AgencyCard from "../../components/guides_agencies/AgencyCard";
import GuideCard from "../../components/guides_agencies/GuideCard";
import LoadMoreButton from "../../components/guides_agencies/LoadMoreButton";
import { agencyService, guideService } from "../../services/api";
import { ROUTES } from "../../utils/routes";
import agencyImage from "../../assets/imgs/agency.jpeg";
import guideImage from "../../assets/imgs/guide.png";

const ITEMS_PER_LOAD = 3;

// Define proper types for API responses
interface BackendAgency {
  agency_id: string;
  agency_name: string;
  rating?: number;
  num_raters?: number;
  manager_id?: string;
  verified?: boolean;
  agency_logo?: string;
  main_office_location?: string;
  tours?: Array<{
    tour_id: string;
    tour_title: string;
    location: string;
    price: number;
    start_date?: string;
    guide_id?: string | null;
  }>;
}

interface BackendGuide {
  guide_id: string;
  guide_name: string;
  ratings?: number;
  num_raters?: number;
  guide_photo?: string;
  verified?: boolean;
  main_location?: string;
}

interface BrowseAgenciesResponse {
  success: boolean;
  data: {
    agencies: BackendAgency[];
    pagination: {
      page: number;
      size: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

interface SearchAgenciesResponse {
  success: boolean;
  data: BackendAgency[];
}

interface SearchGuidesResponse {
  success: boolean;
  data: BackendGuide[];
}

interface BrowseGuidesResponse {
  success: boolean;
  data: BackendGuide[];
}

const mapAgencyData = (backendAgency: BackendAgency) => {
  const avgRating =
    backendAgency.num_raters && backendAgency.num_raters > 0 && backendAgency.rating
      ? (backendAgency.rating / backendAgency.num_raters).toFixed(1)
      : '0';

  const toursCount = backendAgency.tours ? backendAgency.tours.length : 0;

  return {
    id: backendAgency.agency_id,
    name: backendAgency.agency_name,
    subtitle: `Rated ${avgRating} ⭐ • ${backendAgency.num_raters || 0} reviews`,
    image:
      typeof backendAgency.agency_logo === 'string' && backendAgency.agency_logo.trim()
        ? backendAgency.agency_logo
        : agencyImage,
    location:
      typeof backendAgency.main_office_location === 'string' && backendAgency.main_office_location.trim()
        ? backendAgency.main_office_location
        : "Algeria",
    tours: toursCount,
    teamSize: "Professional Team",
    verified: Boolean(backendAgency.verified),
    toursData: backendAgency.tours || []
  };
};

const mapGuideData = (backendGuide: BackendGuide) => {
  const avgRating =
    backendGuide.num_raters && backendGuide.num_raters > 0 && backendGuide.ratings
      ? (backendGuide.ratings / backendGuide.num_raters).toFixed(1)
      : '0';

  return {
    id: backendGuide.guide_id,
    name: backendGuide.guide_name,
    subtitle: `Rated ${avgRating} ⭐ • ${backendGuide.num_raters || 0} reviews`,
    image:
      typeof backendGuide.guide_photo === 'string' && backendGuide.guide_photo.trim()
        ? backendGuide.guide_photo
        : guideImage,
    location:
      typeof backendGuide.main_location === 'string' && backendGuide.main_location.trim()
        ? backendGuide.main_location
        : "Algeria",
    tours: 0,
    experience: "Professional Guide",
    languages: ["Arabic", "French", "English"],
    verified: Boolean(backendGuide.verified),
  };
};

const TravelAgenciesPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("agencies");
  const [searchQuery, setSearchQuery] = useState("");
  const [agencies, setAgencies] = useState<any[]>([]);
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [visibleAgencies, setVisibleAgencies] = useState<any[]>([]);
  const [visibleGuides, setVisibleGuides] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (activeTab === "agencies") {
          if (searchQuery.trim()) {
            const response = await agencyService.searchAgencies(
              searchQuery,
              50
            ) as SearchAgenciesResponse;

            if (response.success && Array.isArray(response.data)) {
              const mappedAgencies = response.data.map(mapAgencyData);
              setAgencies(mappedAgencies);
              setVisibleAgencies(mappedAgencies.slice(0, ITEMS_PER_LOAD));
            } else {
              throw new Error("Invalid search response format");
            }
          } else {
            const response = await agencyService.browseAgencies(1, 50) as BrowseAgenciesResponse;

            if (
              response.success &&
              response.data &&
              Array.isArray(response.data.agencies)
            ) {
              const mappedAgencies = response.data.agencies.map(mapAgencyData);
              setAgencies(mappedAgencies);
              setVisibleAgencies(mappedAgencies.slice(0, ITEMS_PER_LOAD));
            } else {
              throw new Error("Invalid browse response format");
            }
          }
        } else {
          if (searchQuery.trim()) {
            const response = await guideService.searchGuides(searchQuery, 50) as SearchGuidesResponse;

            if (response.success && Array.isArray(response.data)) {
              const mappedGuides = response.data.map(mapGuideData);
              setGuides(mappedGuides);
              setVisibleGuides(mappedGuides.slice(0, ITEMS_PER_LOAD));
            } else {
              throw new Error("Invalid guides response format");
            }
          } else {
            const response = await guideService.browseGuides(1, 50) as BrowseGuidesResponse;

            if (response.success && Array.isArray(response.data)) {
              const mappedGuides = response.data.map(mapGuideData);
              setGuides(mappedGuides);
              setVisibleGuides(mappedGuides.slice(0, ITEMS_PER_LOAD));
            } else {
              throw new Error("Invalid guides response format");
            }
          }
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load data");
        setAgencies([]);
        setVisibleAgencies([]);
        setGuides([]);
        setVisibleGuides([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab, searchQuery, retry]);

  const filteredAgencies = visibleAgencies.filter(
    (agency) =>
      agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agency.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (agency.subtitle &&
        agency.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredGuides = visibleGuides.filter(
    (guide) =>
      guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (guide.subtitle &&
        guide.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewProfile = (profileData: any, type: "agency" | "guide") => {
    navigate(`${ROUTES.GUIDE_PROFILE}/${type}/${profileData.id}`, {
      state: {
        profileId: profileData.id,
        profileType: type,
        initialData: {
          name: profileData.name,
          subtitle: profileData.subtitle,
          image: profileData.image,
          location: profileData.location,
          tours: profileData.toursData || [],
          toursCount: profileData.tours || 0
        },
      },
    });
  };

  const handleLoadMoreAgencies = () => {
    const nextAgencies = agencies.slice(
      visibleAgencies.length,
      visibleAgencies.length + ITEMS_PER_LOAD
    );
    setVisibleAgencies((prev) => [...prev, ...nextAgencies]);
  };

  const handleLoadMoreGuides = () => {
    const nextGuides = guides.slice(
      visibleGuides.length,
      visibleGuides.length + ITEMS_PER_LOAD
    );
    setVisibleGuides((prev) => [...prev, ...nextGuides]);
  };

  const getTitle = () => {
    return activeTab === "agencies" ? "Travel Agencies" : "Local Guides";
  };

  const getDescription = () => {
    return activeTab === "agencies"
      ? "Professional agencies offering comprehensive tour packages across Algeria"
      : "Meet local guides and discover the places they know best";
  };

  const hasMoreAgencies = visibleAgencies.length < agencies.length;
  const hasMoreGuides = visibleGuides.length < guides.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <SearchSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeTab={activeTab}
          />
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      {/* content */}
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-2xl font-bold text-[#193e41] sm:text-3xl">
            {getTitle()}
          </h1>
          <p className="text-gray-600">{getDescription()}</p>


        </motion.div>

        {loading ? <PageState kind="loading" title="Finding local experts" /> : error ? <PageState kind="error" title="Providers unavailable" description="Please check your connection and try again." action={<Button onClick={() => setRetry(value => value + 1)}>Try again</Button>} /> : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {activeTab === "agencies" &&
                filteredAgencies.map((agency, index) => (
                  <AgencyCard
                    key={agency.id}
                    agency={agency}
                    index={index}
                    onViewProfile={() => handleViewProfile(agency, "agency")}
                  />
                ))}

              {activeTab === "guides" &&
                filteredGuides.map((guide, index) => (
                  <GuideCard
                    key={guide.id}
                    guide={guide}
                    index={index}
                    onViewProfile={() => handleViewProfile(guide, "guide")}
                  />
                ))}
            </div>

            <LoadMoreButton
              onClick={handleLoadMoreAgencies}
              visible={activeTab === "agencies" && hasMoreAgencies}
            />
            <LoadMoreButton
              onClick={handleLoadMoreGuides}
              visible={activeTab === "guides" && hasMoreGuides}
            />

            {((activeTab === "agencies" && filteredAgencies.length === 0) ||
              (activeTab === "guides" && filteredGuides.length === 0)) && (
              <PageState title="No providers found" description="Try another name or location, or switch between guides and agencies." action={<Button variant="secondary" onClick={() => setSearchQuery('')}>Clear search</Button>} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TravelAgenciesPage;
