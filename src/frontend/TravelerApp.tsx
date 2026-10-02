import type { ReactNode } from 'react';
import { PageState } from './components/ui';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from '../frontend/contexts/AuthContext';
import { useAuth } from '../frontend/contexts/AuthContext';
import { useEffect } from 'react';
import Header from './components/Header';
import { ROUTES } from './utils/routes';
import HomePage from './pages/traveler/HomePage';
import ExplorePage from './pages/traveler/ExplorePage';
import GuidesPage from './pages/traveler/GuidesPage';
import CommunityPage from './pages/traveler/CommunityPage';
import RequestsPage from './pages/traveler/RequestsPage';
import ProfilePage from './pages/traveler/ProfilePage';
import SignInPage from './pages/traveler/SignInPage';
import SignUpPage from './pages/traveler/SignUpPage';
import GuideProfilePage from './pages/traveler/GuideProfilePage';
import NotificationsPage from './pages/traveler/NotificationsPage';
import AddPostPage from './pages/traveler/AddPostPage';
import DetailsPage from './pages/traveler/DetailsPage';
import { BookingPage } from './pages/traveler/BookingPage';
import { ProfileCompletionPage } from './pages/traveler/ProfileCompletionPage';

function TravelerOnly({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <div className="page-shell"><PageState kind="loading" title="Restoring your session" /></div>;
  if (!user) return <Navigate to="/traveler/signin" state={{ from: location.pathname }} replace />;
  return children;
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAuthPage = location.pathname === ROUTES.SIGN_IN ||
    location.pathname === ROUTES.SIGN_UP ||
    location.pathname === ROUTES.PROFILE_COMPLETION;

  const showHeader = !isAuthPage;

  useEffect(() => {
  if (user && (user.userType === "agency" || user.userType === "guide")) {
    navigate('/agency', { replace: true });
  }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && <Header />}
      <main id="traveler-content">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="guides" element={<GuidesPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="requests" element={<TravelerOnly><RequestsPage /></TravelerOnly>} />
          <Route path="profile" element={<TravelerOnly><ProfilePage /></TravelerOnly>} />
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="guide-profile" element={<GuideProfilePage />} />
          <Route path="guide-profile/:type/:id" element={<GuideProfilePage />} />
          <Route path="notifications" element={<TravelerOnly><NotificationsPage /></TravelerOnly>} />
          <Route path="add-post" element={<AddPostPage />} />
          <Route path="details/:tourId" element={<DetailsPage />} />
          <Route path="booking/:tourId" element={<BookingPage />} />
          <Route
            path="profile-completion"
            element={
              <TravelerOnly><ProfileCompletionPage /></TravelerOnly>
            }
          />
          <Route path="*" element={<Navigate to="/traveler" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function TravelerApp() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default TravelerApp;
