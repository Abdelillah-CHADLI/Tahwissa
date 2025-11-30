// pages/traveler/HomePage.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/routes';
import HeroSection from '../../components/home/HeroSection';
import StatsSection from '../../components/home/StatsSection';
import FeaturesSection from '../../components/home/FeatureSection';
import LandscapeSection from '../../components/home/LandscapeSection';
import ProcessSection from '../../components/home/ProcessSection';
import CTASection from '../../components/home/CTASection';
import Footer from '../../components/home/Footer';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection 
        onNavigate={handleNavigate} 
        user={user} 
        onLogout={handleLogout} 
      />
      <StatsSection />
      <FeaturesSection />
      <LandscapeSection />
      <ProcessSection />
      <CTASection onNavigate={handleNavigate} user={user} />
      <Footer />
    </div>
  );
}