import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import FeaturesSection from '../components/home/FeatureSection';
import LandscapeSection from '../components/home/LandscapeSection';
import ProcessSection from '../components/home/ProcessSection';
import CTASection from '../components/home/CTASection';
import Footer from '../components/home/Footer';

export default function HomePage() {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection onNavigate={handleNavigate} />
      <StatsSection />
      <FeaturesSection />
      <LandscapeSection />
      <ProcessSection />
      <CTASection onNavigate={handleNavigate} />
      <Footer />
    </div>
  );
}