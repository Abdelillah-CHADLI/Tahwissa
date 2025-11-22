import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import { ROUTES } from './utils/routes';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import GuidesPage from './pages/GuidesPage';
import CommunityPage from './pages/CommunityPage';
import RequestsPage from './pages/RequestsPage';
import ProfilePage from './pages/ProfilePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import GuideProfilePage from './pages/GuideProfilePage';

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
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.EXPLORE} element={<ExplorePage />} />
          <Route path={ROUTES.GUIDES} element={<GuidesPage />} />
          <Route path={ROUTES.COMMUNITY} element={<CommunityPage />} />
          <Route path={ROUTES.REQUESTS} element={<RequestsPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.SIGN_IN} element={<SignInPage />} />
          <Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />
          <Route path={ROUTES.GUIDE_PROFILE} element={<GuideProfilePage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;