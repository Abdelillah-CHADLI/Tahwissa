import { LayoutDashboard, Shield, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { WorkspaceShell } from '../../components/ui/WorkspaceShell';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return <WorkspaceShell title="Administration" accountName={user?.name || 'Administrator'}
    items={[
      { path: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
      { path: '/admin/verifications', label: 'Verification requests', icon: Shield },
      { path: '/admin/reports', label: 'Reports', icon: MessageSquare },
    ]}
    onLogout={() => { authService.logout(); logout(); navigate('/'); }} />;
}
