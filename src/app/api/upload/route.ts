import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { getCurrentSession, canManageGallery } from '@/lib/auth-session';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

// POST: Upload photo to Supabase Storage or fallback to local /public/uploads
export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session || !canManageGallery(session.role)) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak. Hanya staf berwenang yang dapat mengunggah file media.' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'File gambar tidak ditemukan dalam formulir.' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Format file tidak didukung. Harap unggah file gambar (JPG, PNG, WebP).' },
        { status: 400 }
      );
    }

    // Limit size to 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Ukuran file melebihi batas maksimum 10MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || '.jpg';
    const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `origine_${Date.now()}_${cleanBase}${ext}`;

    // 1. Try uploading to Supabase Storage if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createSupabaseClient(supabaseUrl, supabaseKey);
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filename, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (!uploadError) {
          const { data } = supabase.storage.from('gallery').getPublicUrl(filename);
          if (data?.publicUrl) {
            return NextResponse.json({
              success: true,
              message: 'Foto berhasil diunggah ke Supabase Cloud Storage.',
              url: data.publicUrl,
              filename,
              size: file.size,
              storage: 'supabase',
            });
          }
        }
      } catch (sbError) {
        console.warn('Supabase upload attempt failed, falling back to local storage:', sbError);
      }
    }

    // 2. Storage fallback for serverless or local environments
    const isVercel = Boolean(process.env.VERCEL);
    if (isVercel) {
      // In Vercel serverless where local filesystem is read-only and Supabase Storage was not reachable,
      // return a data URI so uploaded artwork immediately displays in admin preview without a 500 error
      const dataUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
      return NextResponse.json({
        success: true,
        message: 'Foto berhasil diproses. Sambungkan bucket "gallery" di Supabase Storage untuk penyimpanan CDN permanen.',
        url: dataUrl,
        filename,
        size: file.size,
        storage: 'buffer',
      });
    }

    try {
      ensureUploadsDir();
      const filePath = path.join(UPLOADS_DIR, filename);
      await fs.promises.writeFile(filePath, buffer);

      const publicUrl = `/uploads/${filename}`;

      return NextResponse.json({
        success: true,
        message: 'Foto berhasil disimpan ke penyimpanan server.',
        url: publicUrl,
        filename,
        size: file.size,
        storage: 'local',
      });
    } catch {
      // Safe fallback if filesystem write is blocked
      const dataUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
      return NextResponse.json({
        success: true,
        message: 'Foto diproses via buffer media.',
        url: dataUrl,
        filename,
        size: file.size,
        storage: 'buffer',
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal mengunggah file gambar.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// GET: List recent uploaded files
export async function GET() {
  try {
    ensureUploadsDir();
    const files = await fs.promises.readdir(UPLOADS_DIR);
    const imageFiles = files
      .filter((f) => /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(f))
      .map((f) => ({
        filename: f,
        url: `/uploads/${f}`,
      }))
      .reverse();

    return NextResponse.json({
      success: true,
      files: imageFiles,
    });
  } catch {
    return NextResponse.json({ success: true, files: [] });
  }
}
