import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/server-store';
import { getCurrentSession, canManageAbout } from '@/lib/auth-session';
import { StudioAboutContent } from '@/lib/types';

// GET: Public endpoint to fetch studio about content & team
export async function GET() {
  const db = getDatabase();
  return NextResponse.json({
    success: true,
    about: db.about,
  });
}

// PUT: Update about content, team roster, values & clients (Owner & Admin only)
export async function PUT(request: Request) {
  const session = await getCurrentSession();
  if (!session || !canManageAbout(session.role)) {
    return NextResponse.json(
      { success: false, error: 'Akses ditolak. Hanya Owner dan Admin yang dapat mengubah profil dan tim studio.' },
      { status: 403 }
    );
  }

  try {
    const body: Partial<StudioAboutContent> = await request.json();
    const db = getDatabase();

    if (!db.about) {
      db.about = {
        heroTitle: '',
        heroSubtitle: '',
        storyParagraph1: '',
        storyParagraph2: '',
        ethosQuote: '',
        team: [],
        values: [],
        clientBrands: [],
      };
    }

    db.about = {
      ...db.about,
      ...body,
    };

    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: 'Profil dan informasi studio berhasil diperbarui.',
      about: db.about,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal memperbarui profil studio.';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
