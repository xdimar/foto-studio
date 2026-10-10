"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders,
  Phone,
  Mail,
  MapPin,
  Clock,
  AtSign,
  CheckCircle2,
  AlertCircle,
  Save,
  Shield,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { StudioContactSettings, StaffSession } from "@/lib/types";

export default function AdminSettingsPage() {
  const [session, setSession] = useState<StaffSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form State
  const [brandName, setBrandName] = useState("");
  const [tagline, setTagline] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressSubdistrict, setAddressSubdistrict] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [operatingHours, setOperatingHours] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");

  useEffect(() => {
    fetchSession();
    fetchSettings();
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

  async function fetchSettings() {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        const s: StudioContactSettings = data.settings;
        setBrandName(s.brandName || "Origine Studio");
        setTagline(s.tagline || "Timeless Memories From the Origine");
        setPhone(s.phone || "+62 851-9667-1398");
        setWhatsappNumber(s.whatsappNumber || "6285196671398");
        setEmail(s.email || "concierge@origine-studio.my.id");
        setAddressLine1(s.addressLine1 || "Jl. Raya Belung, Belung");
        setAddressSubdistrict(s.addressSubdistrict || "Kec. Poncokusumo");
        setAddressCity(s.addressCity || "Kabupaten Malang, Jawa Timur 65157");
        setGoogleMapsUrl(s.googleMapsUrl || "https://maps.app.goo.gl/XUjKjMeSeEBewEgq6");
        setOperatingHours(s.operatingHours || "08:00 - 22:00 WIB");
        setInstagramHandle(s.instagramHandle || "@originestudio");
      }
    } catch (err) {
      console.error("Gagal memuat pengaturan:", err);
    } finally {
      setLoading(false);
    }
  }

  const isAuthorized = session?.role === "owner" || session?.role === "admin";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    // Clean whatsapp number (digits only)
    const cleanWA = whatsappNumber.replace(/[^0-9]/g, "");

    const payload: StudioContactSettings = {
      brandName: brandName.trim(),
      tagline: tagline.trim(),
      phone: phone.trim(),
      whatsappNumber: cleanWA,
      email: email.trim(),
      addressLine1: addressLine1.trim(),
      addressSubdistrict: addressSubdistrict.trim(),
      addressCity: addressCity.trim(),
      googleMapsUrl: googleMapsUrl.trim(),
      operatingHours: operatingHours.trim(),
      instagramHandle: instagramHandle.trim(),
    };

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.error || "Gagal menyimpan pengaturan." });
      } else {
        setFeedback({ type: "success", message: "Pengaturan dan kontak studio berhasil diperbarui secara langsung!" });
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
          Halaman pengaturan identitas dan kontak studio hanya dapat diakses oleh akun dengan peran Owner atau Admin.
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
            <Sliders className="w-3.5 h-3.5 text-[#720C10]" />
            PENGATURAN STUDIO & KONTAK RESMI
          </div>
          <h1 className="text-3xl font-serif text-white font-light">
            Identitas & Kontak <span className="italic font-serif-italic">Origine Studio</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Informasi kontak ini langsung sinkron ke formulir WhatsApp, tombol konsultasi, dan footer seluruh website.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#720C10] hover:bg-[#8B0000] text-white text-xs font-mono tracking-wider uppercase transition-all shadow-lg hover:shadow-[#720C10]/30 self-start sm:self-auto cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Menyimpan..." : "Simpan Pengaturan"}</span>
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
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">Memuat Pengaturan Studio...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: SETTINGS FORM (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* BRAND & TAGLINE */}
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
              <h2 className="text-base font-serif text-white pb-3 border-b border-white/10">
                1. Identitas Brand Studio
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Nama Brand Studio</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-[#720C10]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Tagline Resmi</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-[#720C10]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* DIRECT HOTLINE & WHATSAPP */}
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
              <h2 className="text-base font-serif text-white pb-3 border-b border-white/10">
                2. Meja Kontak & Komunikasi Klien
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Nomor WhatsApp (Format: 628...)
                  </label>
                  <div className="relative">
                    <MessageCircle className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="6285196671398"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-[#720C10]"
                      required
                    />
                  </div>
                  <p className="text-[10px] font-mono text-zinc-500 mt-1">
                    Gunakan kode negara tanpa tanda plus atau strip (contoh: 6285196671398)
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Hotline Telepon / Tampilan Publik
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+62 851-9667-1398"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-[#720C10]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Email Resmi Studio</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="concierge@origine-studio.my.id"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-[#720C10]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Username Instagram</label>
                  <div className="relative">
                    <AtSign className="w-4 h-4 text-pink-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={instagramHandle}
                      onChange={(e) => setInstagramHandle(e.target.value)}
                      placeholder="@originestudio"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-[#720C10]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Jam Operasional Studio</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={operatingHours}
                      onChange={(e) => setOperatingHours(e.target.value)}
                      placeholder="08:00 - 22:00 WIB"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-[#720C10]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* LOCATION & GOOGLE MAPS */}
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
              <h2 className="text-base font-serif text-white pb-3 border-b border-white/10">
                3. Alamat Fisik & Lokasi Google Maps
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Alamat Baris 1 (Jalan & Desa)</label>
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="Jl. Raya Belung, Belung"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-[#720C10]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Kecamatan</label>
                    <input
                      type="text"
                      value={addressSubdistrict}
                      onChange={(e) => setAddressSubdistrict(e.target.value)}
                      placeholder="Kec. Poncokusumo"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-[#720C10]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      Kota/Kabupaten, Provinsi & Kode Pos
                    </label>
                    <input
                      type="text"
                      value={addressCity}
                      onChange={(e) => setAddressCity(e.target.value)}
                      placeholder="Kabupaten Malang, Jawa Timur 65157"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-[#720C10]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Tautan Google Maps</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-red-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={googleMapsUrl}
                      onChange={(e) => setGoogleMapsUrl(e.target.value)}
                      placeholder="https://maps.app.goo.gl/..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-[#720C10]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: LIVE PREVIEW WIDGET (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 sticky top-24 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                  Pratinjau Live Kontak
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Card Preview */}
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-4 text-xs font-mono">
                <div>
                  <p className="text-white font-serif text-lg">{brandName || "Origine Studio"}</p>
                  <p className="text-[11px] text-zinc-400 italic font-sans">{tagline}</p>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-2 text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#ff6169] shrink-0" />
                    <span>{phone || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#ff6169] shrink-0" />
                    <span className="truncate">{email || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{operatingHours || "-"}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-1">
                  <p className="text-[10px] text-zinc-500 uppercase">Alamat Studio:</p>
                  <p className="text-zinc-300 font-sans leading-relaxed text-[11px]">
                    {addressLine1}, {addressSubdistrict}, {addressCity}
                  </p>
                </div>

                {/* Test WhatsApp Link Button */}
                <div className="pt-3">
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=Halo%20${encodeURIComponent(brandName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 flex items-center justify-center gap-2 text-xs transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Uji Tautan WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {googleMapsUrl && (
                  <div>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 flex items-center justify-center gap-2 text-xs transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      <span>Buka Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-[#720C10] hover:bg-[#8B0000] text-white text-xs font-mono uppercase tracking-wider transition-all shadow-lg hover:shadow-[#720C10]/30 cursor-pointer disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan Pengaturan Sekarang"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
