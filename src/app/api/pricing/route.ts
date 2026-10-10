import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/server-store';
import { getCurrentSession, canManagePricing } from '@/lib/auth-session';
import { StudioAddon } from '@/lib/types';

// GET: Fetch all rooms pricing and addons
export async function GET() {
  const db = getDatabase();
  return NextResponse.json({
    success: true,
    rooms: db.rooms,
    addons: db.addons,
  });
}

// PUT: Update an existing room price or addon
export async function PUT(request: Request) {
  const session = await getCurrentSession();
  if (!session || !canManagePricing(session.role)) {
    return NextResponse.json(
      { success: false, error: 'Akses ditolak. Hanya Owner dan Admin yang dapat mengubah tarif studio.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { type, item } = body;
    const db = getDatabase();

    if (type === 'room') {
      const idx = db.rooms.findIndex((r) => r.id === item.id);
      if (idx === -1) {
        return NextResponse.json({ success: false, error: 'Ruangan tidak ditemukan.' }, { status: 404 });
      }
      db.rooms[idx] = { ...db.rooms[idx], ...item };
      saveDatabase(db);
      return NextResponse.json({
        success: true,
        message: `Tarif untuk "${db.rooms[idx].name}" berhasil diperbarui.`,
        room: db.rooms[idx],
      });
    } else if (type === 'addon') {
      const idx = db.addons.findIndex((a) => a.id === item.id);
      if (idx === -1) {
        return NextResponse.json({ success: false, error: 'Layanan add-on tidak ditemukan.' }, { status: 404 });
      }
      db.addons[idx] = { ...db.addons[idx], ...item };
      saveDatabase(db);
      return NextResponse.json({
        success: true,
        message: `Layanan add-on "${db.addons[idx].name}" berhasil diperbarui.`,
        addon: db.addons[idx],
      });
    }

    return NextResponse.json({ success: false, error: 'Tipe perubahan tidak valid.' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memperbarui harga.';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// POST: Add a new addon
export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session || !canManagePricing(session.role)) {
    return NextResponse.json(
      { success: false, error: 'Akses ditolak. Hanya Owner dan Admin yang dapat menambah layanan.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { name, price, category, desc } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Nama layanan dan harga wajib diisi.' },
        { status: 400 }
      );
    }

    const newAddon: StudioAddon = {
      id: `addon-${Date.now()}`,
      name: name.trim(),
      price: Number(price),
      category: category || 'service',
      desc: desc?.trim() || '',
      isActive: true,
    };

    const db = getDatabase();
    db.addons.push(newAddon);
    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: `Layanan add-on "${newAddon.name}" berhasil ditambahkan.`,
      addon: newAddon,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menambahkan layanan.';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// DELETE: Delete an addon
export async function DELETE(request: Request) {
  const session = await getCurrentSession();
  if (!session || !canManagePricing(session.role)) {
    return NextResponse.json(
      { success: false, error: 'Akses ditolak. Hanya Owner dan Admin yang dapat menghapus layanan.' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'ID layanan diperlukan.' }, { status: 400 });
  }

  const db = getDatabase();
  const existing = db.addons.find((a) => a.id === id);
  if (!existing) {
    return NextResponse.json({ success: false, error: 'Layanan tidak ditemukan.' }, { status: 404 });
  }

  db.addons = db.addons.filter((a) => a.id !== id);
  saveDatabase(db);

  return NextResponse.json({
    success: true,
    message: `Layanan "${existing.name}" berhasil dihapus.`,
  });
}
