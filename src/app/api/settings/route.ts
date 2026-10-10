import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/server-store';
import { getCurrentSession, canManageSettings } from '@/lib/auth-session';
import { StudioContactSettings } from '@/lib/types';

// GET: Public endpoint to fetch studio settings & contact information
export async function GET() {
  const db = getDatabase();
  return NextResponse.json({
    success: true,
    settings: db.settings,
  });
}

// PUT: Update contact & studio general settings (Owner & Admin only)
export async function PUT(request: Request) {
  const session = await getCurrentSession();
  if (!session || !canManageSettings(session.role)) {
    return NextResponse.json(
      { success: false, error: 'Akses ditolak. Hanya Owner dan Admin yang dapat mengubah kontak dan pengaturan studio.' },
      { status: 403 }
    );
  }

  try {
    const body: Partial<StudioContactSettings> = await request.json();
    const db = getDatabase();

    if (!db.settings) {
      db.settings = {
        brandName: 'Origine Studio',
        tagline: 'Timeless Memories From the Origine',
        phone: '+62 851-9667-1398',
        whatsappNumber: '6285196671398',
        email: 'concierge@origine-studio.my.id',
        addressLine1: 'Jl. Raya Belung, Belung',
        addressSubdistrict: 'Kec. Poncokusumo',
        addressCity: 'Kabupaten Malang, Jawa Timur 65157',
        googleMapsUrl: 'https://maps.app.goo.gl/XUjKjMeSeEBewEgq6',
        operatingHours: '08:00 - 22:00 WIB',
        instagramHandle: '@originestudio',
      };
    }

    db.settings = {
      ...db.settings,
      ...body,
    };

    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: 'Pengaturan dan kontak studio berhasil diperbarui.',
      settings: db.settings,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal memperbarui pengaturan studio.';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
