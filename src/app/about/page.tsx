"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import OrigineLogo from "@/components/OrigineLogo";
import { StudioAboutContent, TeamMember, CoreValue } from "@/lib/types";
import {
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  MapPin,
  HeartHandshake,
  Compass,
  Award,
  Users,
  Camera,
  Layers,
  Clock,
  CheckCircle,
} from "lucide-react";

const defaultTeamMembers: TeamMember[] = [
  {
    id: "team-01",
    name: "Ratna Kusuma",
    role: "Founder & Creative Director",
    bio: "Berpengalaman lebih dari 8 tahun dalam fotografi mode editorial dan potret seni rupa. Ratna mendirikan Origine Studio untuk membawa standar visual internasional haute couture ke lanskap budaya Malang yang memesona.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    gear: "Leica SL2-S • Hasselblad 907X",
  },
  {
    id: "team-02",
    name: "Aditya Pratama",
    role: "Lead Photographer & Lighting Master",
    bio: "Spesialis dalam tata cahaya chiaroscuro kontras tinggi dan sains warna digital. Aditya memastikan setiap kilatan strobo dan pantulan reflektor menangkap dimensi terbaik setiap subjek.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    gear: "Phase One IQ4 • Broncolor Scoro Rig",
  },
  {
    id: "team-03",
    name: "Dinda Maharani",
    role: "Art Stylist & Post-Production Lead",
    bio: "Menjaga keaslian tekstur kulit organik dan gradasi nada warna film abadi dalam setiap berkas arsip master resolusi tinggi yang diserahkan kepada klien.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
    gear: "Eizo ColorEdge 4K • Capture One Studio",
  },
];

const defaultCoreValues: CoreValue[] = [
  {
    id: "val-01",
    title: "Keaslian Tanpa Rekayasa Berlebih",
    desc: "Kami percaya potret terindah lahir dari emosi yang jujur. Kami menolak teknik filter sintetis murahan yang mengaburkan kepribadian sejati Anda.",
  },
  {
    id: "val-02",
    title: "Presisi Cahaya Standar Dunia",
    desc: "Mengombinasikan kehangatan cahaya matahari alami dengan generator pencahayaan Broncolor dan Profoto berstandar editorial Paris dan Milan.",
  },
  {
    id: "val-03",
    title: "Privasi Eksklusif Tanpa Gangguan",
    desc: "Setiap sesi pemotretan berlangsung tertutup. Tidak ada penonton luar, tidak ada antrean berdesakan—hanya Anda, kru, dan karya seni yang sedang diciptakan.",
  },
  {
    id: "val-04",
    title: "Kenyamanan Keramahan Malang",
    desc: "Suasana sejuk di Jl. Raya Belung, Poncokusumo dengan sajian kopi artisanal lokal menyambut Anda bagaikan ruang tamu sahabat dekat.",
  },
];

export default function AboutPage() {
  const [heroTitle, setHeroTitle] = useState("Kisah di Balik Origine Studio.");
  const [heroSubtitle, setHeroSubtitle] = useState(
    "Berawal dari sebuah gagasan sederhana: menciptakan ruang visual di mana waktu seolah melambat, membiarkan cahaya membentuk memori abadi yang tidak pernah lekang oleh pergantian zaman."
  );
  const [storyParagraph1, setStoryParagraph1] = useState(
    "Origine Studio didirikan di kawasan sejuk Jl. Raya Belung, Poncokusumo, Kabupaten Malang. Kami sengaja memilih lokasi yang jauh dari kebisingan dan polusi metropolitan agar setiap proses pemotretan menjadi ritual kontemplatif yang menenangkan."
  );
  const [storyParagraph2, setStoryParagraph2] = useState(
    "Di sini, hembusan angin perbukitan berpadu dengan arsitektur cyclorama lengkung tanpa sudut, jendela utara berpenerangan alami, dan set studio gelap total. Baik Anda datang untuk potret wisuda pribadi yang membanggakan, kehangatan potret keluarga, maupun lookbook brand mode ternama, kami menjamin pengalaman yang personal dan berkesan."
  );
  const [ethosQuote, setEthosQuote] = useState(
    "Kembali ke titik mula keaslian rasa dan emosi manusia—murni, anggun, dan tanpa kepura-puraan."
  );
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(defaultTeamMembers);
  const [coreValues, setCoreValues] = useState<CoreValue[]>(defaultCoreValues);

  useEffect(() => {
    async function loadAbout() {
      try {
        const res = await fetch("/api/about");
        const data = await res.json();
        if (data.success && data.about) {
          const ab: StudioAboutContent = data.about;
          if (ab.heroTitle) setHeroTitle(ab.heroTitle);
          if (ab.heroSubtitle) setHeroSubtitle(ab.heroSubtitle);
          if (ab.storyParagraph1) setStoryParagraph1(ab.storyParagraph1);
          if (ab.storyParagraph2) setStoryParagraph2(ab.storyParagraph2);
          if (ab.ethosQuote) setEthosQuote(ab.ethosQuote);
          if (Array.isArray(ab.team) && ab.team.length > 0) setTeamMembers(ab.team);
          if (Array.isArray(ab.values) && ab.values.length > 0) setCoreValues(ab.values);
        }
      } catch (e) {
        console.error("Gagal memuat profil studio:", e);
      }
    }
    loadAbout();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#F9F8F6] selection:bg-[#720C10] selection:text-white">
      {/* 1. UNIFIED PREMIUM NAVBAR */}
      <Navbar />

      {/* 2. HERO PAGE BANNER */}
      <section className="pt-28 sm:pt-32 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Breadcrumb back link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-zinc-400 hover:text-white transition-colors py-1 px-3 rounded-full bg-white/[0.03] border border-white/10 hover:border-white/20 w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono tracking-[0.25em] uppercase text-[#ff6169] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#720C10]" />
            TENTANG KAMI • ORIGINE STUDIO
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white font-light tracking-tight leading-[1.1]">
            {heroTitle.includes("Origine Studio") ? (
              <>
                {heroTitle.split("Origine Studio")[0]} <br />
                <span className="italic font-serif-italic font-normal">Origine Studio</span>
                {heroTitle.split("Origine Studio")[1] || "."}
              </>
            ) : (
              heroTitle
            )}
          </h1>
          <p className="mt-6 text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* 3. NARRATIVE STORY: MENGAPA MALANG & FILOSOFI ORIGINE */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/5] bg-zinc-950 shadow-2xl">
              <Image
                src="/images/hero-fashion.jpg"
                alt="Filosofi Origine Studio"
                fill
                className="object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                <p className="text-xs font-mono text-[#ff6169] uppercase tracking-wider">
                  Etos Kreatif Origine Studio
                </p>
                <p className="text-sm font-serif italic text-white mt-1">
                  &ldquo;{ethosQuote}&rdquo;
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-[#720C10] font-bold block">
              FILOSOFI & SUAKA VISUAL KAMI
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white font-light tracking-tight leading-snug">
              Mengapa Kami Memilih <br />
              <span className="italic font-serif-italic font-normal">Kesejukan Poncokusumo, Malang</span>
            </h2>

            <p className="text-zinc-300 font-light leading-relaxed text-sm sm:text-base">
              {storyParagraph1}
            </p>

            <p className="text-zinc-400 font-light leading-relaxed text-sm sm:text-base">
              {storyParagraph2}
            </p>

            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-6 font-mono text-center sm:text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white font-syne">100%</p>
                <p className="text-[11px] uppercase tracking-wider text-zinc-500 mt-1">Privat Eksklusif</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white font-syne">430 m²</p>
                <p className="text-[11px] uppercase tracking-wider text-zinc-500 mt-1">Total Fasilitas</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#e03a42] font-syne">500+</p>
                <p className="text-[11px] uppercase tracking-wider text-zinc-500 mt-1">Karya Abadi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOUR CORE VALUES */}
      <section className="py-20 px-4 sm:px-8 border-t border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#ff6169] block mb-2">
              PRINSIP DASAR
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white font-light">
              Pilar & Nilai Utama Studio
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light mt-3">
              Dedikasi teguh yang membedakan setiap karya yang lahir dari Origine Studio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreValues.map((val, idx) => {
              const icons = [HeartHandshake, Camera, Award, Compass, Sparkles];
              const Icon = icons[idx % icons.length];
              return (
                <div
                  key={val.id || idx}
                  className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all flex gap-5"
                >
                  <div className="w-12 h-12 rounded-full bg-[#720C10]/20 text-[#ff6169] flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif text-white font-medium mb-2">
                      {val.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. TEAM STUDIO ROSTER */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#ff6169] block mb-2">
            TIM KREATIF
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-white font-light">
            Seniman di Balik Setiap Bidikan
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-3">
            Para profesional yang menguasai seni cahaya, komposisi sinematik, dan sentuhan tata visual halus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="rounded-2xl overflow-hidden bg-zinc-900/60 border border-white/10 hover:border-white/20 transition-all flex flex-col"
            >
              <div className="relative aspect-[3/4] w-full bg-zinc-950">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-lg font-serif text-white font-medium">{member.name}</p>
                  <p className="text-xs font-mono text-[#ff6169] uppercase tracking-wider">{member.role}</p>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-zinc-300 font-light leading-relaxed">
                  {member.bio}
                </p>
                <div className="pt-4 border-t border-white/10 text-[11px] font-mono text-zinc-500">
                  <span className="block text-zinc-400 uppercase tracking-wider">Perangkat Andalan:</span>
                  <span className="text-zinc-200">{member.gear}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. LOCATION & VISIT MAP */}
      <section className="py-20 px-4 sm:px-8 border-t border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono tracking-[0.25em] uppercase text-[#ff6169] font-bold block">
                LOKASI & AKSES
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-white font-light">
                Kunjungi Suaka Kami di Malang
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                Kami siap menyambut Anda untuk sesi konsultasi tatap muka, diskusi lookbook, maupun survei ruang studio sebelum hari pemotretan.
              </p>

              <div className="space-y-4 text-xs font-mono text-zinc-300 pt-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#e03a42] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Origine Studio Malang</strong>
                    <span>Jl. Raya Belung, Belung, Kec. Poncokusumo, Kabupaten Malang, Jawa Timur 65157</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Jam Operasional</strong>
                    <span>Senin – Minggu: 08.00 – 21.00 WIB (Hanya melalui reservasi)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="https://maps.app.goo.gl/XUjKjMeSeEBewEgq6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-mono uppercase tracking-wider transition-all"
                >
                  <span>Buka di Google Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-white/10 relative h-[360px] bg-zinc-950">
              <iframe
                title="Peta Lokasi Origine Studio"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15802.934898492062!2d112.7533866!3d-8.0319588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd63be486221c4b%3A0xea8964e7dfcbb0be!2sBelung%2C%20Poncokusumo%2C%20Malang%20Regency%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1718000000000!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(90%)" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA BANNER */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-[#181818] to-[#101010] border border-white/15 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-serif text-white font-light tracking-tight">
              Mari Abadikan <span className="italic font-serif-italic font-normal">Kisah Anda</span>
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
              Jadikan momen istimewa Anda abadi dalam karya visual berseni tinggi. Kami siap mendengarkan konsep dan visi Anda.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/booking"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-xl shadow-[#720C10]/40 hover:scale-105"
              >
                Reservasi Sesi Sekarang
              </Link>
              <Link
                href="/portfolio"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-white/20 hover:border-white/40 text-white text-xs font-mono uppercase tracking-wider transition-all"
              >
                Lihat Galeri Portofolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. EDITORIAL FOOTER */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-8 text-center text-xs font-mono text-zinc-500">
        <p>Origine Studio • Jl. Raya Belung, Belung, Kec. Poncokusumo, Kabupaten Malang, Jawa Timur 65157</p>
        <p className="mt-2 text-[10px] text-zinc-600">Hak Cipta © 2026 Origine Studio Malang. Semua hak dilindungi.</p>
      </footer>
    </div>
  );
}
