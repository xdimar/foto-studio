import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/server-store';
import { getCurrentSession, canManageSpaces } from '@/lib/auth-session';
import { StudioSpaceItem } from '@/lib/types';

// GET: Public endpoint to fetch all active studio spaces
export async function GET() {
  const db = getDatabase();
  return NextResponse.json({
    success: true,
    spaces: db.spaces || [],
  });
}

// POST: Add new studio space (Owner & Admin only)
export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session || !canManageSpaces(session.role)) {
    return NextResponse.json(
      { success: false, error: 'Akses ditolak. Hanya Owner dan Admin yang dapat menambah ruang studio.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const {
      name,
      number,
      tagline,
      image,
      secondaryImage,
      area,
      ceiling,
      cove,
      power,
      hourlyRate,
      idealFor,
      equipmentIncluded,
      features,
    } = body;

    if (!name || !image) {
      return NextResponse.json(
        { success: false, error: 'Nama ruangan dan foto utama wajib diisi.' },
        { status: 400 }
      );
    }

    const newSpace: StudioSpaceItem = {
      id: `space-${Date.now()}`,
      number: number || '00',
      name: name.trim(),
      tagline: tagline?.trim() || '',
      image: image.trim(),
      secondaryImage: secondaryImage?.trim() || '',
      area: area?.trim() || '100 m²',
      ceiling: ceiling?.trim() || '5,0m',
      cove: cove?.trim() || '',
      power: power?.trim() || '32A',
      hourlyRate: hourlyRate?.trim() || 'Rp 300.000 / jam',
      idealFor: Array.isArray(idealFor) ? idealFor : [],
      equipmentIncluded: Array.isArray(equipmentIncluded) ? equipmentIncluded : [],
      features: Array.isArray(features) ? features : [],
      isActive: true,
    };

    const db = getDatabase();
    if (!db.spaces) db.spaces = [];
    db.spaces.push(newSpace);
    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: `Ruangan "${newSpace.name}" berhasil ditambahkan.`,
      space: newSpace,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menambahkan ruangan.';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// PUT: Update an existing studio space (Owner & Admin only)
export async function PUT(request: Request) {
  const session = await getCurrentSession();
  if (!session || !canManageSpaces(session.role)) {
    return NextResponse.json(
      { success: false, error: 'Akses ditolak. Hanya Owner dan Admin yang dapat mengubah ruang studio.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID ruangan wajib disertakan.' }, { status: 400 });
    }

    const db = getDatabase();
    if (!db.spaces) db.spaces = [];
    const idx = db.spaces.findIndex((s) => s.id === id);

    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Ruang studio tidak ditemukan.' }, { status: 404 });
    }

    db.spaces[idx] = {
      ...db.spaces[idx],
      ...updates,
    };
    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: `Ruang studio "${db.spaces[idx].name}" berhasil diperbarui.`,
      space: db.spaces[idx],
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal memperbarui ruang studio.';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// DELETE: Remove a studio space (Owner & Admin only)
export async function DELETE(request: Request) {
  const session = await getCurrentSession();
  if (!session || !canManageSpaces(session.role)) {
    return NextResponse.json(
      { success: false, error: 'Akses ditolak. Hanya Owner dan Admin yang dapat menghapus ruang studio.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID ruangan wajib disertakan.' }, { status: 400 });
    }

    const db = getDatabase();
    if (!db.spaces) db.spaces = [];
    const initialLen = db.spaces.length;
    db.spaces = db.spaces.filter((s) => s.id !== id);

    if (db.spaces.length === initialLen) {
      return NextResponse.json({ success: false, error: 'Ruang studio tidak ditemukan.' }, { status: 404 });
    }

    saveDatabase(db);
    return NextResponse.json({
      success: true,
      message: 'Ruang studio berhasil dihapus.',
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menghapus ruang studio.';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
