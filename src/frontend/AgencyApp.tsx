import { Routes, Route, Navigate } from 'react-router-dom';
import { AgencyDashboard } from './pages/agency/AgencyDashboard';
import { DashboardOverview } from './pages/agency/DashboardOverview';
import { AgencyEditProfile } from './pages/agency/AgencyEditProfile';
import { AgencyTourPrograms } from './pages/agency/AgencyTourPrograms';
import { AgencyBookingPage } from './pages/agency/AgencyBookingPage';
import { AgencyReviewsPage } from './pages/agency/AgencyReviewsPage';
import { AgencySettings } from './pages/agency/AgencySettings';
import { AgencyAddTourProgram } from './pages/agency/AgencyAddTourPrograms';
import { AgencyEditTourProgram } from './pages/agency/AgencyEditTourProgram';
import { AdminPage } from './pages/agency/AdminPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

function AgencyAppContent() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="grid min-h-screen place-items-center text-sm text-slate-600">Restoring your session…</div>;
  if (!user || !['agency', 'guide'].includes(user.userType)) return <Navigate to="/traveler/signin" replace />;

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
        <Route path="edit-tour/:tourId" element={<AgencyEditTourProgram />} />
        <Route path="*" element={<Navigate to="/agency" replace />} />
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
