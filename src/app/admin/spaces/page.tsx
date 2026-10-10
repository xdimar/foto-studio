"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Layers,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  Sparkles,
  Maximize2,
  Zap,
  Shield,
  Eye,
  Info,
} from "lucide-react";
import { StudioSpaceItem, StaffSession } from "@/lib/types";

export default function AdminSpacesPage() {
  const [spaces, setSpaces] = useState<StudioSpaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<StaffSession | null>(null);

  // Edit / Add Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<StudioSpaceItem | null>(null);

  // Form Fields
  const [formNumber, setFormNumber] = useState("");
  const [formName, setFormName] = useState("");
  const [formTagline, setFormTagline] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formSecondaryImage, setFormSecondaryImage] = useState("");
  const [formArea, setFormArea] = useState("");
  const [formCeiling, setFormCeiling] = useState("");
  const [formCove, setFormCove] = useState("");
  const [formPower, setFormPower] = useState("");
  const [formHourlyRate, setFormHourlyRate] = useState("");
  const [formIdealFor, setFormIdealFor] = useState("");
  const [formEquipment, setFormEquipment] = useState("");
  const [formFeatures, setFormFeatures] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<"primary" | "secondary">("primary");

  // Feedback & Saving
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchSession();
    fetchSpaces();
  }, []);

  async function fetchSession() {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.authenticated && data.user) {
        setSession(data.user);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchSpaces() {
    setLoading(true);
    try {
      const res = await fetch("/api/spaces");
      const data = await res.json();
      if (data.success) {
        setSpaces(data.spaces || []);
      }
    } catch (err) {
      console.error("Gagal memuat ruang studio:", err);
    } finally {
      setLoading(false);
    }
  }

  const isAuthorized = session?.role === "owner" || session?.role === "admin";

  const handleOpenAddModal = () => {
    setEditingSpace(null);
    const nextNumber = String(spaces.length + 1).padStart(2, "0");
    setFormNumber(nextNumber);
    setFormName("");
    setFormTagline("");
    setFormImage("/images/studio-space.jpg");
    setFormSecondaryImage("");
    setFormArea("120 m²");
    setFormCeiling("5,5 meter");
    setFormCove("Lengkung 9m x 6m");
    setFormPower("Listrik 3-Fase 32A");
    setFormHourlyRate("Rp 300.000 / jam");
    setFormIdealFor("Editorial Mode\nFoto Personal\nProduksi Video");
    setFormEquipment("2x Broncolor Siros 800 S\nSoftbox Jumbo\nC-Stand & Grip");
    setFormFeatures("Ruang rias ber-AC\nLantai epoxy putih\nDinding akustik");
    setFormIsActive(true);
    setFeedback(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (space: StudioSpaceItem) => {
    setEditingSpace(space);
    setFormNumber(space.number || "01");
    setFormName(space.name || "");
    setFormTagline(space.tagline || "");
    setFormImage(space.image || "");
    setFormSecondaryImage(space.secondaryImage || "");
    setFormArea(space.area || "");
    setFormCeiling(space.ceiling || "");
    setFormCove(space.cove || "");
    setFormPower(space.power || "");
    setFormHourlyRate(space.hourlyRate || "");
    setFormIdealFor(Array.isArray(space.idealFor) ? space.idealFor.join("\n") : "");
    setFormEquipment(Array.isArray(space.equipmentIncluded) ? space.equipmentIncluded.join("\n") : "");
    setFormFeatures(Array.isArray(space.features) ? space.features.join("\n") : "");
    setFormIsActive(space.isActive !== false);
    setFeedback(null);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "primary" | "secondary") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadTarget(target);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success && data.url) {
        if (target === "primary") {
          setFormImage(data.url);
        } else {
          setFormSecondaryImage(data.url);
        }
      } else {
        alert(data.error || "Gagal mengunggah foto.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan saat mengunggah foto.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formImage.trim()) {
      setFeedback({ type: "error", message: "Nama ruangan dan foto utama wajib diisi." });
      return;
    }

    setSaving(true);
    setFeedback(null);

    const payload = {
      number: formNumber.trim(),
      name: formName.trim(),
      tagline: formTagline.trim(),
      image: formImage.trim(),
      secondaryImage: formSecondaryImage.trim(),
      area: formArea.trim(),
      ceiling: formCeiling.trim(),
      cove: formCove.trim(),
      power: formPower.trim(),
      hourlyRate: formHourlyRate.trim(),
      idealFor: formIdealFor.split("\n").map((s) => s.trim()).filter(Boolean),
      equipmentIncluded: formEquipment.split("\n").map((s) => s.trim()).filter(Boolean),
      features: formFeatures.split("\n").map((s) => s.trim()).filter(Boolean),
      isActive: formIsActive,
    };

    try {
      let res;
      if (editingSpace) {
        res = await fetch("/api/spaces", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingSpace.id, ...payload }),
        });
      } else {
        res = await fetch("/api/spaces", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.error || "Gagal menyimpan ruangan." });
      } else {
        setFeedback({ type: "success", message: data.message });
        setTimeout(() => {
          setIsModalOpen(false);
          fetchSpaces();
        }, 800);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan koneksi.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus ruang studio "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;

    try {
      const res = await fetch(`/api/spaces?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchSpaces();
      } else {
        alert(data.error || "Gagal menghapus ruangan.");
      }
    } catch {
      alert("Gagal menghapus ruangan.");
    }
  };

  if (!loading && !isAuthorized) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center py-24 space-y-4">
        <Shield className="w-16 h-16 text-red-500 mx-auto opacity-70" />
        <h2 className="text-2xl font-serif text-white">Akses Terbatas: Khusus Owner & Admin</h2>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Halaman pengelolaan fasilitas dan suite studio hanya dapat diakses oleh akun dengan peran Owner atau Admin.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono tracking-widest uppercase text-[#ff6169] mb-2">
            <Layers className="w-3.5 h-3.5 text-[#720C10]" />
            MANAJEMEN RUANG STUDIO DINAMIS
          </div>
          <h1 className="text-3xl font-serif text-white font-light">
            Suite & Arsitektur <span className="italic font-serif-italic">Origine Studio</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Data ruang studio ini langsung terhubung ke halaman publik <code>/spaces</code> dan beranda.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#720C10] hover:bg-[#8B0000] text-white text-xs font-mono tracking-wider uppercase transition-all shadow-lg hover:shadow-[#720C10]/30 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Ruang Studio</span>
        </button>
      </div>

      {/* Spaces Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#720C10] border-t-white animate-spin" />
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">Memuat Ruang Studio...</p>
        </div>
      ) : spaces.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl p-8">
          <p className="text-zinc-400 text-sm font-mono">Belum ada ruang studio terdaftar.</p>
          <button
            onClick={handleOpenAddModal}
            className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-white inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Ruangan Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {spaces.map((space) => (
            <div
              key={space.id}
              className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-xl"
            >
              <div>
                {/* Media Banner */}
                <div className="relative aspect-[16/9] w-full bg-zinc-900 border-b border-white/10">
                  {space.image ? (
                    <Image
                      src={space.image}
                      alt={space.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 font-mono text-xs">
                      Tanpa Foto
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-xs font-mono text-white font-bold">
                      STUDIO {space.number}
                    </span>
                    {space.isActive === false && (
                      <span className="px-2 py-0.5 rounded-md bg-red-500/20 border border-red-500/40 text-[10px] font-mono text-red-300 uppercase">
                        Nonaktif
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xl font-serif text-white font-medium drop-shadow-md">{space.name}</p>
                    <p className="text-xs text-zinc-300 font-light line-clamp-1 mt-0.5">{space.tagline}</p>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 space-y-4">
                  {/* Quick Specs Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono pb-4 border-b border-white/10">
                    <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                      <span className="text-zinc-500 block text-[10px] uppercase">Luas Area</span>
                      <span className="text-zinc-200 font-medium">{space.area}</span>
                    </div>
                    <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                      <span className="text-zinc-500 block text-[10px] uppercase">Plafon</span>
                      <span className="text-zinc-200 font-medium">{space.ceiling}</span>
                    </div>
                    <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                      <span className="text-zinc-500 block text-[10px] uppercase">Tarif Studio</span>
                      <span className="text-emerald-400 font-semibold">{space.hourlyRate}</span>
                    </div>
                    {space.power && (
                      <div className="bg-black/30 p-2.5 rounded-lg border border-white/5 col-span-2 sm:col-span-1">
                        <span className="text-zinc-500 block text-[10px] uppercase">Daya Listrik</span>
                        <span className="text-zinc-200 font-medium">{space.power}</span>
                      </div>
                    )}
                    {space.cove && (
                      <div className="bg-black/30 p-2.5 rounded-lg border border-white/5 col-span-2">
                        <span className="text-zinc-500 block text-[10px] uppercase">Lengkung / Fitur</span>
                        <span className="text-zinc-200 font-medium truncate block">{space.cove}</span>
                      </div>
                    )}
                  </div>

                  {/* Highlights Summary */}
                  <div className="space-y-2 text-xs">
                    <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Fitur & Fasilitas ({space.features?.length || 0}):</p>
                    <div className="flex flex-wrap gap-1.5">
                      {space.features?.slice(0, 3).map((f: string, i: number) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-zinc-300 text-[11px]"
                        >
                          • {f}
                        </span>
                      ))}
                      {(space.features?.length || 0) > 3 && (
                        <span className="px-2 py-1 text-zinc-500 text-[11px]">
                          +{(space.features?.length || 0) - 3} lainnya
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="p-4 bg-black/40 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-500">ID: {space.id}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(space)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-200 hover:text-white transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit Ruangan</span>
                  </button>
                  <button
                    onClick={() => handleDelete(space.id, space.name)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-mono text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-[#ff6169] uppercase tracking-wider">
                  {editingSpace ? "EDIT RUANG STUDIO" : "TAMBAH RUANG STUDIO BARU"}
                </span>
                <h3 className="text-xl font-serif text-white font-medium mt-1">
                  {editingSpace ? `Perbarui ${editingSpace.name}` : "Spesifikasi Ruangan Baru"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {feedback && (
                <div
                  className={`p-4 rounded-xl text-xs font-mono flex items-center gap-3 ${
                    feedback.type === "success"
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                      : "bg-red-500/10 border border-red-500/30 text-red-300"
                  }`}
                >
                  {feedback.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}

              {/* Primary Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Nomor Urut / Kode</label>
                  <input
                    type="text"
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    placeholder="Contoh: 01"
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-[#720C10]"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Nama Ruang Studio</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Cyclorama Utama"
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-[#720C10]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Tagline / Deskripsi Singkat</label>
                <input
                  type="text"
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  placeholder="Contoh: Ruang Monumental Tanpa Batas untuk Kampanye Komersial"
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-[#720C10]"
                />
              </div>

              {/* Image Upload / URL Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-zinc-400">
                    Foto Utama Ruangan (URL atau Upload)
                  </label>
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="/images/studio-space.jpg atau https://..."
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-[#720C10]"
                    required
                  />
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading && uploadTarget === "primary" ? "Mengunggah..." : "Upload Gambar"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "primary")}
                        disabled={isUploading}
                      />
                    </label>
                    {formImage && (
                      <span className="text-[11px] font-mono text-emerald-400">✓ Gambar terpasang</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono text-zinc-400">
                    Foto Sekunder / Sudut Alternatif (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formSecondaryImage}
                    onChange={(e) => setFormSecondaryImage(e.target.value)}
                    placeholder="URL gambar sekunder..."
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-[#720C10]"
                  />
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading && uploadTarget === "secondary" ? "Mengunggah..." : "Upload Gambar"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "secondary")}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-4">
                <p className="text-xs font-mono text-[#ff6169] uppercase tracking-wider">
                  Spesifikasi Teknis & Dimensi
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Luas Ruangan</label>
                    <input
                      type="text"
                      value={formArea}
                      onChange={(e) => setFormArea(e.target.value)}
                      placeholder="180 m² (1.937 sq ft)"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Tinggi Plafon</label>
                    <input
                      type="text"
                      value={formCeiling}
                      onChange={(e) => setFormCeiling(e.target.value)}
                      placeholder="Tinggi Bersih 6,2 meter"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Tarif Per Jam</label>
                    <input
                      type="text"
                      value={formHourlyRate}
                      onChange={(e) => setFormHourlyRate(e.target.value)}
                      placeholder="Rp 350.000 / jam"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Karakter Lengkung/Jendela</label>
                    <input
                      type="text"
                      value={formCove}
                      onChange={(e) => setFormCove(e.target.value)}
                      placeholder="Lengkung Lebar 12m x Kedalaman 9m"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Daya & Pasokan Listrik</label>
                    <input
                      type="text"
                      value={formPower}
                      onChange={(e) => setFormPower(e.target.value)}
                      placeholder="Listrik 3-Fase Camlock 63A"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-zinc-300">
                      <input
                        type="checkbox"
                        checked={formIsActive}
                        onChange={(e) => setFormIsActive(e.target.checked)}
                        className="rounded border-zinc-700 text-[#720C10] focus:ring-[#720C10] h-4 w-4"
                      />
                      <span>Tampilkan di Publik</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Multi-line Lists */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Ideal Untuk (1 baris per item)
                  </label>
                  <textarea
                    rows={4}
                    value={formIdealFor}
                    onChange={(e) => setFormIdealFor(e.target.value)}
                    placeholder="Editorial Mode&#10;Foto Grup Besar&#10;Video Musik"
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-[#720C10]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Peralatan Termasuk (1 baris per item)
                  </label>
                  <textarea
                    rows={4}
                    value={formEquipment}
                    onChange={(e) => setFormEquipment(e.target.value)}
                    placeholder="4x Broncolor Siros 800&#10;Motorized Pantograph&#10;Wireless PA Audio"
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-[#720C10]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Fitur & Fasilitas (1 baris per item)
                  </label>
                  <textarea
                    rows={4}
                    value={formFeatures}
                    onChange={(e) => setFormFeatures(e.target.value)}
                    placeholder="Pintu roller drive-in mobil&#10;Mezanin VIP ber-AC&#10;Dinding kedap suara"
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-[#720C10]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || isUploading}
                  className="px-6 py-2.5 rounded-xl bg-[#720C10] hover:bg-[#8B0000] text-white text-xs font-mono uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  {saving ? "Menyimpan..." : editingSpace ? "Perbarui Ruangan" : "Simpan Ruangan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
