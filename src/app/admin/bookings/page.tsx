"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  Phone,
  MessageSquare,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  FolderDown,
  ExternalLink,
  Share2,
} from "lucide-react";
import { StudioBooking, StudioRoomPricing, StudioAddon, StaffSession } from "@/lib/types";

export default function BookingsManagementPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<StudioBooking[]>([]);
  const [rooms, setRooms] = useState<StudioRoomPricing[]>([]);
  const [addons, setAddons] = useState<StudioAddon[]>([]);
  const [session, setSession] = useState<StaffSession | null>(null);
  const [loading, setLoading] = useState(true);

  // RBAC Guard: Only Owner, Admin, and Kasir can access Bookings & POS
  useEffect(() => {
    if (loading || !session) return;
    if (session.role === "user") {
      router.replace("/admin/my-bookings");
    } else if (session.role === "magang") {
      router.replace("/admin/calendar");
    }
  }, [loading, session, router]);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<StudioBooking | null>(null);

  // New Booking Form
  const [newForm, setNewForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    roomId: "room-01",
    date: new Date().toISOString().split("T")[0],
    timeSlot: "Pagi (09:00 - 13:00)",
    duration: "half" as "half" | "full",
    selectedAddonIds: [] as string[],
    notes: "",
  });

  // Edit / Status Update Form
  const [editStatusForm, setEditStatusForm] = useState({
    bookingStatus: "pending" as StudioBooking["bookingStatus"],
    paymentStatus: "unpaid" as StudioBooking["paymentStatus"],
    depositPaid: 0,
    notes: "",
    googleDriveUrl: "",
  });

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [bookRes, priceRes, meRes] = await Promise.all([
        fetch("/api/bookings").then((r) => r.json()),
        fetch("/api/pricing").then((r) => r.json()),
        fetch("/api/auth/me").then((r) => r.json()),
      ]);

      if (bookRes.success) setBookings(bookRes.bookings || []);
      if (priceRes.success) {
        setRooms(priceRes.rooms || []);
        setAddons(priceRes.addons || []);
      }
      if (meRes.authenticated) setSession(meRes.user);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Open New Booking
  const openNewBooking = () => {
    setNewForm({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      roomId: rooms[0]?.id || "room-01",
      date: new Date().toISOString().split("T")[0],
      timeSlot: "Pagi (09:00 - 13:00)",
      duration: "half",
      selectedAddonIds: [],
      notes: "",
    });
    setFeedback(null);
    setIsNewModalOpen(true);
  };

  // Open Edit Booking
  const openEditBooking = (b: StudioBooking) => {
    setSelectedBooking(b);
    setEditStatusForm({
      bookingStatus: b.bookingStatus,
      paymentStatus: b.paymentStatus,
      depositPaid: b.depositPaid,
      notes: b.notes || "",
      googleDriveUrl: b.googleDriveUrl || "",
    });
    setFeedback(null);
  };

  // Submit New Booking
  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const chosenAddons = addons
      .filter((a) => newForm.selectedAddonIds.includes(a.id))
      .map((a) => ({ id: a.id, name: a.name, price: a.price }));

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newForm,
          selectedAddons: chosenAddons,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.error || "Gagal membuat booking." });
      } else {
        setFeedback({ type: "success", message: data.message });
        setTimeout(() => {
          setIsNewModalOpen(false);
          fetchData();
        }, 1000);
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Terjadi kesalahan." });
    } finally {
      setSubmitting(false);
    }
  };

  // Update Status / Payment
  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedBooking.id,
          ...editStatusForm,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.error || "Gagal memperbarui status." });
      } else {
        setFeedback({ type: "success", message: data.message });
        setTimeout(() => {
          setSelectedBooking(null);
          fetchData();
        }, 1000);
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Terjadi kesalahan." });
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Status Action (POS Kasir: Terima / Tolak)
  const handleQuickStatus = async (b: StudioBooking, newStatus: "confirmed" | "cancelled") => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: b.id,
          bookingStatus: newStatus,
          paymentStatus: b.paymentStatus,
          depositPaid: b.depositPaid,
          notes: b.notes,
          googleDriveUrl: b.googleDriveUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || "Gagal mengubah status sesi.");
      }
    } catch (e) {
      alert("Terjadi kendala saat update status.");
    }
  };

  // Quick Payment Action (POS Kasir: Konfirmasi Lunas Tunai)
  const handleQuickPayment = async (b: StudioBooking) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: b.id,
          bookingStatus: b.bookingStatus === "pending" ? "confirmed" : b.bookingStatus,
          paymentStatus: "paid",
          depositPaid: b.totalPrice,
          notes: `${b.notes ? b.notes + " | " : ""}Pelunasan kasir tunai oleh ${session?.name || "Kasir"}`,
          googleDriveUrl: b.googleDriveUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || "Gagal konfirmasi pembayaran.");
      }
    } catch (e) {
      alert("Terjadi kendala saat konfirmasi pembayaran.");
    }
  };

  // Delete Booking
  const handleDeleteBooking = async (id: string) => {
    if (!confirm(`Hapus data reservasi ${id}?`)) return;
    try {
      const res = await fetch(`/api/bookings?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error);
      }
    } catch (e) {
      alert("Gagal menghapus booking.");
    }
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === "all" || b.bookingStatus === statusFilter;
    const matchesPayment = paymentFilter === "all" || b.paymentStatus === paymentFilter;
    const searchLower = search.toLowerCase();
    const matchesSearch =
      (b.clientName || "").toLowerCase().includes(searchLower) ||
      (b.id || "").toLowerCase().includes(searchLower) ||
      (b.clientPhone || "").includes(search) ||
      (b.roomName || "").toLowerCase().includes(searchLower);
    return matchesStatus && matchesPayment && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {session?.role === "kasir" ? "SISTEM POS KASIR STUDIO" : "MODUL OPERASIONAL & KASIR"}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-[10px] font-mono text-zinc-400">
              {session?.role === "kasir" ? `KASIR: ${session?.name?.toUpperCase()}` : "RESERVASI STUDIO"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-white font-medium">
            {session?.role === "kasir" ? "Sistem POS & Konfirmasi Booking" : "Kelola Booking & Pembayaran"}
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-light max-w-2xl leading-relaxed">
            {session?.role === "kasir"
              ? "Akses Kasir: Terima atau tolak booking sesi klien, validasi pelunasan tunai/DP, input link Google Drive hasil foto, dan chat WhatsApp klien."
              : "Kasir, Admin, dan Owner dapat memvalidasi uang muka (DP), mengubah status pelunasan, jadwal sesi, input link Drive, serta menghubungi klien via WhatsApp."}
          </p>
        </div>

        <button
          type="button"
          onClick={openNewBooking}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-xl shadow-[#720C10]/30 hover:scale-[1.02] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Reservasi Baru</span>
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center p-1 bg-white/[0.03] border border-white/10 rounded-xl">
            {[
              { id: "all", label: "Semua Sesi" },
              { id: "pending", label: "Pending" },
              { id: "confirmed", label: "Terkonfirmasi" },
              { id: "completed", label: "Selesai" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  statusFilter === tab.id
                    ? "bg-[#720C10] text-white font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Payment Status Dropdown */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-zinc-300 focus:outline-none focus:border-[#720C10]"
          >
            <option value="all">Semua Status Bayar</option>
            <option value="paid">Lunas</option>
            <option value="dp_paid">DP Terbayar</option>
            <option value="unpaid">Belum Bayar</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode, klien, telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#720C10] font-mono"
          />
        </div>
      </div>

      {/* BOOKINGS TABLE */}
      <div className="rounded-2xl border border-white/10 bg-[#121212] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Kode Booking</th>
                <th className="py-3.5 px-4 font-semibold">Klien / Pemesan</th>
                <th className="py-3.5 px-4 font-semibold">Ruangan Studio</th>
                <th className="py-3.5 px-4 font-semibold">Jadwal Sesi</th>
                <th className="py-3.5 px-4 font-semibold">Total Biaya & DP</th>
                <th className="py-3.5 px-4 font-semibold">Status Pembayaran</th>
                <th className="py-3.5 px-4 font-semibold">Status Sesi</th>
                <th className="py-3.5 px-4 font-semibold">Google Drive</th>
                <th className="py-3.5 px-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-zinc-500">
                    Memuat data reservasi...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-zinc-500">
                    Tidak ada reservasi yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const cleanPhone = b.clientPhone.replace(/[^0-9]/g, "");
                  const waNumber = cleanPhone.startsWith("0")
                    ? "62" + cleanPhone.slice(1)
                    : cleanPhone;

                  return (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* ID */}
                      <td className="py-4 px-4 font-bold text-white">
                        <span className="px-2 py-1 rounded bg-black/40 border border-white/10">
                          {b.id}
                        </span>
                      </td>

                      {/* Client */}
                      <td className="py-4 px-4">
                        <p className="font-semibold text-white">{b.clientName}</p>
                        <p className="text-[10px] text-zinc-500">{b.clientPhone}</p>
                        {b.clientEmail && (
                          <p className="text-[10px] text-zinc-600 truncate max-w-[140px]">
                            {b.clientEmail}
                          </p>
                        )}
                      </td>

                      {/* Room & Addons */}
                      <td className="py-4 px-4">
                        <p className="font-medium text-zinc-200">{b.roomName.split(":")[0]}</p>
                        {b.selectedAddons && b.selectedAddons.length > 0 && (
                          <p className="text-[10px] text-[#ff6169] mt-0.5">
                            +{b.selectedAddons.length} Add-on disewa
                          </p>
                        )}
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-4 text-zinc-300">
                        <p className="font-medium text-white">{b.date}</p>
                        <p className="text-[10px] text-zinc-500">{b.timeSlot}</p>
                      </td>

                      {/* Total Price & Deposit */}
                      <td className="py-4 px-4">
                        <p className="font-bold text-white">{formatRupiah(b.totalPrice)}</p>
                        {b.depositPaid > 0 && (
                          <p className="text-[10px] text-emerald-400">
                            Masuk: {formatRupiah(b.depositPaid)}
                          </p>
                        )}
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            b.paymentStatus === "paid"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : b.paymentStatus === "dp_paid"
                              ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {b.paymentStatus === "paid"
                            ? "Lunas"
                            : b.paymentStatus === "dp_paid"
                            ? "DP Terbayar"
                            : "Belum Bayar"}
                        </span>
                      </td>

                      {/* Booking Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            b.bookingStatus === "confirmed"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : b.bookingStatus === "completed"
                              ? "bg-purple-500/20 text-purple-300"
                              : b.bookingStatus === "cancelled"
                              ? "bg-red-500/20 text-red-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                      </td>

                      {/* Google Drive Link */}
                      <td className="py-4 px-4">
                        {b.googleDriveUrl ? (
                          <div className="flex items-center gap-1.5">
                            <a
                              href={b.googleDriveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 hover:text-white transition-all text-[10px] font-semibold"
                              title="Buka folder Google Drive foto klien"
                            >
                              <FolderDown className="w-3 h-3 text-emerald-400" />
                              <span>Drive ↗</span>
                            </a>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openEditBooking(b)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-dashed border-white/20 text-zinc-500 hover:text-emerald-300 hover:border-emerald-500/40 text-[10px] transition-colors cursor-pointer"
                            title="Input link Google Drive foto untuk sesi ini"
                          >
                            <span>+ Input Drive</span>
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* POS Kasir: Quick Accept/Reject for Pending Bookings */}
                          {b.bookingStatus === "pending" && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleQuickStatus(b, "confirmed")}
                                className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] font-bold flex items-center gap-1 shadow transition-all cursor-pointer"
                                title="Terima Sesi & Konfirmasi Booking"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Terima</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickStatus(b, "cancelled")}
                                className="px-2 py-1 rounded-md bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 font-mono text-[10px] flex items-center gap-1 transition-all cursor-pointer"
                                title="Tolak Sesi & Batalkan"
                              >
                                <X className="w-3 h-3" />
                                <span>Tolak</span>
                              </button>
                            </>
                          )}

                          {/* POS Kasir: Quick Cash Payment Button */}
                          {b.paymentStatus === "unpaid" && (
                            <button
                              type="button"
                              onClick={() => handleQuickPayment(b)}
                              className="px-2 py-1 rounded-md bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-mono text-[10px] flex items-center gap-1 transition-all cursor-pointer"
                              title="Konfirmasi Pembayaran Kasir Lunas"
                            >
                              <CreditCard className="w-3 h-3 text-amber-400" />
                              <span>Lunas Tunai</span>
                            </button>
                          )}

                          {/* WhatsApp Client button */}
                          <a
                            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                              `Halo Kak ${b.clientName}, kami dari Origine Studio Malang mengonfirmasi reservasi ${b.id} untuk ${b.roomName} pada tanggal ${b.date} (${b.timeSlot}). Total: ${formatRupiah(b.totalPrice)}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:text-white hover:bg-emerald-900/40 transition-colors"
                            title="Chat WhatsApp Klien"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          {/* Edit / Kasir Update */}
                          <button
                            type="button"
                            onClick={() => openEditBooking(b)}
                            className="p-1.5 rounded-lg border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white"
                            title="Update Status / Detail Lengkap"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete (Owner / Admin Only) */}
                          {(session?.role === "owner" || session?.role === "admin") && (
                            <button
                              type="button"
                              onClick={() => handleDeleteBooking(b.id)}
                              className="p-1.5 rounded-lg border border-red-500/20 hover:border-red-500/50 text-red-400 hover:text-red-200"
                              title="Hapus Booking"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: TAMBAH RESERVASI BARU */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className="max-w-lg w-full bg-[#141414] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div>
                <h3 className="text-lg font-serif text-white font-medium">Buat Reservasi Baru</h3>
                <p className="text-xs text-zinc-400 font-light mt-0.5">
                  Input reservasi walk-in atau manual dari studio.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div
                className={`mb-5 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  feedback.type === "success"
                    ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-200"
                    : "bg-red-950/60 border border-red-500/40 text-red-200"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Nama Klien *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Dian Sastrowardoyo"
                  value={newForm.clientName}
                  onChange={(e) => setNewForm({ ...newForm, clientName: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                    Nomor WhatsApp / HP *
                  </label>
                  <input
                    type="tel"
                    placeholder="+62812345678"
                    value={newForm.clientPhone}
                    onChange={(e) => setNewForm({ ...newForm, clientPhone: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                    Email Klien
                  </label>
                  <input
                    type="email"
                    placeholder="klien@agensi.com"
                    value={newForm.clientEmail}
                    onChange={(e) => setNewForm({ ...newForm, clientEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Pilih Ruang Studio *
                </label>
                <select
                  value={newForm.roomId}
                  onChange={(e) => setNewForm({ ...newForm, roomId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({formatRupiah(newForm.duration === "full" ? r.fullDayPrice : r.halfDayPrice)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                    Durasi
                  </label>
                  <select
                    value={newForm.duration}
                    onChange={(e) => setNewForm({ ...newForm, duration: e.target.value as "half" | "full" })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                  >
                    <option value="half">Half Day (4 Jam)</option>
                    <option value="full">Full Day (8 Jam)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={newForm.date}
                    onChange={(e) => setNewForm({ ...newForm, date: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                    Slot Waktu
                  </label>
                  <select
                    value={newForm.timeSlot}
                    onChange={(e) => setNewForm({ ...newForm, timeSlot: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                  >
                    <option>Pagi (09:00 - 13:00)</option>
                    <option>Sore (14:00 - 18:00)</option>
                    <option>Seharian (09:00 - 17:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Catatan Sesi
                </label>
                <input
                  type="text"
                  placeholder="Kebutuhan khusus atau tema pemotretan"
                  value={newForm.notes}
                  onChange={(e) => setNewForm({ ...newForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2.5 rounded-full border border-white/10 text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider"
                >
                  {submitting ? "Membuat..." : "Simpan Reservasi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPDATE STATUS & PEMBAYARAN */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className="max-w-md w-full bg-[#141414] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div>
                <h3 className="text-lg font-serif text-white font-medium">
                  Update Transaksi: {selectedBooking.id}
                </h3>
                <p className="text-xs text-zinc-400 font-light mt-0.5">
                  Klien: {selectedBooking.clientName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div
                className={`mb-5 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  feedback.type === "success"
                    ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-200"
                    : "bg-red-950/60 border border-red-500/40 text-red-200"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono space-y-1.5">
                <div className="flex justify-between text-zinc-400">
                  <span>Ruang:</span>
                  <span className="text-white font-bold">{selectedBooking.roomName}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Total Tagihan:</span>
                  <span className="text-emerald-400 font-bold">{formatRupiah(selectedBooking.totalPrice)}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Status Pembayaran (Kasir / Admin) *
                </label>
                <select
                  value={editStatusForm.paymentStatus}
                  onChange={(e) =>
                    setEditStatusForm({
                      ...editStatusForm,
                      paymentStatus: e.target.value as StudioBooking["paymentStatus"],
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                >
                  <option value="unpaid">Belum Bayar (Menunggu)</option>
                  <option value="dp_paid">DP Terbayar (Uang Muka Diterima)</option>
                  <option value="paid">Lunas (Pelunasan Lengkap)</option>
                  <option value="refunded">Refund / Dikembalikan</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Nominal DP / Masuk (Rupiah IDR)
                </label>
                <input
                  type="number"
                  value={editStatusForm.depositPaid}
                  onChange={(e) =>
                    setEditStatusForm({ ...editStatusForm, depositPaid: Number(e.target.value) })
                  }
                  step="50000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Status Reservasi Studio *
                </label>
                <select
                  value={editStatusForm.bookingStatus}
                  onChange={(e) =>
                    setEditStatusForm({
                      ...editStatusForm,
                      bookingStatus: e.target.value as StudioBooking["bookingStatus"],
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                >
                  <option value="pending">Pending (Menunggu Konfirmasi)</option>
                  <option value="confirmed">Confirmed (Sesi Dijadwalkan)</option>
                  <option value="in_progress">In Progress (Sesi Berlangsung)</option>
                  <option value="completed">Completed (Selesai & Arsip)</option>
                  <option value="cancelled">Cancelled (Dibatalkan)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Catatan Staf / Kasir
                </label>
                <input
                  type="text"
                  placeholder="Catatan kwitansi atau instruksi kasir"
                  value={editStatusForm.notes}
                  onChange={(e) => setEditStatusForm({ ...editStatusForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                />
              </div>

              {/* Input Link Google Drive */}
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <label className="text-[10px] font-mono uppercase text-emerald-400 font-bold block flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FolderDown className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Link Folder Google Drive (Hasil Foto)</span>
                  </span>
                  <span className="text-[9px] text-zinc-500 font-normal">All File Share G-Drive</span>
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={editStatusForm.googleDriveUrl}
                  onChange={(e) => setEditStatusForm({ ...editStatusForm, googleDriveUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-emerald-500/30 text-white text-xs font-mono focus:border-emerald-400 outline-none placeholder:text-zinc-600"
                />
                <p className="text-[10px] font-mono text-zinc-400 leading-relaxed">
                  Masukkan link share folder Google Drive. Klien dapat langsung mengunduh hasil foto dari portal klien mereka.
                </p>

                {editStatusForm.googleDriveUrl && (
                  <div className="pt-1 flex items-center gap-2 flex-wrap">
                    <a
                      href={`https://wa.me/${selectedBooking.clientPhone.replace(/[^0-9]/g, "").startsWith("0") ? "62" + selectedBooking.clientPhone.replace(/[^0-9]/g, "").slice(1) : selectedBooking.clientPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Halo Kak ${selectedBooking.clientName}, kami dari Origine Studio Malang mengabarkan bahwa seluruh file foto hasil sesi pemotretan Anda (${selectedBooking.roomName}) sudah selesai dan siap diunduh!\n\n` +
                        `📁 Link Google Drive:\n${editStatusForm.googleDriveUrl}\n\n` +
                        `Terima kasih telah mempercayakan momen berharga Anda kepada Origine Studio Malang. Semoga berkenan dan sampai jumpa di sesi berikutnya!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-mono font-semibold transition-all shadow-md shadow-emerald-950/40"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Kirim Link via WhatsApp</span>
                    </a>

                    <a
                      href={editStatusForm.googleDriveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-[11px] font-mono border border-white/10"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Tes Buka Folder</span>
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2.5 rounded-full border border-white/10 text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider"
                >
                  {submitting ? "Menyimpan..." : "Simpan Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
