"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Edit3,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { StudioRoomPricing, StudioAddon } from "@/lib/types";

export default function PricingManagementPage() {
  const [rooms, setRooms] = useState<StudioRoomPricing[]>([]);
  const [addons, setAddons] = useState<StudioAddon[]>([]);

  // Room Edit Modal
  const [editingRoom, setEditingRoom] = useState<StudioRoomPricing | null>(null);

  // Addon Modal (Add or Edit)
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<StudioAddon | null>(null);
  const [addonForm, setAddonForm] = useState({
    name: "",
    price: 0,
    category: "lighting",
    desc: "",
    isActive: true,
  });

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPricing();
  }, []);

  async function fetchPricing() {
    try {
      const res = await fetch("/api/pricing");
      const data = await res.json();
      if (data.success) {
        setRooms(data.rooms || []);
        setAddons(data.addons || []);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Save Room changes
  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "room", item: editingRoom }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.error || "Gagal memperbarui tarif studio." });
      } else {
        setFeedback({ type: "success", message: data.message });
        setTimeout(() => {
          setEditingRoom(null);
          fetchPricing();
        }, 1000);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setFeedback({ type: "error", message });
    } finally {
      setSaving(false);
    }
  };

  // Open Add Addon
  const openNewAddon = () => {
    setEditingAddon(null);
    setAddonForm({
      name: "",
      price: 250000,
      category: "lighting",
      desc: "",
      isActive: true,
    });
    setFeedback(null);
    setIsAddonModalOpen(true);
  };

  // Open Edit Addon
  const openEditAddon = (item: StudioAddon) => {
    setEditingAddon(item);
    setAddonForm({
      name: item.name,
      price: item.price,
      category: item.category,
      desc: item.desc,
      isActive: item.isActive,
    });
    setFeedback(null);
    setIsAddonModalOpen(true);
  };

  // Save or Update Addon
  const handleSaveAddon = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const isEdit = Boolean(editingAddon);
      const url = "/api/pricing";
      const method = isEdit ? "PUT" : "POST";
      const body = isEdit
        ? { type: "addon", item: { ...editingAddon, ...addonForm } }
        : addonForm;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.error || "Gagal menyimpan addon." });
      } else {
        setFeedback({ type: "success", message: data.message });
        setTimeout(() => {
          setIsAddonModalOpen(false);
          fetchPricing();
        }, 1000);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setFeedback({ type: "error", message });
    } finally {
      setSaving(false);
    }
  };

  // Delete Addon
  const handleDeleteAddon = async (id: string, name: string) => {
    if (!confirm(`Hapus layanan "${name}"?`)) return;

    try {
      const res = await fetch(`/api/pricing?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchPricing();
      } else {
        alert(data.error);
      }
    } catch {
      alert("Gagal menghapus layanan.");
    }
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="pb-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#ff6169] font-bold">
              MODUL KEUANGAN & TARIF
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-[10px] font-mono text-zinc-400">RUANG & PERALATAN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-white font-medium">
            Kelola Harga & Tarif Studio
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-light max-w-2xl leading-relaxed">
            Owner & Admin memiliki hak akses penuh untuk mengubah tarif paket ruang studio dan layanan peralatan tambahan dalam mata uang Rupiah (IDR).
          </p>
        </div>

        <Link
          href="/admin/packages"
          className="px-4 py-2.5 rounded-xl bg-[#720C10] hover:bg-[#8e0e14] text-white text-xs font-mono font-semibold transition-all flex items-center gap-2 shadow-lg shadow-[#720C10]/30 shrink-0 self-start sm:self-auto"
        >
          <Clock className="w-4 h-4" />
          <span>Kelola Paket Booking Online</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 1. ROOM PRICING SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif text-white font-medium">Tarif Sewa Ruang Studio</h2>
            <p className="text-xs text-zinc-400 font-light">
              Paket sewa Studio 01, 02, dan 03 di Jl. Raya Belung, Malang.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="p-6 rounded-2xl bg-[#121212] border border-white/10 shadow-2xl flex flex-col justify-between relative overflow-hidden group hover:border-[#720C10] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#ff6169] font-bold">
                    {room.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingRoom(room);
                      setFeedback(null);
                    }}
                    className="p-1.5 rounded-lg border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-mono"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Tarif</span>
                  </button>
                </div>

                <h3 className="text-base font-serif font-medium text-white">{room.name}</h3>
                <p className="text-[11px] font-mono text-zinc-500 mt-1">{room.dimensions}</p>
                <p className="text-xs text-zinc-400 font-light mt-3 leading-relaxed">
                  {room.description}
                </p>

                <div className="my-5 p-4 rounded-xl bg-black/40 border border-white/5 space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Sesi Half Day (4 Jam):</span>
                    <span className="font-bold text-white">{formatRupiah(room.halfDayPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Sesi Full Day (8 Jam):</span>
                    <span className="font-bold text-emerald-400">
                      {formatRupiah(room.fullDayPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-500 pt-2 border-t border-white/5 text-[11px]">
                    <span>Tarif Lembur per Jam:</span>
                    <span>{formatRupiah(room.hourlyRate)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-mono uppercase text-zinc-500 mb-1.5">Fitur Unggulan:</p>
                <ul className="text-[11px] font-light text-zinc-400 space-y-1">
                  {room.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#ff6169]">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. ADD-ON SERVICES PRICING SECTION */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-serif text-white font-medium">
              Layanan Tambahan & Sewa Alat (Add-on)
            </h2>
            <p className="text-xs text-zinc-400 font-light">
              Peralatan Broncolor, Medium Format Phase One, MUA Lounge, dan Kru.
            </p>
          </div>

          <button
            type="button"
            onClick={openNewAddon}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Layanan Add-on</span>
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121212] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 font-semibold">Nama Layanan Add-on</th>
                  <th className="py-3.5 px-4 font-semibold">Kategori</th>
                  <th className="py-3.5 px-4 font-semibold">Tarif Sewa (IDR)</th>
                  <th className="py-3.5 px-4 font-semibold">Deskripsi</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {addons.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-medium text-white">{item.name}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-white/5 border border-white/10 text-zinc-300">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-400">
                      {formatRupiah(item.price)}
                    </td>
                    <td className="py-4 px-4 text-zinc-400 font-light max-w-xs truncate">
                      {item.desc}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                          item.isActive
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {item.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditAddon(item)}
                          className="p-1.5 rounded-lg border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddon(item.id, item.name)}
                          className="p-1.5 rounded-lg border border-red-500/20 hover:border-red-500/50 text-red-400 hover:text-red-200"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL: EDIT ROOM PRICING */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className="max-w-md w-full bg-[#141414] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div>
                <h3 className="text-lg font-serif text-white font-medium">
                  Ubah Tarif {editingRoom.name}
                </h3>
                <p className="text-xs text-zinc-400 font-light mt-0.5">
                  Kode: {editingRoom.code}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingRoom(null)}
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

            <form onSubmit={handleSaveRoom} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Tarif Sesi Half Day (4 Jam) dalam Rupiah *
                </label>
                <input
                  type="number"
                  value={editingRoom.halfDayPrice}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, halfDayPrice: Number(e.target.value) })
                  }
                  required
                  step="50000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                />
                <p className="text-[11px] text-zinc-500 mt-1 font-mono">
                  Terformat: {formatRupiah(editingRoom.halfDayPrice)}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Tarif Sesi Full Day (8 Jam) dalam Rupiah *
                </label>
                <input
                  type="number"
                  value={editingRoom.fullDayPrice}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, fullDayPrice: Number(e.target.value) })
                  }
                  required
                  step="50000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                />
                <p className="text-[11px] text-zinc-500 mt-1 font-mono">
                  Terformat: {formatRupiah(editingRoom.fullDayPrice)}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Tarif Overtime per Jam
                </label>
                <input
                  type="number"
                  value={editingRoom.hourlyRate}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, hourlyRate: Number(e.target.value) })
                  }
                  step="25000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="px-4 py-2.5 rounded-full border border-white/10 text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider"
                >
                  {saving ? "Menyimpan..." : "Simpan Tarif Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT ADD-ON */}
      {isAddonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className="max-w-md w-full bg-[#141414] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div>
                <h3 className="text-lg font-serif text-white font-medium">
                  {editingAddon ? `Edit Layanan: ${editingAddon.name}` : "Tambah Layanan Add-on Baru"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddonModalOpen(false)}
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

            <form onSubmit={handleSaveAddon} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Nama Alat / Layanan *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Broncolor Para 220"
                  value={addonForm.name}
                  onChange={(e) => setAddonForm({ ...addonForm, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Kategori
                </label>
                <select
                  value={addonForm.category}
                  onChange={(e) => setAddonForm({ ...addonForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                >
                  <option value="lighting">Lighting / Pencahayaan</option>
                  <option value="camera">Kamera & Lensa</option>
                  <option value="crew">Kru & Operator Teknis</option>
                  <option value="space">Fasilitas Ruang / MUA</option>
                  <option value="service">Layanan Cetak / Cuci Film</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Tarif Sewa (Rupiah IDR) *
                </label>
                <input
                  type="number"
                  value={addonForm.price}
                  onChange={(e) => setAddonForm({ ...addonForm, price: Number(e.target.value) })}
                  required
                  step="25000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                />
                <p className="text-[11px] text-zinc-500 mt-1 font-mono">
                  Terformat: {formatRupiah(addonForm.price)}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Deskripsi Singkat
                </label>
                <input
                  type="text"
                  placeholder="Keterangan spesifikasi alat"
                  value={addonForm.desc}
                  onChange={(e) => setAddonForm({ ...addonForm, desc: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddonModalOpen(false)}
                  className="px-4 py-2.5 rounded-full border border-white/10 text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider"
                >
                  {saving ? "Menyimpan..." : "Simpan Layanan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
