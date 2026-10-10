"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Users,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Layers,
  ArrowUpRight,
  Eye,
  Check,
  RotateCcw,
} from "lucide-react";
import { BookingExperiencePackage, DurationOption, PersonOption } from "@/lib/types";

export default function BookingPackagesManagementPage() {
  const [packages, setPackages] = useState<BookingExperiencePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<BookingExperiencePackage | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [badge, setBadge] = useState("");
  const [badgeColor, setBadgeColor] = useState("bg-[#720C10] text-white border-[#720C10]/40");
  const [image, setImage] = useState("");
  const [basePriceTag, setBasePriceTag] = useState("");
  const [description, setDescription] = useState("");
  const [featuresText, setFeaturesText] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Duration & Person Dynamic Sub-Lists
  const [durationOptions, setDurationOptions] = useState<DurationOption[]>([]);
  const [personOptions, setPersonOptions] = useState<PersonOption[]>([]);

  // Fetch Packages on Mount
  useEffect(() => {
    fetchPackages();
  }, []);

  async function fetchPackages() {
    setLoading(true);
    try {
      const res = await fetch("/api/booking-packages");
      const data = await res.json();
      if (data.success && Array.isArray(data.packages)) {
        setPackages(data.packages);
      }
    } catch (err) {
      console.error("Gagal memuat paket booking:", err);
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

  // Open Modal for New Package
  const handleOpenNew = () => {
    setEditingPkg(null);
    setName("");
    setBadge("Sesi Baru");
    setBadgeColor("bg-[#720C10] text-white border-[#720C10]/40");
    setImage("https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&w=1200&auto=format&fit=crop");
    setBasePriceTag("Mulai Rp 10.000 / 15 menit");
    setDescription("Sesi foto eksklusif dengan pencahayaan profesional dan properti studio terkurasi.");
    setFeaturesText(
      "Kamera Full-Frame & Studio Lighting Otomatis\nWireless Remote Shutter Clicker\nLive Preview Monitor\nUnlimited Shots"
    );
    setIsActive(true);
    setDurationOptions([
      { id: `dur-${Date.now()}-1`, label: "15 Menit", minutes: 15, price: 10000 },
      { id: `dur-${Date.now()}-2`, label: "30 Menit", minutes: 30, price: 20000, isPopular: true },
    ]);
    setPersonOptions([
      { count: 1, label: "1 Orang (Termasuk)", extraPrice: 0 },
      { count: 2, label: "2 Orang (+Rp 5.000)", extraPrice: 5000 },
    ]);
    setIsModalOpen(true);
  };

  // Open Modal for Editing Existing Package
  const handleOpenEdit = (pkg: BookingExperiencePackage) => {
    setEditingPkg(pkg);
    setName(pkg.name);
    setBadge(pkg.badge);
    setBadgeColor(pkg.badgeColor || "bg-[#720C10] text-white border-[#720C10]/40");
    setImage(pkg.image);
    setBasePriceTag(pkg.basePriceTag);
    setDescription(pkg.description);
    setFeaturesText(pkg.features?.join("\n") || "");
    setIsActive(pkg.isActive !== false);
    setDurationOptions([...pkg.durationOptions]);
    setPersonOptions([...pkg.personOptions]);
    setIsModalOpen(true);
  };

  // Duration Sub-List Helpers
  const addDurationRow = () => {
    setDurationOptions((prev) => [
      ...prev,
      {
        id: `dur-${Date.now()}`,
        label: "45 Menit",
        minutes: 45,
        price: 30000,
        isPopular: false,
      },
    ]);
  };

  const updateDurationRow = <K extends keyof DurationOption>(idx: number, field: K, val: DurationOption[K]) => {
    setDurationOptions((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const removeDurationRow = (idx: number) => {
    if (durationOptions.length <= 1) {
      alert("Minimal harus ada 1 opsi durasi pemotretan.");
      return;
    }
    setDurationOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  // Person Sub-List Helpers
  const addPersonRow = () => {
    const nextCount = (personOptions[personOptions.length - 1]?.count || 1) + 1;
    setPersonOptions((prev) => [
      ...prev,
      {
        count: nextCount,
        label: `${nextCount} Orang (+Rp 10.000)`,
        extraPrice: 10000,
      },
    ]);
  };

  const updatePersonRow = <K extends keyof PersonOption>(idx: number, field: K, val: PersonOption[K]) => {
    setPersonOptions((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const removePersonRow = (idx: number) => {
    if (personOptions.length <= 1) {
      alert("Minimal harus ada 1 opsi kapasitas orang.");
      return;
    }
    setPersonOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  // Save Package (POST or PUT)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !image.trim()) {
      setFeedback({ type: "error", message: "Nama paket dan link foto wajib diisi." });
      return;
    }

    setSaving(true);
    setFeedback(null);

    const features = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const payload: Partial<BookingExperiencePackage> = {
      ...(editingPkg ? { id: editingPkg.id } : {}),
      name: name.trim(),
      badge: badge.trim(),
      badgeColor,
      image: image.trim(),
      basePriceTag: basePriceTag.trim(),
      description: description.trim(),
      durationOptions,
      personOptions,
      features,
      isActive,
    };

    try {
      const method = editingPkg ? "PUT" : "POST";
      const res = await fetch("/api/booking-packages", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan paket booking.");
      }

      setFeedback({ type: "success", message: data.message });
      setIsModalOpen(false);
      fetchPackages();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  // Delete Package
  const handleDelete = async (pkg: BookingExperiencePackage) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus paket "${pkg.name}" dari halaman booking?`)) {
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/booking-packages?id=${pkg.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menghapus paket.");
      }
      setFeedback({ type: "success", message: data.message });
      fetchPackages();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus paket.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  // Toggle Active/Inactive
  const handleToggleActive = async (pkg: BookingExperiencePackage) => {
    try {
      const updated = { ...pkg, isActive: !pkg.isActive };
      const res = await fetch("/api/booking-packages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        fetchPackages();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. HEADER & ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#ff6169] font-bold">
              CMS MENU BOOKING DINAMIS
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-[10px] font-mono tracking-wider text-zinc-400">
              ORIGINE STUDIO MALANG
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-white font-medium">
            Kelola Paket & Menu Booking Online
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-light max-w-2xl">
            Seluruh kartu paket, tarif durasi per 15/30 menit atau per jam, biaya penambahan orang, serta foto pada halaman booking dapat Anda ubah bebas di sini.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/booking"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-[#ff6169]" />
            <span>Lihat Halaman Publik</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
          </Link>

          <button
            type="button"
            onClick={handleOpenNew}
            className="px-4 py-2.5 rounded-xl bg-[#720C10] hover:bg-[#8e0e14] text-white text-xs font-mono font-semibold transition-all flex items-center gap-2 shadow-lg shadow-[#720C10]/30 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Paket Baru</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK TOAST BANNER */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs font-mono ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. PACKAGES GRID */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-zinc-500">
          Memuat data paket booking studio...
        </div>
      ) : packages.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#141414] border border-white/10 p-8 space-y-4">
          <Layers className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-serif text-white">Belum Ada Paket Booking</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Klik tombol Tambah Paket Baru untuk mulai mendaftarkan pilihan studio atau self-service photo.
          </p>
          <button
            type="button"
            onClick={handleOpenNew}
            className="px-4 py-2 rounded-xl bg-[#720C10] text-white text-xs font-mono"
          >
            Tambah Paket Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-2xl bg-[#141414] border overflow-hidden shadow-xl flex flex-col justify-between transition-all ${
                pkg.isActive !== false ? "border-white/10" : "border-white/5 opacity-60"
              }`}
            >
              {/* Image Preview & Badge */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950">
                <Image
                  src={pkg.image}
                  alt={pkg.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/30 to-black/50 pointer-events-none" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase border backdrop-blur-md ${
                      pkg.badgeColor || "bg-[#720C10] text-white border-[#720C10]/40"
                    }`}
                  >
                    {pkg.badge}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(pkg)}
                    className={`px-3 py-1 rounded-full text-[10px] font-mono border backdrop-blur-md cursor-pointer transition-colors ${
                      pkg.isActive !== false
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700"
                    }`}
                  >
                    {pkg.isActive !== false ? "● Publik Aktif" : "○ Disembunyikan"}
                  </button>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-serif text-white font-medium drop-shadow-md">
                    {pkg.name}
                  </h3>
                  <p className="text-xs font-mono text-[#ff6169] mt-0.5">
                    {pkg.basePriceTag}
                  </p>
                </div>
              </div>

              {/* Card Body & Details */}
              <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed line-clamp-2">
                    {pkg.description}
                  </p>

                  {/* Duration Options Pill Matrix */}
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                    <p className="text-[10px] font-mono uppercase text-zinc-500 font-semibold flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#ff6169]" />
                      <span>Opsi Durasi & Tarif ({pkg.durationOptions?.length || 0}):</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {pkg.durationOptions?.map((d) => (
                        <span
                          key={d.id}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border ${
                            d.isPopular
                              ? "bg-[#720C10]/20 border-[#ff6169]/50 text-white font-bold"
                              : "bg-white/[0.03] border-white/10 text-zinc-300"
                          }`}
                        >
                          {d.label} • {formatRupiah(d.price)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Person Capacity Options Pill Matrix */}
                  <div className="mt-3 space-y-2">
                    <p className="text-[10px] font-mono uppercase text-zinc-500 font-semibold flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-[#ff6169]" />
                      <span>Opsi Kapasitas Orang ({pkg.personOptions?.length || 0}):</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {pkg.personOptions?.map((p, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white/[0.03] border border-white/10 text-zinc-400"
                        >
                          {p.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features List */}
                  {pkg.features && pkg.features.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/5 space-y-1">
                      {pkg.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-zinc-400">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-mono text-zinc-500">
                    ID Ruang: <code className="text-zinc-400 font-bold">{pkg.id}</code>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(pkg)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-200 hover:text-white border border-white/10 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#ff6169]" />
                      <span>Edit Paket</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(pkg)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-colors cursor-pointer"
                      title="Hapus Paket"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. MODAL EDIT / TAMBAH PAKET */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 rounded-3xl bg-[#141414] border border-white/15 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#ff6169] font-bold">
                  {editingPkg ? "EDIT PAKET BOOKING" : "TAMBAH PAKET BARU"}
                </span>
                <h3 className="text-xl font-serif text-white font-medium">
                  {editingPkg ? `Ubah: ${editingPkg.name}` : "Konfigurasi Paket Studio Baru"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Row 1: Nama & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5 font-semibold">
                    Nama Paket Studio <span className="text-[#ff6169]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Self Photo Studio (Origine Express)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#ff6169]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5 font-semibold">
                    Teks Badge Kartu
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Contoh: Paling Populer • Self-Service"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#ff6169]"
                  />
                </div>
              </div>

              {/* Row 2: Foto & Tagline Tarif */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5 font-semibold">
                    URL Foto Kartu <span className="text-[#ff6169]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Contoh: /images/studio-space.jpg atau link Unsplash"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#ff6169]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5 font-semibold">
                    Tagline Tarif Dasar (Teks)
                  </label>
                  <input
                    type="text"
                    value={basePriceTag}
                    onChange={(e) => setBasePriceTag(e.target.value)}
                    placeholder="Contoh: Mulai Rp 10.000 / 15 menit"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#ff6169]"
                  />
                </div>
              </div>

              {/* Row 3: Deskripsi Singkat */}
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5 font-semibold">
                  Deskripsi Pengantar Paket
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi singkat fasilitas pemotretan yang didapat..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#ff6169] resize-none"
                />
              </div>

              {/* ============================================================ */}
              {/* SUB-LIST 1: OPSI DURASI & TARIF (SANGAT PENTING!) */}
              {/* ============================================================ */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#ff6169]" />
                    <h4 className="text-sm font-semibold text-white">
                      Opsi Durasi & Tarif Pemotretan
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={addDurationRow}
                    className="px-3 py-1 rounded-lg bg-[#720C10] hover:bg-[#8e0e14] text-white text-xs font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Durasi</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {durationOptions.map((dur, idx) => (
                    <div
                      key={dur.id || idx}
                      className="grid grid-cols-12 gap-2.5 items-center p-3 rounded-xl bg-white/[0.02] border border-white/5"
                    >
                      <div className="col-span-4">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase block">
                          Label Durasi
                        </label>
                        <input
                          type="text"
                          required
                          value={dur.label}
                          onChange={(e) => updateDurationRow(idx, "label", e.target.value)}
                          placeholder="Misal: 15 Menit"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-white text-xs font-mono"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase block">
                          Menit
                        </label>
                        <input
                          type="number"
                          required
                          value={dur.minutes}
                          onChange={(e) => updateDurationRow(idx, "minutes", Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-white text-xs font-mono"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase block">
                          Tarif (IDR)
                        </label>
                        <input
                          type="number"
                          required
                          value={dur.price}
                          onChange={(e) => updateDurationRow(idx, "price", Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-white text-xs font-mono"
                        />
                      </div>

                      <div className="col-span-2 flex items-center justify-end gap-1.5 pt-4">
                        <button
                          type="button"
                          onClick={() => removeDurationRow(idx)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Hapus opsi ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ============================================================ */}
              {/* SUB-LIST 2: OPSI KAPASITAS ORANG & BIAYA TAMBAHAN */}
              {/* ============================================================ */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#ff6169]" />
                    <h4 className="text-sm font-semibold text-white">
                      Opsi Kapasitas Orang & Ekstra Biaya
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={addPersonRow}
                    className="px-3 py-1 rounded-lg bg-[#720C10] hover:bg-[#8e0e14] text-white text-xs font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Opsi Orang</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {personOptions.map((p, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2.5 items-center p-3 rounded-xl bg-white/[0.02] border border-white/5"
                    >
                      <div className="col-span-5">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase block">
                          Label Menu Pilihan
                        </label>
                        <input
                          type="text"
                          required
                          value={p.label}
                          onChange={(e) => updatePersonRow(idx, "label", e.target.value)}
                          placeholder="Misal: 2 Orang (+Rp 5.000)"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-white text-xs font-mono"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase block">
                          Jumlah Orang
                        </label>
                        <input
                          type="number"
                          required
                          value={p.count}
                          onChange={(e) => updatePersonRow(idx, "count", Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-white text-xs font-mono"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase block">
                          Ekstra Biaya (IDR)
                        </label>
                        <input
                          type="number"
                          required
                          value={p.extraPrice}
                          onChange={(e) => updatePersonRow(idx, "extraPrice", Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-white text-xs font-mono"
                        />
                      </div>

                      <div className="col-span-1 flex items-center justify-end pt-4">
                        <button
                          type="button"
                          onClick={() => removePersonRow(idx)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Hapus opsi orang ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checklist Fitur */}
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5 font-semibold">
                  Checklist Fitur (1 fitur per baris)
                </label>
                <textarea
                  rows={4}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="Kamera Full-Frame & Studio Lighting&#10;Wireless Remote Clicker&#10;Unlimited Shots"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#ff6169] resize-none"
                />
              </div>

              {/* Toggle Aktif */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#720C10] bg-zinc-900 border-white/20 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="isActiveToggle" className="text-xs font-mono text-zinc-300 cursor-pointer">
                  Tampilkan paket ini secara aktif di halaman booking publik
                </label>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#720C10] hover:bg-[#8e0e14] text-white text-xs font-mono font-bold transition-all shadow-lg shadow-[#720C10]/30 active:scale-95 disabled:opacity-50"
                >
                  {saving ? "Menyimpan ke Database..." : "Simpan Paket Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
