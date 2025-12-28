import type { User } from '../types/auth';

export function getStoredUser(): User | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

export function getCurrentAgencyId(): string | null {
  // Backward-compat: some pages store agencyId/profileId separately.
  const direct = localStorage.getItem('agencyId') || localStorage.getItem('profileId');
  if (direct) return direct;

  const user = getStoredUser();
  if (!user) return null;

  return (
    (user.agencyId as string | undefined) ||
    (user.profileId as string | undefined) ||
    (user.userId as string | undefined) ||
    (user.id as string | undefined) ||
    null
  );
}

export function syncLegacyIdsFromUser(user: User | null) {
  if (!user) return;

  // Always maintain profileId for older code paths.
  if (user.profileId) {
    localStorage.setItem('profileId', String(user.profileId));
  }

  // Agency convenience key used throughout agency pages.
  if (user.userType === 'agency') {
    const agencyId = user.agencyId || user.profileId || user.id;
    if (agencyId) localStorage.setItem('agencyId', String(agencyId));
  }
}
