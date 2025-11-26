import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import SearchSection from "../../components/guides_agencies/SearchSection";
import TabNavigation from "../../components/guides_agencies/TabNavigation";
import AgencyCard from "../../components/guides_agencies/AgencyCard";
import GuideCard from "../../components/guides_agencies/GuideCard";
import LoadMoreButton from "../../components/guides_agencies/LoadMoreButton";
import { agencies } from "../../data/agencies";
import { guides } from "../../data/guides";
import { ROUTES } from "../../utils/routes";

const ITEMS_PER_LOAD = 3;

const TravelAgenciesPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("agencies");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleAgencies, setVisibleAgencies] = useState(
    agencies.slice(0, ITEMS_PER_LOAD)
  );
  const [visibleGuides, setVisibleGuides] = useState(
    guides.slice(0, ITEMS_PER_LOAD)
  );

  const filteredAgencies = visibleAgencies.filter(
    (agency) =>
      agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agency.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agency.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGuides = visibleGuides.filter(
    (guide) =>
      guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewProfile = () => {
    navigate(ROUTES.GUIDE_PROFILE);
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
      : "Certified local guides providing personalized experiences and expert knowledge";
  };

  const hasMoreAgencies = visibleAgencies.length < agencies.length;
  const hasMoreGuides = visibleGuides.length < guides.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SearchSection 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeTab={activeTab}
          />
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      {/* content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getTitle()}
          </h1>
          <p className="text-gray-600">{getDescription()}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* agencies */}
          {activeTab === "agencies" &&
            filteredAgencies.map((agency, index) => (
              <AgencyCard
                key={agency.id}
                agency={agency}
                index={index}
                onViewProfile={handleViewProfile}
              />
            ))}

          {/* guides */}
          {activeTab === "guides" &&
            filteredGuides.map((guide, index) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                index={index}
                onViewProfile={handleViewProfile}
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
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No {activeTab === "agencies" ? "agencies" : "guides"} found
              matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelAgenciesPage;
