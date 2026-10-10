import { cookies } from 'next/headers';
import crypto from 'crypto';
import { StaffSession, StudioRole } from './types';
import { getDatabase } from './server-store';

export const SESSION_COOKIE = 'origine_session';
const SECRET = process.env.SESSION_SECRET || 'origine_studio_secure_salt_2026_poncokusumo';

export function signSession(session: StaffSession): string {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string): StaffSession | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length === 2) {
    const [payload, signature] = parts;
    const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
    try {
      if (
        signature.length === expected.length &&
        crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
      ) {
        return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
      }
    } catch {
      return null;
    }
    return null;
  }
  // Fallback for legacy unsigned JSON during development
  if (process.env.NODE_ENV !== 'production') {
    try {
      return JSON.parse(token);
    } catch {
      return null;
    }
  }
  return null;
}

export async function getCurrentSession(): Promise<StaffSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const parsed = verifySessionToken(sessionCookie);
    if (!parsed || !parsed.userId) {
      return null;
    }
    // Verify user still exists and is active in database
    const db = getDatabase();
    const user = db.users.find((u) => u.id === parsed.userId && u.status === 'active');
    if (!user) {
      return null;
    }
    // Return updated session with current role
    return {
      userId: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      email: user.email,
      loginTime: parsed.loginTime,
    };
  } catch {
    return null;
  }
}

export function canManageUsers(role: StudioRole): boolean {
  return role === 'owner' || role === 'admin';
}

export function canManagePricing(role: StudioRole): boolean {
  return role === 'owner' || role === 'admin';
}

export function canManageGallery(role: StudioRole): boolean {
  return role === 'owner' || role === 'admin';
}

export function canManageBookings(role: StudioRole): boolean {
  return role === 'owner' || role === 'admin' || role === 'kasir';
}

export function canViewCalendar(role: StudioRole): boolean {
  return role === 'owner' || role === 'admin' || role === 'kasir' || role === 'magang';
}

export function canManageSpaces(role: StudioRole): boolean {
  return role === 'owner' || role === 'admin';
}

export function canManageAbout(role: StudioRole): boolean {
  return role === 'owner' || role === 'admin';
}

export function canManageSettings(role: StudioRole): boolean {
  return role === 'owner' || role === 'admin';
}

export function canManagePackages(role: StudioRole): boolean {
  return role === 'owner' || role === 'admin';
}
