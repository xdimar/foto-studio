import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/server-store';
import { getCurrentSession, canManagePackages } from '@/lib/auth-session';
import { BookingExperiencePackage } from '@/lib/types';

// GET: Public list of all booking packages
export async function GET() {
  const db = getDatabase();
  return NextResponse.json({
    success: true,
    packages: db.bookingPackages || [],
    total: db.bookingPackages?.length || 0,
  });
}

// POST: Add new booking package (Owner & Admin only)
export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session || !canManagePackages(session.role)) {
    return NextResponse.json(
      { success: false, error: 'Akses ditolak. Hanya Owner dan Admin yang dapat menambah paket booking.' },
      { status: 403 }
    );
  }

  try {
    const body: Partial<BookingExperiencePackage> = await request.json();
    const {
      name,
      badge,
      badgeColor,
      image,
      basePriceTag,
      description,
      durationOptions,
      personOptions,
      features,
    } = body;

    if (!name?.trim() || !image?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Nama paket dan URL foto wajib diisi.' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const newPkg: BookingExperiencePackage = {
      id: `pkg-${Date.now()}`,
      name: name.trim(),
      badge: badge?.trim() || 'Paket Studio',
      badgeColor: badgeColor?.trim() || 'bg-[#720C10] text-white border-[#720C10]/40',
      image: image.trim(),
      basePriceTag: basePriceTag?.trim() || 'Tarif Menyesuaikan',
      description: description?.trim() || '',
      durationOptions: Array.isArray(durationOptions) && durationOptions.length > 0
        ? durationOptions
        : [{ id: 'dur-default', label: '15 Menit', minutes: 15, price: 10000, isPopular: true }],
      personOptions: Array.isArray(personOptions) && personOptions.length > 0
        ? personOptions
        : [{ count: 1, label: '1 Orang (Termasuk)', extraPrice: 0 }],
      features: Array.isArray(features) ? features : [],
      isActive: true,
    };

    db.bookingPackages.push(newPkg);
    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: `Paket ${newPkg.name} berhasil ditambahkan.`,
      package: newPkg,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menambah paket booking.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PUT: Update an existing booking package (Owner & Admin only)
export async function PUT(request: Request) {
  const session = await getCurrentSession();
  if (!session || !canManagePackages(session.role)) {
    return NextResponse.json(
      { success: false, error: 'Akses ditolak. Hanya Owner dan Admin yang dapat mengedit paket booking.' },
      { status: 403 }
    );
  }

  try {
    const body: BookingExperiencePackage = await request.json();
    if (!body || !body.id) {
      return NextResponse.json(
        { success: false, error: 'ID paket wajib disertakan.' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const index = db.bookingPackages.findIndex((p) => p.id === body.id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Paket booking tidak ditemukan.' },
        { status: 404 }
      );
    }

    db.bookingPackages[index] = {
      ...db.bookingPackages[index],
      ...body,
      name: body.name.trim(),
      badge: body.badge.trim(),
      image: body.image.trim(),
      basePriceTag: body.basePriceTag.trim(),
      description: body.description?.trim() || '',
      durationOptions: body.durationOptions || [],
      personOptions: body.personOptions || [],
      features: body.features || [],
      isActive: body.isActive !== undefined ? body.isActive : true,
    };

    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: `Paket ${db.bookingPackages[index].name} berhasil diperbarui.`,
      package: db.bookingPackages[index],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui paket booking.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE: Delete a booking package (Owner & Admin only)
export async function DELETE(request: Request) {
  const session = await getCurrentSession();
  if (!session || !canManagePackages(session.role)) {
    return NextResponse.json(
      { success: false, error: 'Akses ditolak. Hanya Owner dan Admin yang dapat menghapus paket booking.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Parameter ID paket wajib diisi.' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const index = db.bookingPackages.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Paket booking tidak ditemukan.' },
        { status: 404 }
      );
    }

    const removedName = db.bookingPackages[index].name;
    db.bookingPackages.splice(index, 1);
    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: `Paket ${removedName} berhasil dihapus.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menghapus paket booking.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
