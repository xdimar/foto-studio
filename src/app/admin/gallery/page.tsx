"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Star,
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  FolderOpen,
} from "lucide-react";
import { StudioGalleryItem } from "@/lib/types";

export default function GalleryManagementPage() {
  const [gallery, setGallery] = useState<StudioGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StudioGalleryItem | null>(null);

  // Upload & Media State
  const [uploadMode, setUploadMode] = useState<"upload" | "url">("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [mediaLibrary, setMediaLibrary] = useState<Array<{ filename: string; url: string }>>([]);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: "",
    category: "Editorial",
    imageUrl: "",
    photographer: "",
    client: "",
    featured: true,
    aspectRatio: "portrait" as "portrait" | "landscape" | "square",
  });

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGallery();
    fetchMediaLibrary();
  }, []);

  async function fetchMediaLibrary() {
    try {
      const res = await fetch("/api/upload");
      const data = await res.json();
      if (data.success && data.files) {
        setMediaLibrary(data.files);
      }
    } catch (e) {
      console.error("Failed to load media library", e);
    }
  }

  async function fetchGallery() {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.success) {
        setGallery(data.gallery || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadFeedback(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setUploadFeedback(data.error || "Gagal mengunggah file.");
      } else {
        setForm((prev) => ({ ...prev, imageUrl: data.url }));
        setUploadFeedback(
          `✓ File berhasil diunggah (${data.storage === "supabase" ? "Supabase Cloud" : "Local Server"})`
        );
        fetchMediaLibrary();
      }
    } catch {
      setUploadFeedback("Terjadi kesalahan jaringan saat mengunggah file.");
    } finally {
      setIsUploading(false);
    }
  };

  const openAdd = () => {
    setEditingItem(null);
    setForm({
      title: "",
      category: "Editorial",
      imageUrl: "/images/hero-fashion.jpg",
      photographer: "Origine Studio Team",
      client: "",
      featured: true,
      aspectRatio: "portrait",
    });
    setFeedback(null);
    setIsAddOpen(true);
  };

  const openEdit = (item: StudioGalleryItem) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
      photographer: item.photographer,
      client: item.client || "",
      featured: item.featured,
      aspectRatio: item.aspectRatio,
    });
    setFeedback(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const isEdit = Boolean(editingItem);
    const method = isEdit ? "PUT" : "POST";
    const body = isEdit ? { id: editingItem!.id, ...form } : form;

    try {
      const res = await fetch("/api/gallery", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.error || "Gagal menyimpan karya." });
      } else {
        setFeedback({ type: "success", message: data.message });
        setTimeout(() => {
          setIsAddOpen(false);
          setEditingItem(null);
          fetchGallery();
        }, 1000);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setFeedback({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus karya "${title}" dari galeri?`)) return;

    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchGallery();
      } else {
        alert(data.error);
      }
    } catch {
      alert("Gagal menghapus karya.");
    }
  };

  const filteredGallery = gallery.filter((item) => {
    return categoryFilter === "all" || item.category.toLowerCase() === categoryFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#ff6169] font-bold">
              MODUL PORTOFOLIO & KARYA
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-[10px] font-mono text-zinc-400">GALERI STUDIO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-white font-medium">
            Kelola Galeri & Portofolio
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-light max-w-2xl leading-relaxed">
            Owner & Admin dapat mengunggah karya foto baru, mengedit kategori mode/portrait/fine-art, serta mengatur sorotan portofolio di website publik.
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-xl shadow-[#720C10]/30 hover:scale-[1.02] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Unggah Foto Baru</span>
        </button>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-white/[0.03] border border-white/10 rounded-xl max-w-full">
        {["all", "Editorial", "Portrait", "Fine Art", "Studio Space"].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 ${
              categoryFilter.toLowerCase() === cat.toLowerCase()
                ? "bg-[#720C10] text-white font-semibold shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {cat === "all" ? "Semua Kategori" : cat}
          </button>
        ))}
      </div>

      {/* GALLERY GRID */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-zinc-500">
          Memuat portofolio galeri...
        </div>
      ) : filteredGallery.length === 0 ? (
        <div className="py-20 text-center text-xs font-mono text-zinc-500">
          Tidak ada karya di kategori ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-[#121212] overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-[#720C10] transition-all"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/5] bg-zinc-900 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized={item.imageUrl.startsWith("http")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-black/60 backdrop-blur-md text-white border border-white/10">
                    {item.category}
                  </span>
                  {item.featured && (
                    <span className="p-1 rounded bg-[#720C10] text-white text-[10px]" title="Karya Unggulan">
                      <Star className="w-3 h-3 fill-current" />
                    </span>
                  )}
                </div>
              </div>

              {/* Caption & Actions */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-sm font-medium text-white line-clamp-1">{item.title}</h3>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mt-1">
                    <span>{item.photographer}</span>
                    <span>{item.date}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <a
                    href={item.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    <span>Buka File</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white"
                      title="Edit Karya"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 rounded-lg border border-red-500/20 hover:border-red-500/50 text-red-400 hover:text-red-200"
                      title="Hapus Karya"
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

      {/* MODAL: TAMBAH / EDIT KARYA */}
      {(isAddOpen || editingItem) && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className="max-w-md w-full bg-[#141414] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div>
                <h3 className="text-lg font-serif text-white font-medium">
                  {editingItem ? "Edit Karya Foto" : "Unggah Karya Foto Baru"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingItem(null);
                }}
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

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Judul Karya Foto *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Seri Mode Poncokusumo"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Kategori
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                >
                  <option value="Editorial">Editorial</option>
                  <option value="Portrait">Portrait</option>
                  <option value="Fine Art">Fine Art</option>
                  <option value="Studio Space">Studio Space</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              {/* MEDIA & UPLOAD MANAGEMENT */}
              <div className="space-y-2 p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono uppercase text-zinc-300 font-semibold flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#ff6169]" />
                    <span>Media Gambar Foto *</span>
                  </label>

                  {/* Mode Selector */}
                  <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded-lg border border-white/10 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setUploadMode("upload")}
                      className={`px-2 py-0.5 rounded ${
                        uploadMode === "upload" ? "bg-[#720C10] text-white font-bold" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Unggah File
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode("url")}
                      className={`px-2 py-0.5 rounded ${
                        uploadMode === "url" ? "bg-[#720C10] text-white font-bold" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Input URL
                    </button>
                  </div>
                </div>

                {uploadMode === "upload" ? (
                  <div className="space-y-2 pt-1">
                    <label className="relative border-2 border-dashed border-white/20 hover:border-[#720C10] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-black/40 group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                      {isUploading ? (
                        <div className="flex flex-col items-center py-2 gap-2 text-zinc-300">
                          <Loader2 className="w-6 h-6 animate-spin text-[#ff6169]" />
                          <span className="text-xs font-mono">Mengunggah ke Cloud / Storage...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-1 gap-1 text-center">
                          <UploadCloud className="w-7 h-7 text-zinc-400 group-hover:text-[#ff6169] transition-colors" />
                          <span className="text-xs font-medium text-white group-hover:text-[#ff6169] transition-colors">
                            Klik atau Seret Foto ke Sini
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            Mendukung JPG, PNG, WebP (Maksimal 10MB)
                          </span>
                        </div>
                      )}
                    </label>

                    {uploadFeedback && (
                      <p className={`text-[11px] font-mono ${uploadFeedback.startsWith("✓") ? "text-emerald-400" : "text-red-400"}`}>
                        {uploadFeedback}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="pt-1">
                    <input
                      type="text"
                      placeholder="/images/hero-fashion.jpg atau URL HTTPS..."
                      value={form.imageUrl}
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                    />
                  </div>
                )}

                {/* Media Library Quick Pick */}
                {mediaLibrary.length > 0 && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowMediaLibrary(!showMediaLibrary)}
                      className="text-[10px] font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <FolderOpen className="w-3 h-3 text-[#ff6169]" />
                      <span>{showMediaLibrary ? "Sembunyikan Pustaka Media" : `Pilih dari Media Terunggah (${mediaLibrary.length})`}</span>
                    </button>

                    {showMediaLibrary && (
                      <div className="mt-2 p-2 rounded-xl bg-black/70 border border-white/10 grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                        {mediaLibrary.map((m) => (
                          <div
                            key={m.filename}
                            onClick={() => {
                              setForm({ ...form, imageUrl: m.url });
                              setUploadFeedback(`✓ Dipilih dari pustaka: ${m.filename}`);
                            }}
                            className={`cursor-pointer rounded-lg overflow-hidden border aspect-square relative group transition-all ${
                              form.imageUrl === m.url ? "border-[#720C10] ring-1 ring-[#720C10]" : "border-white/10 hover:border-white/30"
                            }`}
                            title={m.filename}
                          >
                            <img
                              src={m.url}
                              alt={m.filename}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Active Image Thumbnail Preview */}
                {form.imageUrl && (
                  <div className="mt-2.5 p-2 rounded-lg bg-black/50 border border-white/10 flex items-center gap-3">
                    <div className="w-12 h-14 rounded-md overflow-hidden bg-zinc-900 shrink-0 relative border border-white/10">
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/images/hero-fashion.jpg";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono text-emerald-400 block font-semibold">
                        Preview Foto Aktif
                      </span>
                      <p className="text-[11px] font-mono text-zinc-300 truncate" title={form.imageUrl}>
                        {form.imageUrl}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                    Nama Fotografer
                  </label>
                  <input
                    type="text"
                    value={form.photographer}
                    onChange={(e) => setForm({ ...form, photographer: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                    Klien / Publikasi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Harper's Bazaar"
                    value={form.client}
                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-[#720C10] bg-black border-white/20"
                />
                <label htmlFor="featured" className="text-xs text-zinc-300 font-mono">
                  Tampilkan sebagai Karya Unggulan di Portofolio Utama
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2.5 rounded-full border border-white/10 text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider"
                >
                  {submitting ? "Menyimpan..." : "Simpan Karya"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
