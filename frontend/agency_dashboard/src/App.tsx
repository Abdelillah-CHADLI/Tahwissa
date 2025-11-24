import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AgencyDashboard } from './pages/AgencyDashboard';
import { DashboardOverview } from './pages/DashboardOverview';
import { AgencyEditProfile } from './pages/AgencyEditProfile';
import { AgencyTourPrograms } from './pages/AgencyTourPrograms';
import { AgencyAddTourProgram } from './pages/AgencyAddTourPrograms';
import { ToursPageDetails } from './pages/ToursPageDetails';
import { AgencySettings } from './pages/AgencySettings';
import './App.css';

function App() {
  return (
    <BrowserRouter basename="/agency_dashboard">
      <Routes>
        <Route path="index.html" element={<Navigate to="/" replace />} />
        <Route path="/" element={<AgencyDashboard />}>
          <Route index element={<DashboardOverview />} />
          <Route path="profile" element={<AgencyEditProfile />} />
          <Route path="tour-programs" element={<AgencyTourPrograms />} />
          <Route path="add-tour" element={<AgencyAddTourProgram />} />
          <Route path="tour-details" element={<ToursPageDetails />} />
          <Route path="settings" element={<AgencySettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
