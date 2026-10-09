"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OrigineLogo from "@/components/OrigineLogo";
import { createClient } from "@/lib/supabase-client";
import { ArrowLeft, Lock, Mail, User, Building, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [agency, setAgency] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            agency: agency,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg(
          "Producer account registered. Please check your email for the confirmation link or sign in directly."
        );
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#F9F8F6] flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#720C10]/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 film-grain opacity-25 pointer-events-none" />

      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Studio</span>
        </Link>
        <span className="text-[10px] font-mono tracking-widest text-[#e03a42] uppercase">
          CLIENT ATELIER ENROLLMENT
        </span>
      </div>

      {/* Main Register Card */}
      <div className="max-w-md w-full mx-auto relative z-10 my-auto py-8">
        <div className="glass-panel p-8 sm:p-10 rounded-2xl border border-white/10 shadow-2xl relative">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-block text-3xl mb-3">
              <OrigineLogo />
            </div>
            <h1 className="text-2xl font-serif text-white font-medium">Create Producer Account</h1>
            <p className="text-xs text-zinc-400 mt-1 font-light">
              Register to streamline bookings, manage call sheets, and hold studio dates.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-3.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Vivienne Westwood Production"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:border-[#720C10] outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1.5">
                Agency / Production House
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  placeholder="e.g. Art Partner / Vogue Creative"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:border-[#720C10] outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="producer@agency.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1.5">
                Secure Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none transition-colors"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-3 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-xl shadow-[#720C10]/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Create Atelier Account"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-zinc-400 font-light">
              Already have an atelier account?{" "}
              <Link
                href="/auth/login"
                className="text-[#ff6169] hover:text-white font-medium transition-colors"
              >
                Sign In Instead
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="max-w-md w-full mx-auto text-center text-[10px] font-mono text-zinc-600 relative z-10">
        ORIGINE ATELIER AUTH PROTOCOL • END-TO-END ENCRYPTED
      </div>
    </div>
  );
}
