import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminDashboardOverview } from './pages/admin/AdminDashboardOverview';
import { VerificationRequests } from './pages/admin/VerificationRequests';
import { ReportsManagement } from './pages/admin/ReportsManagement';
import { VerificationRequestDetails } from './pages/admin/VerificationRequestDetails';
import { ReportDetails } from './pages/admin/ReportDetails';
import './App.css';
import { PageState } from './components/ui';

function AdminAppContent() {
    const { user, isLoading } = useAuth();
    if (isLoading) return <div className="page-shell"><PageState kind="loading" title="Restoring your session" /></div>;
    if (user?.userType !== 'admin') return <Navigate to="/traveler/signin" replace />;
    return (
        <Routes>
            <Route path="" element={<AdminDashboard />}>
                <Route index element={<AdminDashboardOverview />} />
                <Route path="verifications" element={<VerificationRequests />} />
                <Route path="verifications/:type/:id" element={<VerificationRequestDetails />} />
                <Route path="reports" element={<ReportsManagement />} />
                <Route path="reports/:type/:id" element={<ReportDetails />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
        </Routes>
    );
}

function AdminApp() {
    return <AuthProvider><AdminAppContent /></AuthProvider>;
}

export default AdminApp;
