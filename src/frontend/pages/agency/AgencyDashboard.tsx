import { useEffect, useState } from 'react';
import { LayoutDashboard, Building2, Package, Calendar, Star, Settings, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { profileService } from '../../services/api';
import { getCurrentAgencyUuid, getCurrentProfileType } from '../../utils/session';
import { WorkspaceShell } from '../../components/ui/WorkspaceShell';

export function AgencyDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const guide = user?.userType === 'guide';
  const [profile, setProfile] = useState<{ name?: string; logo?: string; verified?: boolean; managerId?: string }>({});
  useEffect(() => {
    const id = getCurrentAgencyUuid();
    const type = getCurrentProfileType();
    if (!id || !type) return;
    let active = true;
    profileService.getProfile(id, type).then(response => {
      const data = response.data || response.profile;
      if (active && data) setProfile({ name: data.agency_name || data.guide_name, logo: data.agency_logo, verified: data.verified, managerId: data.manager_id });
    }).catch(error => console.error('Failed to load provider profile:', error));
    return () => { active = false; };
  }, []);
  const isManager = profile.managerId === (user?.id || user?.userId);
  return <WorkspaceShell title={guide ? 'Guide workspace' : 'Agency workspace'} accountName={profile.name || user?.agencyName || user?.name || 'Your account'} image={profile.logo} verified={profile.verified}
    items={[
      { path: '/agency', label: 'Overview', icon: LayoutDashboard, end: true },
      { path: '/agency/profile', label: guide ? 'Guide profile' : 'Agency profile', icon: Building2 },
      { path: '/agency/tour-programs', label: 'Tour programs', icon: Package },
      { path: '/agency/bookings', label: 'Booking requests', icon: Calendar },
      { path: '/agency/reviews', label: 'Reviews & ratings', icon: Star },
      { path: '/agency/settings', label: 'Settings', icon: Settings },
      ...(isManager && !guide ? [{ path: '/agency/admin', label: 'Team members', icon: Shield }] : []),
    ]}
    onLogout={() => { authService.logout(); logout(); navigate('/traveler'); }} />;
}
