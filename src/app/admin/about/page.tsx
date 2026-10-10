"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Upload,
  Shield,
  Users,
  Award,
  BookOpen,
  Camera,
  X,
  Save,
} from "lucide-react";
import { StudioAboutContent, TeamMember, CoreValue, StaffSession } from "@/lib/types";

export default function AdminAboutPage() {
  const [session, setSession] = useState<StaffSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // About Content State
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [storyParagraph1, setStoryParagraph1] = useState("");
  const [storyParagraph2, setStoryParagraph2] = useState("");
  const [ethosQuote, setEthosQuote] = useState("");
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [values, setValues] = useState<CoreValue[]>([]);
  const [clientBrands, setClientBrands] = useState<string>("");

  // Team Member Modal State
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberFormName, setMemberFormName] = useState("");
  const [memberFormRole, setMemberFormRole] = useState("");
  const [memberFormBio, setMemberFormBio] = useState("");
  const [memberFormImage, setMemberFormImage] = useState("");
  const [memberFormGear, setMemberFormGear] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Value Modal State
  const [isValueModalOpen, setIsValueModalOpen] = useState(false);
  const [editingValue, setEditingValue] = useState<CoreValue | null>(null);
  const [valueFormTitle, setValueFormTitle] = useState("");
  const [valueFormDesc, setValueFormDesc] = useState("");

  useEffect(() => {
    fetchSession();
    fetchAboutContent();
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

  async function fetchAboutContent() {
    setLoading(true);
    try {
      const res = await fetch("/api/about");
      const data = await res.json();
      if (data.success && data.about) {
        const ab: StudioAboutContent = data.about;
        setHeroTitle(ab.heroTitle || "");
        setHeroSubtitle(ab.heroSubtitle || "");
        setStoryParagraph1(ab.storyParagraph1 || "");
        setStoryParagraph2(ab.storyParagraph2 || "");
        setEthosQuote(ab.ethosQuote || "");
        setTeam(ab.team || []);
        setValues(ab.values || []);
        setClientBrands(Array.isArray(ab.clientBrands) ? ab.clientBrands.join(", ") : "");
      }
    } catch (err) {
      console.error("Gagal memuat profil studio:", err);
    } finally {
      setLoading(false);
    }
  }

  const isAuthorized = session?.role === "owner" || session?.role === "admin";

  // Upload team member image
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setMemberFormImage(data.url);
      } else {
        alert(data.error || "Gagal mengunggah foto.");
      }
    } catch {
      alert("Gagal mengunggah gambar tim.");
    } finally {
      setIsUploading(false);
    }
  };

  // Open Add Team Modal
  const handleOpenAddTeam = () => {
    setEditingMember(null);
    setMemberFormName("");
    setMemberFormRole("Fotografer & Visual Lead");
    setMemberFormBio("");
    setMemberFormImage("https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop");
    setMemberFormGear("Leica SL2-S • Broncolor");
    setIsTeamModalOpen(true);
  };

  // Open Edit Team Modal
  const handleOpenEditTeam = (m: TeamMember) => {
    setEditingMember(m);
    setMemberFormName(m.name);
    setMemberFormRole(m.role);
    setMemberFormBio(m.bio);
    setMemberFormImage(m.image);
    setMemberFormGear(m.gear || "");
    setIsTeamModalOpen(true);
  };

  // Save Team Member to local state
  const handleSaveTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberFormName.trim()) return;

    if (editingMember) {
      setTeam((prev) =>
        prev.map((m) =>
          m.id === editingMember.id
            ? {
                ...m,
                name: memberFormName.trim(),
                role: memberFormRole.trim(),
                bio: memberFormBio.trim(),
                image: memberFormImage.trim(),
                gear: memberFormGear.trim(),
              }
            : m
        )
      );
    } else {
      const newMember: TeamMember = {
        id: `team-${Date.now()}`,
        name: memberFormName.trim(),
        role: memberFormRole.trim(),
        bio: memberFormBio.trim(),
        image: memberFormImage.trim(),
        gear: memberFormGear.trim(),
      };
      setTeam((prev) => [...prev, newMember]);
    }

    setIsTeamModalOpen(false);
  };

  const handleDeleteTeamMember = (id: string) => {
    if (confirm("Hapus anggota tim ini?")) {
      setTeam((prev) => prev.filter((m) => m.id !== id));
    }
  };

  // Open Add Value Modal
  const handleOpenAddValue = () => {
    setEditingValue(null);
    setValueFormTitle("");
    setValueFormDesc("");
    setIsValueModalOpen(true);
  };

  const handleOpenEditValue = (v: CoreValue) => {
    setEditingValue(v);
    setValueFormTitle(v.title);
    setValueFormDesc(v.desc);
    setIsValueModalOpen(true);
  };

  const handleSaveValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valueFormTitle.trim()) return;

    if (editingValue) {
      setValues((prev) =>
        prev.map((v) =>
          v.id === editingValue.id
            ? { ...v, title: valueFormTitle.trim(), desc: valueFormDesc.trim() }
            : v
        )
      );
    } else {
      const newVal: CoreValue = {
        id: `val-${Date.now()}`,
        title: valueFormTitle.trim(),
        desc: valueFormDesc.trim(),
      };
      setValues((prev) => [...prev, newVal]);
    }

    setIsValueModalOpen(false);
  };

  const handleDeleteValue = (id: string) => {
    if (confirm("Hapus nilai filosofi ini?")) {
      setValues((prev) => prev.filter((v) => v.id !== id));
    }
  };

  // Save All Changes to Server
  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const brandsArray = clientBrands
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);

    const payload: StudioAboutContent = {
      heroTitle: heroTitle.trim(),
      heroSubtitle: heroSubtitle.trim(),
      storyParagraph1: storyParagraph1.trim(),
      storyParagraph2: storyParagraph2.trim(),
      ethosQuote: ethosQuote.trim(),
      team,
      values,
      clientBrands: brandsArray,
    };

    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.error || "Gagal menyimpan perubahan." });
      } else {
        setFeedback({ type: "success", message: "Seluruh profil dan tim studio berhasil diperbarui!" });
        setTimeout(() => setFeedback(null), 4000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan jaringan.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  if (!loading && !isAuthorized) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center py-24 space-y-4">
        <Shield className="w-16 h-16 text-red-500 mx-auto opacity-70" />
        <h2 className="text-2xl font-serif text-white">Akses Terbatas: Khusus Owner & Admin</h2>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Halaman pengelolaan profil studio & tim hanya dapat diakses oleh akun dengan peran Owner atau Admin.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono tracking-widest uppercase text-[#ff6169] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#720C10]" />
            MANAJEMEN PROFIL & TIM DINAMIS
          </div>
          <h1 className="text-3xl font-serif text-white font-light">
            Tentang Kami & <span className="italic font-serif-italic">Kru Origine Studio</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Data ini langsung ditampilkan pada halaman <code>/about</code> dan beranda bagian narasi.
          </p>
        </div>

        <button
          onClick={() => handleSaveAll()}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#720C10] hover:bg-[#8B0000] text-white text-xs font-mono tracking-wider uppercase transition-all shadow-lg hover:shadow-[#720C10]/30 self-start sm:self-auto cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Menyimpan..." : "Simpan Semua Perubahan"}</span>
        </button>
      </div>

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

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#720C10] border-t-white animate-spin" />
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">Memuat Data Profil...</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* SECTION 1: NARRATIVE & ETHOS */}
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <BookOpen className="w-5 h-5 text-[#ff6169]" />
              <h2 className="text-lg font-serif text-white">1. Narasi Utama & Filosofi Studio</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Judul Banner Kisah (Hero Title)
                  </label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-[#720C10]"
                    placeholder="Kisah di Balik Origine Studio."
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Sub-judul Kisah (Hero Subtitle)
                  </label>
                  <textarea
                    rows={3}
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-[#720C10]"
                    placeholder="Berawal dari sebuah gagasan sederhana..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Kutipan Etos Kreatif (Creative Ethos)
                  </label>
                  <textarea
                    rows={3}
                    value={ethosQuote}
                    onChange={(e) => setEthosQuote(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-[#720C10]"
                    placeholder="Kami memperlakukan cahaya sebagai materi fisik..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Brand Klien / Kolaborator (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={clientBrands}
                    onChange={(e) => setClientBrands(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-[#720C10]"
                    placeholder="VOGUE, ELLE, HARPER'S BAZAAR, CARTIER, CHANEL"
                  />
                </div>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Paragraf Narasi 1 (Tentang Keaslian & Lokasi)
                  </label>
                  <textarea
                    rows={4}
                    value={storyParagraph1}
                    onChange={(e) => setStoryParagraph1(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-[#720C10]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Paragraf Narasi 2 (Fasilitas & Standar Visual)
                  </label>
                  <textarea
                    rows={4}
                    value={storyParagraph2}
                    onChange={(e) => setStoryParagraph2(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-[#720C10]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: TEAM MEMBERS ROSTER */}
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#ff6169]" />
                <h2 className="text-lg font-serif text-white">
                  2. Tim & Seniman Studio ({team.length} Anggota)
                </h2>
              </div>
              <button
                type="button"
                onClick={handleOpenAddTeam}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Anggota Tim</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="bg-black/40 border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between group hover:border-white/20 transition-all"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full bg-zinc-900 border-b border-white/10">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600 font-mono text-xs">
                          Tanpa Foto
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-base font-serif text-white font-medium">{member.name}</p>
                        <p className="text-[11px] font-mono text-[#ff6169]">{member.role}</p>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">{member.bio}</p>
                      {member.gear && (
                        <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
                          <Camera className="w-3 h-3 text-[#720C10]" />
                          <span className="truncate">{member.gear}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-black/60 border-t border-white/10 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditTeam(member)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 transition-colors"
                      title="Edit Anggota"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTeamMember(member.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      title="Hapus Anggota"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: CORE VALUES */}
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-[#ff6169]" />
                <h2 className="text-lg font-serif text-white">3. Pilar & Nilai Utama Studio ({values.length})</h2>
              </div>
              <button
                type="button"
                onClick={handleOpenAddValue}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Nilai Filosofi</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {values.map((val) => (
                <div
                  key={val.id}
                  className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-serif text-white font-medium">{val.title}</p>
                    <p className="text-xs text-zinc-400 leading-relaxed">{val.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEditValue(val)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteValue(val.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TEAM MEMBER MODAL */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-serif text-white">
                {editingMember ? "Edit Anggota Tim" : "Tambah Anggota Tim Baru"}
              </h3>
              <button
                onClick={() => setIsTeamModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTeamMember} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={memberFormName}
                  onChange={(e) => setMemberFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-sm text-white"
                  placeholder="Contoh: Ratna Kusuma"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Peran / Jabatan</label>
                <input
                  type="text"
                  value={memberFormRole}
                  onChange={(e) => setMemberFormRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                  placeholder="Contoh: Founder & Creative Director"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Biografi Singkat</label>
                <textarea
                  rows={3}
                  value={memberFormBio}
                  onChange={(e) => setMemberFormBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                  placeholder="Pengalaman, gaya visual, atau spesialisasi..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-zinc-400">Foto Profil (URL atau Upload)</label>
                <input
                  type="text"
                  value={memberFormImage}
                  onChange={(e) => setMemberFormImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                  placeholder="https://images.unsplash.com/..."
                />
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? "Mengunggah..." : "Upload Foto Profil"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Kamera & Perlengkapan Utama</label>
                <input
                  type="text"
                  value={memberFormGear}
                  onChange={(e) => setMemberFormGear(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                  placeholder="Contoh: Leica SL2-S • Hasselblad 907X"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#720C10] hover:bg-[#8B0000] text-white text-xs font-mono uppercase tracking-wider"
                >
                  Simpan Anggota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CORE VALUE MODAL */}
      {isValueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-white/15 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-serif text-white">
                {editingValue ? "Edit Nilai Filosofi" : "Tambah Nilai Filosofi"}
              </h3>
              <button
                onClick={() => setIsValueModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveValue} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Judul Nilai</label>
                <input
                  type="text"
                  value={valueFormTitle}
                  onChange={(e) => setValueFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-sm text-white"
                  placeholder="Contoh: Keaslian Tanpa Rekayasa Berlebih"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Deskripsi Nilai</label>
                <textarea
                  rows={3}
                  value={valueFormDesc}
                  onChange={(e) => setValueFormDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                  placeholder="Penjelasan filosofis nilai studio ini..."
                  required
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsValueModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#720C10] hover:bg-[#8B0000] text-white text-xs font-mono uppercase tracking-wider"
                >
                  Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
