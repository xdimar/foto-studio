import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/server-store';
import { cookies } from 'next/headers';
import { StaffSession } from '@/lib/types';
import { signSession, SESSION_COOKIE } from '@/lib/auth-session';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mode, email, password, username, passcode } = body;
    const db = getDatabase();

    let matchedUser = null;

    if (mode === 'staff' || username || passcode) {
      // Username + Passcode / PIN mode (designed for Kasir, Magang, Admin, Owner)
      matchedUser = db.users.find(
        (u) =>
          u.username.toLowerCase() === (username || '').trim().toLowerCase() &&
          (u.passcode === passcode || u.password === passcode) &&
          u.status === 'active'
      );
    } else {
      // Standard Email + Password mode
      matchedUser = db.users.find(
        (u) =>
          u.email &&
          u.email.toLowerCase() === (email || '').trim().toLowerCase() &&
          (u.password === password || u.passcode === password) &&
          u.status === 'active'
      );
    }

    if (!matchedUser) {
      return NextResponse.json(
        {
          success: false,
          error:
            mode === 'staff'
              ? 'Username atau Kode Akses tidak sesuai atau akun dinonaktifkan.'
              : 'Email atau kata sandi tidak cocok. Silakan periksa kembali.',
        },
        { status: 401 }
      );
    }

    const session: StaffSession = {
      userId: matchedUser.id,
      name: matchedUser.name,
      username: matchedUser.username,
      role: matchedUser.role,
      email: matchedUser.email,
      loginTime: new Date().toISOString(),
    };

    const cookieStore = await cookies();
    const signedToken = signSession(session);

    cookieStore.set(SESSION_COOKIE, signedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    const redirectUrl =
      matchedUser.role === 'user'
        ? '/admin/my-bookings'
        : '/admin';

    return NextResponse.json({
      success: true,
      user: {
        id: matchedUser.id,
        name: matchedUser.name,
        username: matchedUser.username,
        role: matchedUser.role,
        email: matchedUser.email,
      },
      redirectUrl,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan sistem.';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
