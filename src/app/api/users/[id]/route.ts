import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/server-store';
import { getCurrentSession, canManageUsers } from '@/lib/auth-session';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session || !canManageUsers(session.role)) {
    return NextResponse.json(
      { success: false, error: 'Akses ditolak. Hanya Owner dan Admin yang dapat mengubah data user.' },
      { status: 403 }
    );
  }

  const { id } = await params;
  const db = getDatabase();
  const userIndex = db.users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return NextResponse.json({ success: false, error: 'User tidak ditemukan.' }, { status: 404 });
  }

  const existingUser = db.users[userIndex];

  // Prevent non-owner from modifying an owner
  if (existingUser.role === 'owner' && session.role !== 'owner') {
    return NextResponse.json(
      { success: false, error: 'Hanya Owner yang dapat mengubah akun Owner.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { name, username, passcode, role, status, email, phone, notes } = body;

    // Check username uniqueness if changed
    if (username && username.trim().toLowerCase() !== existingUser.username.toLowerCase()) {
      const cleanUsername = username.trim().toLowerCase();
      if (db.users.some((u) => u.id !== id && u.username.toLowerCase() === cleanUsername)) {
        return NextResponse.json(
          { success: false, error: `Username "${cleanUsername}" sudah digunakan oleh akun lain.` },
          { status: 400 }
        );
      }
      existingUser.username = cleanUsername;
    }

    if (name) existingUser.name = name.trim();
    if (passcode !== undefined) {
      existingUser.passcode = passcode.trim();
      existingUser.password = passcode.trim();
    }
    if (role && (session.role === 'owner' || role !== 'owner')) {
      existingUser.role = role;
    }
    if (status) existingUser.status = status;
    if (email !== undefined) existingUser.email = email.trim() || undefined;
    if (phone !== undefined) existingUser.phone = phone.trim() || undefined;
    if (notes !== undefined) existingUser.notes = notes.trim() || undefined;

    db.users[userIndex] = existingUser;
    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: `Data user "${existingUser.name}" berhasil diperbarui.`,
      user: existingUser,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memperbarui user.';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session || !canManageUsers(session.role)) {
    return NextResponse.json(
      { success: false, error: 'Akses ditolak. Hanya Owner dan Admin yang dapat menghapus user.' },
      { status: 403 }
    );
  }

  const { id } = await params;

  // Cannot delete self
  if (session.userId === id) {
    return NextResponse.json(
      { success: false, error: 'Anda tidak dapat menghapus akun Anda sendiri saat sedang login.' },
      { status: 400 }
    );
  }

  const db = getDatabase();
  const targetUser = db.users.find((u) => u.id === id);

  if (!targetUser) {
    return NextResponse.json({ success: false, error: 'User tidak ditemukan.' }, { status: 404 });
  }

  if (targetUser.role === 'owner') {
    if (session.role !== 'owner') {
      return NextResponse.json(
        { success: false, error: 'Akun Owner hanya dapat dihapus oleh Owner lain.' },
        { status: 403 }
      );
    }
    const activeOwnerCount = db.users.filter((u) => u.role === 'owner' && u.status === 'active').length;
    if (activeOwnerCount <= 1) {
      return NextResponse.json(
        { success: false, error: 'Tidak dapat menghapus Owner terakhir. Studio harus memiliki minimal satu akun Owner aktif.' },
        { status: 400 }
      );
    }
  }

  db.users = db.users.filter((u) => u.id !== id);
  saveDatabase(db);

  return NextResponse.json({
    success: true,
    message: `User "${targetUser.name}" (${targetUser.role}) berhasil dihapus.`,
  });
}
