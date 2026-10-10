import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/server-store';
import { getCurrentSession, canManageBookings } from '@/lib/auth-session';
import { StudioBooking } from '@/lib/types';

// GET: List all bookings
export async function GET(request: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Akses ditolak. Sesi login diperlukan untuk mengakses data booking.' },
      { status: 401 }
    );
  }

  const db = getDatabase();

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status');
  const search = searchParams.get('search')?.toLowerCase();

  let bookings = db.bookings;

  // If regular client, only show their own bookings
  if (session.role === 'user') {
    bookings = bookings.filter(
      (b) =>
        (session.email && b.clientEmail.toLowerCase() === session.email.toLowerCase()) ||
        b.clientName.toLowerCase() === session.name.toLowerCase()
    );
  }

  if (statusFilter && statusFilter !== 'all') {
    bookings = bookings.filter((b) => b.bookingStatus === statusFilter);
  }

  if (search) {
    bookings = bookings.filter(
      (b) =>
        b.clientName.toLowerCase().includes(search) ||
        b.id.toLowerCase().includes(search) ||
        b.clientPhone.includes(search) ||
        b.roomName.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({
    success: true,
    bookings,
    total: bookings.length,
  });
}

// POST: Create a new booking
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clientName,
      clientEmail,
      clientPhone,
      roomId,
      date,
      timeSlot,
      duration,
      selectedAddons,
      notes,
    } = body;

    if (!clientName || !clientPhone || !roomId || !date) {
      return NextResponse.json(
        { success: false, error: 'Nama klien, nomor telepon, ruangan studio, dan tanggal wajib diisi.' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    let room = db.rooms.find((r) => r.id === roomId);
    if (!room) {
      const space = db.spaces?.find((s) => s.id === roomId);
      if (space) {
        room = {
          id: space.id,
          name: space.name,
          code: space.number || "SPACE",
          dimensions: `${space.area} • ${space.ceiling}`,
          halfDayPrice: 1500000,
          fullDayPrice: 2800000,
          hourlyRate: 250000,
          description: space.tagline,
          features: space.features,
          isActive: space.isActive,
        };
      }
    }

    if (!room) {
      // Fallback room creation for custom room name
      room = {
        id: roomId || "room-custom",
        name: body.roomName || "Sesi Foto Studio",
        code: "CUST-01",
        dimensions: "Studio Area",
        halfDayPrice: 50000,
        fullDayPrice: 100000,
        hourlyRate: 50000,
        description: "Reservasi sesi foto resmi",
        features: ["Standard Studio"],
        isActive: true,
      };
    }

    // Calculate total price: prefer explicit client calculation if valid, else standard formula
    let calculatedTotal = Number(body.totalPrice) || 0;
    if (calculatedTotal <= 0) {
      const basePrice = duration === "full" ? room.fullDayPrice : room.halfDayPrice;
      const addonsTotal = (selectedAddons || []).reduce(
        (acc: number, item: { price?: number }) => acc + (Number(item.price) || 0),
        0
      );
      calculatedTotal = basePrice + addonsTotal;
    }

    const session = await getCurrentSession();

    const newBooking: StudioBooking = {
      id: `ORG-${new Date().getFullYear()}-${String(db.bookings.length + 1).padStart(3, "0")}`,
      clientName: clientName.trim(),
      clientEmail: clientEmail?.trim() || "",
      clientPhone: clientPhone.trim(),
      roomId: room.id,
      roomName: body.roomName || room.name,
      date,
      timeSlot: timeSlot || "Pagi (09:00 - 13:00)",
      duration: duration || "half",
      selectedAddons: selectedAddons || [],
      totalPrice: calculatedTotal,
      depositPaid: Number(body.depositPaid) || 0,
      paymentStatus: body.paymentStatus || "unpaid",
      bookingStatus: "pending",
      notes: notes?.trim() || "",
      createdAt: new Date().toISOString(),
      handledBy: session ? `${session.name} (${session.role})` : "Online Booking Form",
    };

    db.bookings.unshift(newBooking);
    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: `Reservasi berhasil dibuat dengan kode ${newBooking.id}.`,
      booking: newBooking,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal membuat reservasi.';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// PUT: Update booking status & payment (Owner, Admin, Kasir)
export async function PUT(request: Request) {
  const session = await getCurrentSession();
  if (!session || !canManageBookings(session.role)) {
    return NextResponse.json(
      { success: false, error: 'Akses ditolak. Anda tidak memiliki izin untuk mengelola transaksi booking.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { id, bookingStatus, paymentStatus, depositPaid, notes } = body;

    const db = getDatabase();
    const idx = db.bookings.findIndex((b) => b.id === id);

    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Booking tidak ditemukan.' }, { status: 404 });
    }

    if (bookingStatus) db.bookings[idx].bookingStatus = bookingStatus;
    if (paymentStatus) db.bookings[idx].paymentStatus = paymentStatus;
    if (depositPaid !== undefined) db.bookings[idx].depositPaid = Number(depositPaid);
    if (notes !== undefined) db.bookings[idx].notes = notes;

    db.bookings[idx].handledBy = `${session.name} (${session.role})`;

    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: `Status booking ${db.bookings[idx].id} berhasil diperbarui.`,
      booking: db.bookings[idx],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memperbarui booking.';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// DELETE: Cancel / remove a booking (Owner, Admin)
export async function DELETE(request: Request) {
  const session = await getCurrentSession();
  if (!session || (session.role !== 'owner' && session.role !== 'admin')) {
    return NextResponse.json(
      { success: false, error: 'Hanya Owner dan Admin yang dapat menghapus data booking.' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'ID booking diperlukan.' }, { status: 400 });
  }

  const db = getDatabase();
  const existing = db.bookings.find((b) => b.id === id);
  if (!existing) {
    return NextResponse.json({ success: false, error: 'Booking tidak ditemukan.' }, { status: 404 });
  }

  db.bookings = db.bookings.filter((b) => b.id !== id);
  saveDatabase(db);

  return NextResponse.json({
    success: true,
    message: `Data booking ${id} berhasil dihapus.`,
  });
}
