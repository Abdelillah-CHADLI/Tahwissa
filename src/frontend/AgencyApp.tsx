import { Routes, Route } from 'react-router-dom';
import { AgencyDashboard } from './pages/agency/AgencyDashboard';
import { DashboardOverview } from './pages/agency/DashboardOverview';
import { AgencyEditProfile } from './pages/agency/AgencyEditProfile';
import { AgencyTourPrograms } from './pages/agency/AgencyTourPrograms';
import { AgencyBookingPage } from './pages/agency/AgencyBookingPage';
import { AgencyReviewsPage } from './pages/agency/AgencyReviewsPage';
import { AgencyAddTourProgram } from './pages/agency/AgencyAddTourPrograms';
import './App.css';

function AgencyApp() {
  return (
    <Routes>
      <Route path="" element={<AgencyDashboard />}>
        <Route index element={<DashboardOverview />} />
        <Route path="profile" element={<AgencyEditProfile />} />
        <Route path="tour-programs" element={<AgencyTourPrograms />} />
        <Route path="bookings" element={<AgencyBookingPage />} />
        <Route path="reviews" element={<AgencyReviewsPage />} />
        <Route path="add-tour" element={<AgencyAddTourProgram />} />
      </Route>
    </Routes>
  );
}

export default AgencyApp;
