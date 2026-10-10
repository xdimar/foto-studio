import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/server-store';
import { getCurrentSession, canManageGallery } from '@/lib/auth-session';
import { StudioGalleryItem } from '@/lib/types';

// GET: List all gallery items
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  const db = getDatabase();
  let gallery = db.gallery;

  if (category && category !== 'all') {
    gallery = gallery.filter((item) => item.category.toLowerCase() === category.toLowerCase());
  }

  return NextResponse.json({
    success: true,
    gallery,
    total: gallery.length,
  });
}

// POST: Add new photo to gallery (Owner, Admin)
export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session || !canManageGallery(session.role)) {
    return NextResponse.json(
      { success: false, error: 'Akses ditolak. Hanya Owner dan Admin yang dapat menambah foto galeri.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { title, category, imageUrl, photographer, client, featured, aspectRatio } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Judul karya dan URL gambar wajib diisi.' },
        { status: 400 }
      );
    }

    const newItem: StudioGalleryItem = {
      id: `gal-${Date.now()}`,
      title: title.trim(),
      category: category || 'Editorial',
      imageUrl: imageUrl.trim(),
      photographer: photographer?.trim() || session.name,
      date: new Date().toISOString().split('T')[0],
      client: client?.trim() || undefined,
      featured: Boolean(featured),
      aspectRatio: aspectRatio || 'portrait',
    };

    const db = getDatabase();
    db.gallery.unshift(newItem);
    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: `Karya "${newItem.title}" berhasil ditambahkan ke galeri.`,
      item: newItem,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menambahkan foto ke galeri.';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// PUT: Update gallery item
export async function PUT(request: Request) {
  const session = await getCurrentSession();
  if (!session || !canManageGallery(session.role)) {
    return NextResponse.json(
      { success: false, error: 'Akses ditolak. Hanya Owner dan Admin yang dapat mengedit karya galeri.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { id, title, category, imageUrl, photographer, client, featured, aspectRatio } = body;

    const db = getDatabase();
    const idx = db.gallery.findIndex((g) => g.id === id);

    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Karya galeri tidak ditemukan.' }, { status: 404 });
    }

    if (title) db.gallery[idx].title = title.trim();
    if (category) db.gallery[idx].category = category;
    if (imageUrl) db.gallery[idx].imageUrl = imageUrl.trim();
    if (photographer) db.gallery[idx].photographer = photographer.trim();
    if (client !== undefined) db.gallery[idx].client = client.trim() || undefined;
    if (featured !== undefined) db.gallery[idx].featured = Boolean(featured);
    if (aspectRatio) db.gallery[idx].aspectRatio = aspectRatio;

    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: `Karya "${db.gallery[idx].title}" berhasil diperbarui.`,
      item: db.gallery[idx],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memperbarui karya galeri.';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// DELETE: Remove photo from gallery
export async function DELETE(request: Request) {
  const session = await getCurrentSession();
  if (!session || !canManageGallery(session.role)) {
    return NextResponse.json(
      { success: false, error: 'Akses ditolak. Hanya Owner dan Admin yang dapat menghapus karya galeri.' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'ID karya galeri diperlukan.' }, { status: 400 });
  }

  const db = getDatabase();
  const existing = db.gallery.find((g) => g.id === id);
  if (!existing) {
    return NextResponse.json({ success: false, error: 'Karya galeri tidak ditemukan.' }, { status: 404 });
  }

  db.gallery = db.gallery.filter((g) => g.id !== id);
  saveDatabase(db);

  return NextResponse.json({
    success: true,
    message: `Karya "${existing.title}" berhasil dihapus dari galeri.`,
  });
}
