"use client";

import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Crown,
  Shield,
  CreditCard,
  GraduationCap,
  User as UserIcon,
  AlertCircle,
  CheckCircle2,
  X,
  Sparkles,
} from "lucide-react";
import { StudioUser, StudioRole, StaffSession } from "@/lib/types";

export default function UserManagementPage() {
  const [users, setUsers] = useState<StudioUser[]>([]);
  const [session, setSession] = useState<StaffSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visiblePasscodes, setVisiblePasscodes] = useState<Record<string, boolean>>({});

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<StudioUser | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    passcode: "",
    role: "kasir" as StudioRole,
    email: "",
    phone: "",
    notes: "",
    status: "active" as "active" | "inactive",
  });

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchSession();
  }, []);

  async function fetchSession() {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.authenticated) setSession(data.user);
    } catch {}
  }

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const togglePasscode = (id: string) => {
    setVisiblePasscodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateRandomPasscode = () => {
    const chars = "abcdefghjkmnpqrstuvwxyz23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, passcode: code }));
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormData({
      name: "",
      username: "",
      passcode: "staf" + Math.floor(1000 + Math.random() * 9000),
      role: "kasir",
      email: "",
      phone: "",
      notes: "",
      status: "active",
    });
    setFeedback(null);
    setIsAddOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (user: StudioUser) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      passcode: user.passcode || "",
      role: user.role,
      email: user.email || "",
      phone: user.phone || "",
      notes: user.notes || "",
      status: user.status,
    });
    setFeedback(null);
    setIsEditOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (user: StudioUser) => {
    setSelectedUser(user);
    setFeedback(null);
    setIsDeleteOpen(true);
  };

  // Handle Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.error || "Gagal membuat user." });
      } else {
        setFeedback({ type: "success", message: data.message });
        setTimeout(() => {
          setIsAddOpen(false);
          fetchUsers();
        }, 1000);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setFeedback({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Edit User
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.error || "Gagal memperbarui user." });
      } else {
        setFeedback({ type: "success", message: data.message });
        setTimeout(() => {
          setIsEditOpen(false);
          fetchUsers();
        }, 1000);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setFeedback({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.error || "Gagal menghapus user." });
      } else {
        setFeedback({ type: "success", message: data.message });
        setTimeout(() => {
          setIsDeleteOpen(false);
          fetchUsers();
        }, 1000);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setFeedback({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleBadge = (r: StudioRole) => {
    switch (r) {
      case "owner":
        return {
          label: "OWNER",
          badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          icon: Crown,
        };
      case "admin":
        return {
          label: "ADMIN",
          badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/40",
          icon: Shield,
        };
      case "kasir":
        return {
          label: "KASIR",
          badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          icon: CreditCard,
        };
      case "magang":
        return {
          label: "MAGANG",
          badgeClass: "bg-sky-500/20 text-sky-300 border-sky-500/40",
          icon: GraduationCap,
        };
      case "user":
      default:
        return {
          label: "USER / KLIEN",
          badgeClass: "bg-zinc-800 text-zinc-300 border-zinc-700",
          icon: UserIcon,
        };
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
      (u.phone && u.phone.includes(search));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* 1. HEADER & CTA BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#ff6169] font-bold">
              MODUL PENGGUNA & STAF
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-[10px] font-mono text-zinc-400">CRUD MULTI-ROLE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-white font-medium">
            Kelola User & Akses Staf
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-light max-w-2xl leading-relaxed">
            Owner & Admin dapat mengelola 5 role (Owner, Admin, Kasir, Magang, User) serta membuatkan akun akses masuk untuk Kasir & Magang menggunakan Username dan Kode Akses unik.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold tracking-wider uppercase transition-all duration-200 shadow-xl shadow-[#720C10]/30 hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Staf / User</span>
        </button>
      </div>

      {/* 2. FILTER TABS & SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Role Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-white/[0.03] border border-white/10 rounded-xl max-w-full">
          {[
            { id: "all", label: "Semua", count: users.length },
            { id: "owner", label: "Owner", count: users.filter((u) => u.role === "owner").length },
            { id: "admin", label: "Admin", count: users.filter((u) => u.role === "admin").length },
            { id: "kasir", label: "Kasir", count: users.filter((u) => u.role === "kasir").length },
            { id: "magang", label: "Magang", count: users.filter((u) => u.role === "magang").length },
            { id: "user", label: "User / Klien", count: users.filter((u) => u.role === "user").length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 shrink-0 ${
                roleFilter === tab.id
                  ? "bg-[#720C10] text-white font-semibold shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  roleFilter === tab.id ? "bg-black/30 text-white" : "bg-white/10 text-zinc-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, username, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#720C10] font-mono transition-colors"
          />
        </div>
      </div>

      {/* 3. USERS DATA TABLE */}
      <div className="rounded-2xl border border-white/10 bg-[#121212] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Pengguna / Nama</th>
                <th className="py-3.5 px-4 font-semibold">Role</th>
                <th className="py-3.5 px-4 font-semibold">Username Akses</th>
                <th className="py-3.5 px-4 font-semibold">Kode Akses (Passcode)</th>
                <th className="py-3.5 px-4 font-semibold">Kontak</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    Memuat daftar pengguna...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    Tidak ada pengguna yang cocok dengan filter atau pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const badge = getRoleBadge(u.role);
                  const Icon = badge.icon;
                  const isPasscodeShown = Boolean(visiblePasscodes[u.id]);

                  return (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-xs shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-white text-xs">{u.name}</p>
                            {u.notes && (
                              <p className="text-[10px] text-zinc-500 truncate max-w-[200px]">
                                {u.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${badge.badgeClass}`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>
                      </td>

                      {/* Username */}
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 rounded bg-black/40 border border-white/10 text-white font-mono text-[11px]">
                          @{u.username}
                        </span>
                      </td>

                      {/* Passcode with Show/Hide and Copy */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-zinc-200 bg-white/5 px-2 py-0.5 rounded border border-white/5 text-[11px]">
                            {isPasscodeShown ? u.passcode || "—" : "••••••"}
                          </span>

                          <button
                            type="button"
                            onClick={() => togglePasscode(u.id)}
                            className="p-1 text-zinc-400 hover:text-white transition-colors"
                            title={isPasscodeShown ? "Sembunyikan" : "Tampilkan"}
                          >
                            {isPasscodeShown ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {u.passcode && (
                            <button
                              type="button"
                              onClick={() => copyToClipboard(u.passcode!, u.id)}
                              className="p-1 text-zinc-400 hover:text-white transition-colors"
                              title="Salin kode akses"
                            >
                              {copiedId === u.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-4 px-4 text-zinc-400">
                        <p className="text-zinc-300">{u.email || "—"}</p>
                        <p className="text-[10px] text-zinc-500">{u.phone || ""}</p>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                            u.status === "active"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-red-500/20 text-red-300 border border-red-500/30"
                          }`}
                        >
                          {u.status === "active" ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(u)}
                            className="p-1.5 rounded-lg border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                            title="Edit User"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Protect self deletion & non-owner from deleting owner */}
                          {session?.userId !== u.id && (
                            <button
                              type="button"
                              onClick={() => openDeleteModal(u)}
                              className="p-1.5 rounded-lg border border-red-500/20 hover:border-red-500/50 text-red-400 hover:text-red-200 hover:bg-red-950/30 transition-colors"
                              title="Hapus User"
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

      {/* 4. MODAL: TAMBAH USER / STAF BARU */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className="max-w-lg w-full bg-[#141414] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div>
                <h3 className="text-lg font-serif text-white font-medium">
                  Buat Akun Staf / Pengguna Baru
                </h3>
                <p className="text-xs text-zinc-400 font-light mt-0.5">
                  Atur username & kode akses khusus untuk Kasir atau Magang.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg"
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
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Pilih Role Hak Akses *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as StudioRole })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                >
                  <option value="kasir">💳 Kasir (Kelola Booking, Transaksi, Kwitansi)</option>
                  <option value="magang">🎒 Magang (Jadwal Sesi Studio, Kalender, Checklist)</option>
                  <option value="admin">🛡️ Admin (Hak Kelola User, Harga, Booking, Galeri)</option>
                  {session?.role === "owner" && (
                    <option value="owner">👑 Owner (Hak Akses Penuh Studio)</option>
                  )}
                  <option value="user">👤 User / Klien (Portal Pribadi Klien)</option>
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Riko Permana"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                />
              </div>

              {/* Username */}
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Username Masuk * (tanpa spasi)
                </label>
                <div className="relative">
                  <span className="text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 text-xs">@</span>
                  <input
                    type="text"
                    placeholder="kasir_riko"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, "_") })}
                    required
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                  />
                </div>
              </div>

              {/* Passcode / PIN with Generator */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-400">
                    Kode Akses / PIN Masuk *
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomPasscode}
                    className="text-[10px] font-mono text-[#ff6169] hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Buat Otomatis</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Kode Akses Staf (Contoh: kasir77 atau pin)"
                  value={formData.passcode}
                  onChange={(e) => setFormData({ ...formData, passcode: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                />
              </div>

              {/* Optional Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                    Email (Opsional untuk Staf)
                  </label>
                  <input
                    type="email"
                    placeholder="riko@originestudio.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                    Nomor WhatsApp (Opsional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+62812345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Catatan Posisi / Penugasan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kasir shift pagi studio Belung"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 rounded-full border border-white/10 text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan & Buat Akun"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: EDIT USER */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className="max-w-lg w-full bg-[#141414] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div>
                <h3 className="text-lg font-serif text-white font-medium">
                  Edit Data Pengguna: {selectedUser.name}
                </h3>
                <p className="text-xs text-zinc-400 font-light mt-0.5">
                  ID: {selectedUser.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg"
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
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Role Akses
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as StudioRole })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                >
                  <option value="kasir">💳 Kasir</option>
                  <option value="magang">🎒 Magang</option>
                  <option value="admin">🛡️ Admin</option>
                  {session?.role === "owner" && <option value="owner">👑 Owner</option>}
                  <option value="user">👤 User / Klien</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, "_") })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Kode Akses / PIN Baru
                </label>
                <input
                  type="text"
                  value={formData.passcode}
                  onChange={(e) => setFormData({ ...formData, passcode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Status Akun
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif (Blokir Masuk)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2.5 rounded-full border border-white/10 text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
                >
                  {submitting ? "Memperbarui..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: DELETE CONFIRMATION */}
      {isDeleteOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className="max-w-md w-full bg-[#141414] border border-red-500/30 rounded-2xl p-6 shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-serif text-white font-medium">Hapus Akun Pengguna?</h3>
            <p className="text-xs text-zinc-400 font-light mt-2 leading-relaxed">
              Anda yakin ingin menghapus akun <span className="text-white font-medium">{selectedUser.name}</span> (@{selectedUser.username}) dengan role <span className="text-amber-400 uppercase font-mono font-semibold">{selectedUser.role}</span>? Tindakan ini tidak dapat dibatalkan.
            </p>

            {feedback && (
              <div className="mt-4 p-2.5 rounded-lg bg-red-950/70 border border-red-500/40 text-red-200 text-xs">
                {feedback.message}
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="px-5 py-2.5 rounded-full border border-white/10 text-xs font-mono text-zinc-300 hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={submitting}
                className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider"
              >
                {submitting ? "Menghapus..." : "Ya, Hapus Pengguna"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
