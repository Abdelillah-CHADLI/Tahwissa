import { Routes, Route } from 'react-router-dom';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminDashboardOverview } from './pages/admin/AdminDashboardOverview';
import './App.css';

function VerificationRequests() {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Verification Requests</h2>
        </div>
    );
}

function ReportsManagement() {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Reports Management</h2>
        </div>
    );
}

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
