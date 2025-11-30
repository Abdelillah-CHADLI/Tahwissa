// TravelerApp.tsx
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from '../frontend/contexts/AuthContext';
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

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === ROUTES.SIGN_IN ||
    location.pathname === ROUTES.SIGN_UP ||
    location.pathname === ROUTES.PROFILE_COMPLETION;

  const showHeader = !isAuthPage;

  const handleProfileComplete = () => {
    const accountType = location.state?.accountType || 'traveler';

    if (accountType === 'agency' || accountType === 'guide') {
      navigate('/agency');
    } else {
      navigate(ROUTES.HOME);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && <Header />}
      <main>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="guides" element={<GuidesPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="guide-profile" element={<GuideProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="add-post" element={<AddPostPage />} />
          <Route path="details/:tourId" element={<DetailsPage />} />
          <Route path="booking" element={<BookingPage />} />
          <Route
            path="profile-completion"
            element={
              <ProfileCompletionPage
                onComplete={handleProfileComplete}
                {...(location.state || {})}
              />
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