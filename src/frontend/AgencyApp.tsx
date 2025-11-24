import { Routes, Route } from 'react-router-dom';
import { AgencyDashboard } from './pages/agency/AgencyDashboard';
import { DashboardOverview } from './pages/agency/DashboardOverview';
import { AgencyEditProfile } from './pages/agency/AgencyEditProfile';
import { AgencyTourPrograms } from './pages/agency/AgencyTourPrograms';
import { AgencyAddTourProgram } from './pages/agency/AgencyAddTourPrograms';
import { ToursPageDetails } from './pages/agency/ToursPageDetails';
import { AgencySettings } from './pages/agency/AgencySettings';
import './App.css';

function AgencyApp() {
  return (
    <Routes>
      <Route path="" element={<AgencyDashboard />}>
          <Route index element={<DashboardOverview />} />
          <Route path="profile" element={<AgencyEditProfile />} />
          <Route path="tour-programs" element={<AgencyTourPrograms />} />
          <Route path="add-tour" element={<AgencyAddTourProgram />} />
          <Route path="tour-details" element={<ToursPageDetails />} />
          <Route path="settings" element={<AgencySettings />} />
        </Route>
    </Routes>
  );
}

export default AgencyApp;
