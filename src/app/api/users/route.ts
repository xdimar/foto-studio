import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/server-store';
import { getCurrentSession, canManageUsers } from '@/lib/auth-session';
import { StudioUser, StudioRole } from '@/lib/types';

// GET: List users
export async function GET(request: Request) {
  const session = await getCurrentSession();
  if (!session || !canManageUsers(session.role)) {
    return NextResponse.json(
      { success: false, error: 'Akses ditolak. Hanya Owner dan Admin yang dapat mengelola user.' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const roleFilter = searchParams.get('role');
  const search = searchParams.get('search')?.toLowerCase();

  const db = getDatabase();
  let users = db.users;

  if (roleFilter && roleFilter !== 'all') {
    users = users.filter((u) => u.role === roleFilter);
  }

  if (search) {
    users = users.filter(
      (u) =>
        u.name.toLowerCase().includes(search) ||
        u.username.toLowerCase().includes(search) ||
        (u.email && u.email.toLowerCase().includes(search))
    );
  }

  return NextResponse.json({
    success: true,
    users,
    total: users.length,
  });
}

// POST: Create a new user / staff with username & passcode
export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session || !canManageUsers(session.role)) {
    return NextResponse.json(
      { success: false, error: 'Akses ditolak. Hanya Owner dan Admin yang dapat menambah pengguna/staf.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { name, username, passcode, password, role, email, phone, notes } = body;

    if (!name || !username || !role) {
      return NextResponse.json(
        { success: false, error: 'Nama, username, dan role wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const validRoles: StudioRole[] = ['owner', 'admin', 'kasir', 'magang', 'user'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Role yang dipilih tidak valid.' },
        { status: 400 }
      );
    }

    // Only owner can create another owner
    if (role === 'owner' && session.role !== 'owner') {
      return NextResponse.json(
        { success: false, error: 'Hanya Owner yang berhak menunjuk Owner baru.' },
        { status: 403 }
      );
    }

    const db = getDatabase();

    // Check duplicate username
    if (db.users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      return NextResponse.json(
        { success: false, error: `Username "${cleanUsername}" sudah digunakan. Gunakan username lain.` },
        { status: 400 }
      );
    }

    // Check duplicate email if provided
    if (email && db.users.some((u) => u.email && u.email.toLowerCase() === email.trim().toLowerCase())) {
      return NextResponse.json(
        { success: false, error: `Email "${email}" sudah terdaftar.` },
        { status: 400 }
      );
    }

    const newUser: StudioUser = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: name.trim(),
      username: cleanUsername,
      passcode: passcode?.trim() || '123456',
      password: password?.trim() || passcode?.trim() || 'password123',
      role,
      status: 'active',
      email: email?.trim() || undefined,
      phone: phone?.trim() || undefined,
      notes: notes?.trim() || undefined,
      createdAt: new Date().toISOString(),
      createdBy: session.username,
    };

    db.users.unshift(newUser);
    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: `Berhasil membuat akun ${role} untuk "${newUser.name}".`,
      user: newUser,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan user.';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
