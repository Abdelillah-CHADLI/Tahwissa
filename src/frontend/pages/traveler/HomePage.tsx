import { useNavigate } from 'react-router-dom';
import HeroSection from '../../components/home/HeroSection';
import StatsSection from '../../components/home/StatsSection';
import FeaturesSection from '../../components/home/FeatureSection';
import LandscapeSection from '../../components/home/LandscapeSection';
import ProcessSection from '../../components/home/ProcessSection';
import CTASection from '../../components/home/CTASection';
import Footer from '../../components/home/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      // Call auth service to logout from backend
      await authService.logout();
      // Clear frontend auth state
      logout();
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear frontend state even if backend logout fails
      logout();
      navigate('/');
    }
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
      <CTASection onNavigate={handleNavigate} />
      <Footer />
    </div>
  );
}