"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OrigineLogo from "@/components/OrigineLogo";
import {
  ArrowLeft,
  Lock,
  Mail,
  User,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  CreditCard,
  GraduationCap,
  Crown,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"staff" | "email">("staff");
  
  // Staff fields
  const [username, setUsername] = useState("");
  const [passcode, setPasscode] = useState("");

  // Email fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload =
        tab === "staff"
          ? { mode: "staff", username, passcode }
          : { mode: "email", email, password };

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Autentikasi gagal. Silakan coba kembali.");
      } else {
        setSuccessMsg(`Selamat datang, ${data.user.name}! Mengalihkan...`);
        setTimeout(() => {
          router.push(data.redirectUrl || "/admin");
          router.refresh();
        }, 800);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kendala jaringan.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const applyDemo = (u: string, p: string, type: "staff" | "email") => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setTab(type);
    if (type === "staff") {
      setUsername(u);
      setPasscode(p);
    } else {
      setEmail(u);
      setPassword(p);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#F9F8F6] flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#720C10]/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 film-grain opacity-20 pointer-events-none" />

      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between relative z-10 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Studio</span>
        </Link>
        <span className="text-[10px] font-mono tracking-widest text-[#e03a42] uppercase font-bold">
          PORTAL RESMI ORIGINE STUDIO
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto relative z-10 my-auto py-6">
        <div className="glass-panel p-6 sm:p-9 rounded-2xl border border-white/10 shadow-2xl relative bg-[#121212]/80 backdrop-blur-xl">
          {/* Logo & Headline */}
          <div className="text-center mb-6">
            <div className="inline-block text-3xl mb-2">
              <OrigineLogo />
            </div>
            <h1 className="text-xl sm:text-2xl font-serif text-white font-medium">
              Portal Akses Studio
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-light">
              Masuk untuk mengelola reservasi, harga, user staf, atau galeri studio.
            </p>
          </div>

          {/* Dual Mode Tab Selector */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-white/[0.04] border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => {
                setTab("staff");
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                tab === "staff"
                  ? "bg-[#720C10] text-white shadow-lg font-semibold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Akses Staf</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("email");
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                tab === "email"
                  ? "bg-[#720C10] text-white shadow-lg font-semibold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email & Sandi</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {tab === "staff" ? (
              <>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Username Staf (Kasir / Magang / Admin / Owner)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Contoh: kasir_belung / magang_visual"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-[#720C10] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Kode Akses / Passcode
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="Masukkan kode akses Anda"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-[#720C10] transition-colors"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="nama@originestudio.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-[#720C10] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-[#720C10] transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[#720C10]/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2"
            >
              {loading ? "Memverifikasi..." : tab === "staff" ? "Masuk dengan Kode Akses" : "Masuk ke Dashboard"}
            </button>
          </form>

          {/* Link to Register */}
          <div className="mt-4 pt-3 border-t border-white/5 text-center">
            <p className="text-xs text-zinc-400 font-light">
              Belum memiliki akun produser?{" "}
              <Link
                href="/auth/register"
                className="text-[#ff6169] hover:text-[#ff8a90] underline underline-offset-4 font-mono font-medium transition-colors"
              >
                Daftar Akun Baru
              </Link>
            </p>
          </div>

          {/* Quick Demo Credentials Bar for Testing the 5 Roles */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-zinc-400 mb-2.5">
              <Sparkles className="w-3 h-3 text-[#ff6169]" />
              <span>Akses Cepat Pengujian (5 Role):</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => applyDemo("owner_ratna", "orig8899", "staff")}
                className="p-1.5 rounded-lg border border-amber-500/30 bg-amber-950/20 hover:bg-amber-900/40 text-amber-200 text-left transition-colors flex items-center gap-1.5"
              >
                <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">1. Owner (Ratna)</span>
              </button>

              <button
                type="button"
                onClick={() => applyDemo("admin_studio", "admin123", "staff")}
                className="p-1.5 rounded-lg border border-purple-500/30 bg-purple-950/20 hover:bg-purple-900/40 text-purple-200 text-left transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3 h-3 text-purple-400 shrink-0" />
                <span className="truncate">2. Admin (Aditya)</span>
              </button>

              <button
                type="button"
                onClick={() => applyDemo("kasir_belung", "kasir77", "staff")}
                className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-900/40 text-emerald-200 text-left transition-colors flex items-center gap-1.5"
              >
                <CreditCard className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">3. Kasir (Siti)</span>
              </button>

              <button
                type="button"
                onClick={() => applyDemo("magang_visual", "magang2026", "staff")}
                className="p-1.5 rounded-lg border border-sky-500/30 bg-sky-950/20 hover:bg-sky-900/40 text-sky-200 text-left transition-colors flex items-center gap-1.5"
              >
                <GraduationCap className="w-3 h-3 text-sky-400 shrink-0" />
                <span className="truncate">4. Magang (Bima)</span>
              </button>

              <button
                type="button"
                onClick={() => applyDemo("klien_clarissa", "klien123", "staff")}
                className="col-span-2 p-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-zinc-300 text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <User className="w-3 h-3 text-zinc-400" />
                <span>5. User / Klien (Clarissa)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center text-[11px] font-mono text-zinc-500 relative z-10 pb-2">
        <span>Origine Studio • Jl. Raya Belung, Poncokusumo, Malang</span>
      </div>
    </div>
  );
}
