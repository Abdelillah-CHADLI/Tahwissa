import { Routes, Route } from 'react-router-dom';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminDashboardOverview } from './pages/admin/AdminDashboardOverview';
import { VerificationRequests } from './pages/admin/VerificationRequests';
import { ReportsManagement } from './pages/admin/ReportsManagement';
import './App.css';

function AdminApp() {
    return (
        <Routes>
            <Route path="" element={<AdminDashboard />}>
                <Route index element={<AdminDashboardOverview />} />
                <Route path="verification" element={<VerificationRequests />} />
                <Route path="reports" element={<ReportsManagement />} />
            </Route>
        </Routes>
    );
}

export default AdminApp;
