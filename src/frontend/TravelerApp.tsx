import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
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

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === ROUTES.SIGN_IN || 
                     location.pathname === ROUTES.SIGN_UP || 
                     location.pathname === ROUTES.PROFILE;
  const showHeader = !isAuthPage;

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && <Header />}
      <main>
        <Routes>
          <Route path="index.html" element={<Navigate to={ROUTES.HOME} replace />} />
          <Route path="" element={<HomePage />} />
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
          <Route path="details" element={<DetailsPage />} />
        </Routes>
      </main>
    </div>
  );
}

function TravelerApp() {
  return (
    <AppContent />
  );
}

export default TravelerApp;