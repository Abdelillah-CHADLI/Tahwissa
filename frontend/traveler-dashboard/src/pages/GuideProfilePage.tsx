import { useState } from "react";
import GuideHeader from "../components/guide_profile/GuideHeader";
import AboutSection from "../components/guide_profile/AboutSection";
import ToursSection from "../components/guide_profile/ToursSection";
import ContactSection from "../components/guide_profile/ContactSection";
import { colors } from "../assets/colors";
import { tours } from "../data/tours";

const GuideProfilePage = () => {
  const [activeSection, setActiveSection] = useState<
    "about" | "tours" | "contact"
  >("about");

  const guide = {
    name: "Ahmed Mansour",
    specialty: "Desert & Sahara Expert",
    location: "Tamamasset, Algeria",
    rating: 4.9,
    toursCount: 87,
    experience: "12 years experience",
    email: "ahmed.mansour@guide.dz",
    phone: "+213 555 123 456",
    about:
      "Passionate desert guide with over 12 years of experience exploring the Sahara...",
    languages: ["Arabic", "French", "English"],
    certifications: [
      "Licensed Tour Guide",
      "First Aid Certified",
      "Desert Navigation Expert",
    ],
    type: "guide" as const,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", // Add profile image
  };

  const handleTourClick = (tourId: string) => {
    console.log("View tour details:", tourId);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "about":
        return <AboutSection guide={guide} />;
      case "tours":
        return (
          <ToursSection
            guideName={guide.name}
            tours={tours}
            onTourClick={handleTourClick}
          />
        );
      case "contact":
        return <ContactSection guide={guide} />;
      default:
        return <AboutSection guide={guide} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => window.history.back()}
            className={`text-[${colors.primary.green}] font-medium hover:text-[${colors.primary.darkTeal}] transition-colors`}
          >
            ← Back to Guides
          </button>
        </div>
      </div>

      <GuideHeader guide={guide} />

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
              Tours
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

      {/* content */}
      <div className="max-w-7xl mx-auto px-6 py-8">{renderActiveSection()}</div>
    </div>
  );
};

export default GuideProfilePage;
