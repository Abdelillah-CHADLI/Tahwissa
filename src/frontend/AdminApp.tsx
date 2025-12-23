import { Routes, Route } from 'react-router-dom';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminDashboardOverview } from './pages/admin/AdminDashboardOverview';
import { VerificationRequests } from './pages/admin/VerificationRequests';
import { ReportsManagement } from './pages/admin/ReportsManagement';
import { VerificationRequestDetails } from './pages/admin/VerificationRequestDetails';
import { ReportDetails } from './pages/admin/ReportDetails';
import './App.css';

function AdminApp() {
    return (
        <Routes>
            <Route path="" element={<AdminDashboard />}>
                <Route index element={<AdminDashboardOverview />} />
                <Route path="verifications" element={<VerificationRequests />} />
                <Route path="verifications/:type/:id" element={<VerificationRequestDetails />} />
                <Route path="reports" element={<ReportsManagement />} />
                <Route path="reports/:type/:id" element={<ReportDetails />} />
            </Route>
        </Routes>
    );
}

export default AdminApp;
