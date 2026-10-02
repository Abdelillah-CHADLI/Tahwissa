import type { User } from '../types/auth';

export function isUuid(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  // PostgreSQL also accepts UUIDs without RFC version/variant bits (including
  // the existing demo IDs). Validate their shape without rejecting those rows.
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value.trim()
  );
}

export function getStoredUser(): User | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

export function getCurrentProfileType(): 'agency' | 'guide' | null {
  const user = getStoredUser();
  if (!user) return null;
  return (user.profileType as 'agency' | 'guide') || (user.userType as 'agency' | 'guide') || null;
}

export function getCurrentProfileId(): string | null {
  const direct = localStorage.getItem('profileId') || localStorage.getItem('agencyId');
  if (direct) return direct;

  const user = getStoredUser();
  if (!user) return null;

  return (
    (user.profileId as string | undefined) ||
    (user.agencyId as string | undefined) ||
    (user.userId as string | undefined) ||
    (user.id as string | undefined) ||
    null
  );
}

export function getCurrentAgencyId(): string | null {
  return getCurrentProfileId();
}

export function getCurrentAgencyUuid(): string | null {
  const candidate = getCurrentProfileId();
  return isUuid(candidate) ? candidate : null;
}

export function syncLegacyIdsFromUser(user: User | null) {
  if (!user) return;

  if (user.profileId && isUuid(user.profileId)) {
    localStorage.setItem('profileId', String(user.profileId));
  }

  if (user.userType === 'agency') {
    const agencyId = user.agencyId || user.profileId || user.id;
    if (agencyId && isUuid(agencyId)) {
      localStorage.setItem('agencyId', String(agencyId));
    }
  }
}
