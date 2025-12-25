import { Routes, Route, useSearchParams } from 'react-router-dom';
import { AgencyDashboard } from './pages/agency/AgencyDashboard';
import { DashboardOverview } from './pages/agency/DashboardOverview';
import { AgencyEditProfile } from './pages/agency/AgencyEditProfile';
import { AgencyTourPrograms } from './pages/agency/AgencyTourPrograms';
import { AgencyBookingPage } from './pages/agency/AgencyBookingPage';
import { AgencyReviewsPage } from './pages/agency/AgencyReviewsPage';
import { AgencySettings } from './pages/agency/AgencySettings';
import { AgencyAddTourProgram } from './pages/agency/AgencyAddTourPrograms';
import { AdminPage } from './pages/agency/AdminPage';
import { PremiumOffersPage } from './pages/agency/PremiumOffersPage';
import { AuthProvider } from './contexts/AuthContext';
import { useEffect } from 'react';
import './App.css';

function AgencyAppContent() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // If user came from redirect with URL params, store them
    const userId = searchParams.get('userId');
    const profileId = searchParams.get('profileId');
    const profileType = searchParams.get('profileType');
    const isManager = searchParams.get('isManager') === 'true';
    const email = searchParams.get('email');
    const agencyId = searchParams.get('agencyId');
    const guideName = searchParams.get('guideName');

    if (userId && !localStorage.getItem('user')) {
      // Create user object from URL params and store in localStorage
      const userFromParams = {
        id: userId,
        userId: userId,
        email: email || '',
        userType: (profileType as 'agency' | 'guide') || 'agency',
        profileId: profileId || userId,
        profileType: (profileType as 'agency' | 'guide') || 'agency',
        isManager: isManager,
        agencyId: agencyId || undefined,
        guideName: guideName || undefined
      };

      console.log('📥 Storing user from URL params:', userFromParams);
      localStorage.setItem('user', JSON.stringify(userFromParams));

      // Clean up URL by removing params (optional)
      // window.history.replaceState({}, '', '/agency');
    }
  }, [searchParams]);

  return (
    <Routes>
      <Route path="" element={<AgencyDashboard />}>
        <Route index element={<DashboardOverview />} />
        <Route path="profile" element={<AgencyEditProfile />} />
        <Route path="tour-programs" element={<AgencyTourPrograms />} />
        <Route path="bookings" element={<AgencyBookingPage />} />
        <Route path="reviews" element={<AgencyReviewsPage />} />
        <Route path="settings" element={<AgencySettings />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="add-tour" element={<AgencyAddTourProgram />} />
        <Route path="premium" element={<PremiumOffersPage />} />
      </Route>
    </Routes>
  );
}

function AgencyApp() {
  return (
    <AuthProvider>
      <AgencyAppContent />
    </AuthProvider>
  );
}

export default AgencyApp;