import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/server-store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const roomId = searchParams.get('roomId');

    if (!date) {
      return NextResponse.json(
        { success: false, error: 'Parameter tanggal (date) wajib diisi.' },
        { status: 400 }
      );
    }

    const db = getDatabase();

    // Filter active bookings on the specified date (and room if specified)
    const activeBookingsOnDate = db.bookings.filter((b) => {
      const matchDate = b.date === date;
      const matchRoom = roomId ? b.roomId === roomId : true;
      const isActive = b.bookingStatus !== 'cancelled';
      return matchDate && matchRoom && isActive;
    });

    const isFullDayBooked = activeBookingsOnDate.some(
      (b) => b.duration === 'full' || b.timeSlot?.toLowerCase().includes('seharian')
    );

    const isMorningBooked =
      isFullDayBooked ||
      activeBookingsOnDate.some((b) => b.timeSlot?.toLowerCase().includes('pagi'));

    const isAfternoonBooked =
      isFullDayBooked ||
      activeBookingsOnDate.some(
        (b) =>
          b.timeSlot?.toLowerCase().includes('siang') ||
          b.timeSlot?.toLowerCase().includes('sore')
      );

    const slots = [
      {
        id: 'slot-morning',
        name: 'Pagi (09:00 - 13:00 / 17:00)',
        isAvailable: !isMorningBooked,
        bookedDetails: isMorningBooked ? 'Sudah Terisi' : 'Tersedia',
      },
      {
        id: 'slot-afternoon',
        name: 'Siang & Sore (14:00 - 18:00 / 22:00)',
        isAvailable: !isAfternoonBooked,
        bookedDetails: isAfternoonBooked ? 'Sudah Terisi' : 'Tersedia',
      },
      {
        id: 'slot-fullday',
        name: 'Seharian Penuh (09:00 - 17:00)',
        isAvailable: !isFullDayBooked && !isMorningBooked && !isAfternoonBooked,
        bookedDetails:
          isFullDayBooked || isMorningBooked || isAfternoonBooked
            ? 'Tidak Tersedia (Slot Sebagian/Penuh Terisi)'
            : 'Tersedia',
      },
    ];

    return NextResponse.json({
      success: true,
      date,
      roomId: roomId || 'all',
      totalActiveBookings: activeBookingsOnDate.length,
      bookedSlots: activeBookingsOnDate.map((b) => b.timeSlot),
      slots,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memeriksa ketersediaan slot.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
