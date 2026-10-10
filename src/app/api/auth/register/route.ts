import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/server-store';
import { cookies } from 'next/headers';
import { StudioUser, StaffSession } from '@/lib/types';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { signSession, SESSION_COOKIE } from '@/lib/auth-session';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, agency, email, password, phone } = body;

    if (!fullName || !fullName.trim()) {
      return NextResponse.json(
        { success: false, error: 'Nama lengkap produser wajib diisi.' },
        { status: 400 }
      );
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Alamat email tidak valid.' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Kata sandi minimal harus 6 karakter.' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const cleanEmail = email.trim().toLowerCase();

    // Check if email already registered
    if (db.users.some((u) => u.email && u.email.toLowerCase() === cleanEmail)) {
      return NextResponse.json(
        { success: false, error: 'Alamat email ini sudah terdaftar. Silakan login.' },
        { status: 400 }
      );
    }

    // Generate base username
    let baseUsername = cleanEmail.split('@')[0].replace(/[^a-z0-9_]/g, '_');
    if (baseUsername.length < 3) baseUsername = `client_${baseUsername}`;
    let finalUsername = baseUsername;
    let counter = 1;

    while (db.users.some((u) => u.username.toLowerCase() === finalUsername.toLowerCase())) {
      finalUsername = `${baseUsername}${counter}`;
      counter++;
    }

    const newUser: StudioUser = {
      id: `usr-client-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: fullName.trim(),
      email: cleanEmail,
      username: finalUsername,
      password: password,
      passcode: password.slice(0, 8),
      role: 'user',
      status: 'active',
      phone: phone?.trim() || '',
      notes: agency?.trim() ? `Agensi/Produksi: ${agency.trim()}` : 'Pendaftaran Klien Mandiri via Web',
      createdAt: new Date().toISOString(),
      createdBy: 'self-register',
    };

    db.users.push(newUser);
    saveDatabase(db);

    // Optional: register in Supabase Auth if credentials configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createSupabaseClient(supabaseUrl, supabaseKey);
        await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              full_name: fullName.trim(),
              agency: agency?.trim() || '',
            },
          },
        });
      } catch (sbErr) {
        console.warn('Optional Supabase signup sync notice:', sbErr);
      }
    }

    // Automatically set signed session cookie for instant login
    const session: StaffSession = {
      userId: newUser.id,
      name: newUser.name,
      username: newUser.username,
      role: newUser.role,
      email: newUser.email,
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

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil! Mengalihkan ke portal reservasi...',
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        role: newUser.role,
        email: newUser.email,
      },
      redirectUrl: '/admin/my-bookings',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat mendaftar.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
