"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Clock,
  Users,
  Calendar,
  ArrowRight,
  ArrowDown,
  Sparkles,
  Camera,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  QrCode,
  Copy,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  User,
  Info,
  DollarSign,
  Layers,
  MapPin,
  RotateCcw,
  Banknote,
} from "lucide-react";
import {
  StudioBooking,
  StaffSession,
  BookingExperiencePackage,
  DurationOption,
  PersonOption,
  StudioAddon,
} from "@/lib/types";

export const BOOKING_PACKAGES: BookingExperiencePackage[] = [
  {
    "id": "pkg-self-studio",
    "name": "Self Studio Experience",
    "category": "self-studio",
    "badge": "Paling Populer • Self-Service",
    "badgeColor": "bg-[#720C10] text-white border-[#720C10]/40",
    "image": "https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&w=1200&auto=format&fit=crop",
    "basePriceTag": "Mulai Rp 20.000 / sesi",
    "description": "Sesi foto mandiri tanpa fotografer menggunakan kontrol wireless clicker di tangan, bebas berekspresi bersama teman, pasangan, atau keluarga.",
    "durationOptions": [
      {
        "id": "self-basic",
        "label": "Basic (5 Menit) - Rp 20.000",
        "minutes": 5,
        "price": 20000
      },
      {
        "id": "self-classic",
        "label": "Classic (10 Menit) - Rp 35.000",
        "minutes": 10,
        "price": 35000,
        "isPopular": true
      },
      {
        "id": "self-standart",
        "label": "Standart (15 Menit) - Rp 50.000",
        "minutes": 15,
        "price": 50000
      },
      {
        "id": "self-premium",
        "label": "Premium (20 Menit) - Rp 80.000",
        "minutes": 20,
        "price": 80000
      },
      {
        "id": "self-platinum",
        "label": "Platinum (30 Menit) - Rp 100.000",
        "minutes": 30,
        "price": 100000
      },
      {
        "id": "self-diamond",
        "label": "Diamond (40 Menit) - Rp 120.000",
        "minutes": 40,
        "price": 120000
      }
    ],
    "personOptions": [
      {
        "count": 6,
        "label": "1 - 6 Orang (Termasuk dalam Paket)",
        "extraPrice": 0
      },
      {
        "count": 7,
        "label": "+1 Orang Tambahan (+Rp 10.000)",
        "extraPrice": 10000
      },
      {
        "count": 8,
        "label": "+2 Orang Tambahan (+Rp 20.000)",
        "extraPrice": 20000
      },
      {
        "count": 9,
        "label": "+3 Orang Tambahan (+Rp 30.000)",
        "extraPrice": 30000
      },
      {
        "count": 10,
        "label": "+4 Orang Tambahan (+Rp 40.000)",
        "extraPrice": 40000
      }
    ],
    "features": [
      "Kapasitas 1 - 6 Orang",
      "5 - 40 Menit Photo Session",
      "1 Background & Fun Properti Lengkap",
      "Include Cetak Polaroid (Classic ke atas)",
      "All File Share in Google Drive"
    ],
    "isActive": true
  },
  {
    "id": "pkg-pas-photo",
    "name": "Pas Photo Resmi & Dokumen",
    "category": "pas-photo",
    "badge": "Cepat & Presisi",
    "badgeColor": "bg-sky-500/20 text-sky-300 border-sky-500/30",
    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
    "basePriceTag": "Mulai Rp 40.000",
    "description": "Foto identitas resmi untuk visa, paspor, ijazah, dokumen negara, atau CV lamaran kerja dengan lighting studio optimal.",
    "durationOptions": [
      {
        "id": "pas-40k",
        "label": "Paket Setengah Body (5 Mnt) - Rp 40.000",
        "minutes": 5,
        "price": 40000
      },
      {
        "id": "pas-50k",
        "label": "Paket Setengah & Full Body (5 Mnt) - Rp 50.000",
        "minutes": 5,
        "price": 50000,
        "isPopular": true
      },
      {
        "id": "pas-70k",
        "label": "Paket Setengah, Full & Pose Bebas (5 Mnt) - Rp 70.000",
        "minutes": 5,
        "price": 70000
      }
    ],
    "personOptions": [
      {
        "count": 1,
        "label": "1 Orang (Personal Pas Photo)",
        "extraPrice": 0
      },
      {
        "count": 2,
        "label": "2 Orang (+Rp 40.000)",
        "extraPrice": 40000
      }
    ],
    "features": [
      "5 Menit Photo Session",
      "Setengah Body / Full Body / Pose Bebas",
      "Edit Warna Background (Bisa Request Merah/Biru/Putih/Custom)",
      "Cetak 4R (Bisa Request Ukuran 2x3, 3x4, 4x6)",
      "All File Share in Google Drive"
    ],
    "isActive": true
  },
  {
    "id": "pkg-personal",
    "name": "Personal Portraiture",
    "category": "personal",
    "badge": "Editorial Solo",
    "badgeColor": "bg-purple-500/20 text-purple-300 border-purple-500/30",
    "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
    "basePriceTag": "Mulai Rp 200.000",
    "description": "Sesi foto personal editorial untuk portofolio modeling, profil profesional, personal branding, atau sesi self-love.",
    "durationOptions": [
      {
        "id": "personal-basic",
        "label": "Basic (Max 30 Menit) - Rp 200.000",
        "minutes": 30,
        "price": 200000
      },
      {
        "id": "personal-premium",
        "label": "Premium (Max 60 Menit) - Rp 350.000",
        "minutes": 60,
        "price": 350000,
        "isPopular": true
      }
    ],
    "personOptions": [
      {
        "count": 1,
        "label": "1 Orang (Termasuk dalam Paket)",
        "extraPrice": 0
      },
      {
        "count": 2,
        "label": "+1 Orang Tambahan (+Rp 10.000)",
        "extraPrice": 10000
      }
    ],
    "features": [
      "1 Orang Sesi Eksklusif",
      "Durasi Max 30 - 60 Menit",
      "Unlimited Photo Raw",
      "10 Foto Editing Pilihan",
      "Include Cetak 1x 10Rs + Frame (Paket Premium)",
      "All File Share in Google Drive"
    ],
    "isActive": true
  },
  {
    "id": "pkg-maternity",
    "name": "Maternity Photography",
    "category": "maternity",
    "badge": "Momen Kehamilan Indah",
    "badgeColor": "bg-rose-500/20 text-rose-300 border-rose-500/30",
    "image": "https://images.unsplash.com/photo-1544126592-807ade215a0b?q=80&w=1200&auto=format&fit=crop",
    "basePriceTag": "Mulai Rp 250.000",
    "description": "Abadikan masa kehamilan yang hangat, anggun, dan penuh kasih sayang bersama pasangan dengan penataan cahaya lembut.",
    "durationOptions": [
      {
        "id": "maternity-basic",
        "label": "Basic (Max 30 Menit) - Rp 250.000",
        "minutes": 30,
        "price": 250000
      },
      {
        "id": "maternity-premium",
        "label": "Premium (Max 60 Menit) - Rp 400.000",
        "minutes": 60,
        "price": 400000,
        "isPopular": true
      }
    ],
    "personOptions": [
      {
        "count": 3,
        "label": "Hingga 3 Orang (Ibu, Pasangan & Anak)",
        "extraPrice": 0
      },
      {
        "count": 4,
        "label": "+1 Anggota Keluarga (+Rp 10.000)",
        "extraPrice": 10000
      }
    ],
    "features": [
      "Kapasitas 3 Orang",
      "Durasi Max 30 - 60 Menit",
      "Unlimited Photo Raw",
      "20 - 30 Editing Photo",
      "Include Cetak 1x 10Rs + Frame (Paket Premium)",
      "All File Share in Google Drive"
    ],
    "isActive": true
  },
  {
    "id": "pkg-group-indoor",
    "name": "Group Indoor Studio",
    "category": "group",
    "badge": "Kebersamaan Sahabat",
    "badgeColor": "bg-amber-500/20 text-amber-300 border-amber-500/30",
    "image": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop",
    "basePriceTag": "Mulai Rp 250.000",
    "description": "Foto grup sahabat, teman tongkrongan, rekan kerja, atau organisasi di studio indoor ber-AC dengan properti lengkap.",
    "durationOptions": [
      {
        "id": "group-in-basic",
        "label": "Basic (Max 30 Menit) - Rp 250.000",
        "minutes": 30,
        "price": 250000
      },
      {
        "id": "group-in-premium",
        "label": "Premium (Max 60 Menit) - Rp 400.000",
        "minutes": 60,
        "price": 400000,
        "isPopular": true
      }
    ],
    "personOptions": [
      {
        "count": 8,
        "label": "1 - 8 Orang (Termasuk dalam Paket)",
        "extraPrice": 0
      },
      {
        "count": 9,
        "label": "+1 Orang Tambahan (+Rp 10.000)",
        "extraPrice": 10000
      },
      {
        "count": 10,
        "label": "+2 Orang Tambahan (+Rp 20.000)",
        "extraPrice": 20000
      },
      {
        "count": 12,
        "label": "+4 Orang Tambahan (+Rp 40.000)",
        "extraPrice": 40000
      },
      {
        "count": 15,
        "label": "+7 Orang Tambahan (+Rp 70.000)",
        "extraPrice": 70000
      }
    ],
    "features": [
      "Kapasitas 8 Orang per sesi",
      "Durasi Max 30 - 60 Menit",
      "Unlimited Photo Raw",
      "1 Background Pilihan",
      "20 - 30 Editing Photo",
      "Include Cetak 8x 4R (Paket Premium)",
      "All File Share in Google Drive"
    ],
    "isActive": true
  },
  {
    "id": "pkg-group-outdoor",
    "name": "Group Outdoor Photography",
    "category": "group",
    "badge": "Outdoor Exploration",
    "badgeColor": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    "image": "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop",
    "basePriceTag": "Mulai Rp 400.000",
    "description": "Sesi foto grup di lokasi outdoor pilihan, taman, kafe, atau ruang publik estetis dengan pencahayaan alami yang dinamis.",
    "durationOptions": [
      {
        "id": "group-out-basic",
        "label": "Basic (Max 1 Jam) - Rp 400.000",
        "minutes": 60,
        "price": 400000
      },
      {
        "id": "group-out-premium",
        "label": "Premium (Max 2 Jam) - Rp 700.000",
        "minutes": 120,
        "price": 700000,
        "isPopular": true
      }
    ],
    "personOptions": [
      {
        "count": 8,
        "label": "Grup Sahabat (Termasuk)",
        "extraPrice": 0
      },
      {
        "count": 12,
        "label": "Grup Rombongan (+Rp 50.000)",
        "extraPrice": 50000
      }
    ],
    "features": [
      "Lokasi Outdoor Pilihan",
      "Durasi Max 1 - 2 Jam",
      "Unlimited Photo Raw",
      "20 - 40 Editing Photo",
      "All File Share in Google Drive"
    ],
    "isActive": true
  },
  {
    "id": "pkg-family-indoor",
    "name": "Family Indoor Portrait",
    "category": "family",
    "badge": "Keluarga Lintas Generasi",
    "badgeColor": "bg-amber-500/20 text-amber-300 border-amber-500/30",
    "image": "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200&auto=format&fit=crop",
    "basePriceTag": "Mulai Rp 200.000",
    "description": "Potret keluarga penuh kehangatan di studio dengan tata letak latar belakang elegan, kursi klasik, dan arahan pose profesional.",
    "durationOptions": [
      {
        "id": "fam-in-astra",
        "label": "Astra (Max 15 Menit) - Rp 200.000",
        "minutes": 15,
        "price": 200000
      },
      {
        "id": "fam-in-clara",
        "label": "Clara (Max 30 Menit) - Rp 300.000",
        "minutes": 30,
        "price": 300000
      },
      {
        "id": "fam-in-novaria",
        "label": "Novaria (Max 45 Menit) - Rp 400.000",
        "minutes": 45,
        "price": 400000,
        "isPopular": true
      },
      {
        "id": "fam-in-luxuria",
        "label": "Luxuria (Max 60 Menit) - Rp 500.000",
        "minutes": 60,
        "price": 500000
      }
    ],
    "personOptions": [
      {
        "count": 6,
        "label": "Keluarga Inti (1 - 6 Orang)",
        "extraPrice": 0
      },
      {
        "count": 8,
        "label": "+2 Anggota Keluarga (+Rp 20.000)",
        "extraPrice": 20000
      },
      {
        "count": 12,
        "label": "+6 Anggota Keluarga (+Rp 60.000)",
        "extraPrice": 60000
      }
    ],
    "features": [
      "Durasi Max 15 - 60 Menit",
      "Unlimited Photo Raw",
      "1 Background Studio Pilihan",
      "5 - 30 Editing Photo",
      "Include Cetak 10Rs 1x + Frame (Novaria & Luxuria)",
      "All File Share in Google Drive"
    ],
    "isActive": true
  },
  {
    "id": "pkg-family-outdoor",
    "name": "Family Outdoor Session",
    "category": "family",
    "badge": "Kehangatan Alam Bebas",
    "badgeColor": "bg-orange-500/20 text-orange-300 border-orange-500/30",
    "image": "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200&auto=format&fit=crop",
    "basePriceTag": "Mulai Rp 450.000",
    "description": "Keceriaan keluarga di alam terbuka, taman pinus, atau lokasi favorit keluarga dengan pencahayaan golden hour alami.",
    "durationOptions": [
      {
        "id": "fam-out-basic",
        "label": "Basic (Max 1 Jam) - Rp 450.000",
        "minutes": 60,
        "price": 450000
      },
      {
        "id": "fam-out-premium",
        "label": "Premium (Max 2 Jam) - Rp 700.000",
        "minutes": 120,
        "price": 700000,
        "isPopular": true
      }
    ],
    "personOptions": [
      {
        "count": 6,
        "label": "Keluarga Inti (Termasuk)",
        "extraPrice": 0
      },
      {
        "count": 10,
        "label": "Keluarga Besar (+Rp 50.000)",
        "extraPrice": 50000
      }
    ],
    "features": [
      "Durasi Max 1 - 2 Jam",
      "Unlimited Photo Raw",
      "30 - 60 Editing Photo",
      "Nuansa Alam Alami & Spontan",
      "All File Share in Google Drive"
    ],
    "isActive": true
  },
  {
    "id": "pkg-birthday-indoor",
    "name": "Birthday Indoor Celebration",
    "category": "birthday",
    "badge": "Pesta & Sweet Moments",
    "badgeColor": "bg-pink-500/20 text-pink-300 border-pink-500/30",
    "image": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1200&auto=format&fit=crop",
    "basePriceTag": "Mulai Rp 200.000",
    "description": "Rayakan hari ulang tahun anak, sweet seventeen, atau sahabat dengan balon, kue ulang tahun, dan dekorasi studio meriah.",
    "durationOptions": [
      {
        "id": "bday-in-astra",
        "label": "Astra (Max 15 Menit) - Rp 200.000",
        "minutes": 15,
        "price": 200000
      },
      {
        "id": "bday-in-clara",
        "label": "Clara (Max 30 Menit) - Rp 300.000",
        "minutes": 30,
        "price": 300000
      },
      {
        "id": "bday-in-novaria",
        "label": "Novaria (Max 45 Menit) - Rp 400.000",
        "minutes": 45,
        "price": 400000,
        "isPopular": true
      },
      {
        "id": "bday-in-luxuria",
        "label": "Luxuria (Max 60 Menit) - Rp 500.000",
        "minutes": 60,
        "price": 500000
      }
    ],
    "personOptions": [
      {
        "count": 5,
        "label": "Bintang Ulang Tahun + Sahabat (1 - 5 Orang)",
        "extraPrice": 0
      },
      {
        "count": 8,
        "label": "+3 Teman Tambahan (+Rp 30.000)",
        "extraPrice": 30000
      }
    ],
    "features": [
      "Durasi Max 15 - 60 Menit",
      "Unlimited Photo Raw",
      "Bebas Bawa Kue & Properti Sendiri",
      "1 Background Studio",
      "5 - 30 Editing Photo",
      "Include Cetak 10Rs 1x + Frame (Novaria & Luxuria)",
      "All File Share in Google Drive"
    ],
    "isActive": true
  },
  {
    "id": "pkg-birthday-outdoor",
    "name": "Birthday Outdoor Story",
    "category": "birthday",
    "badge": "Garden & Cafe Party",
    "badgeColor": "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
    "image": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200&auto=format&fit=crop",
    "basePriceTag": "Mulai Rp 400.000",
    "description": "Dokumentasi ulang tahun di luar ruangan, cafe aesthetic, atau garden party dengan suasana santai penuh tawa.",
    "durationOptions": [
      {
        "id": "bday-out-basic",
        "label": "Basic (Max 1 Jam) - Rp 400.000",
        "minutes": 60,
        "price": 400000
      },
      {
        "id": "bday-out-premium",
        "label": "Premium (Max 2 Jam) - Rp 700.000",
        "minutes": 120,
        "price": 700000,
        "isPopular": true
      }
    ],
    "personOptions": [
      {
        "count": 6,
        "label": "Bintang Utama & Teman (Termasuk)",
        "extraPrice": 0
      },
      {
        "count": 12,
        "label": "Pesta Rombongan (+Rp 50.000)",
        "extraPrice": 50000
      }
    ],
    "features": [
      "Durasi Max 1 - 2 Jam",
      "Unlimited Photo Raw",
      "Dokumentasi Momen Spontan & Pesta",
      "20 - 40 Editing Photo",
      "All File Share in Google Drive"
    ],
    "isActive": true
  },
  {
    "id": "pkg-graduation-indoor",
    "name": "Graduation Indoor Studio",
    "category": "graduation",
    "badge": "Pencapaian Bersejarah",
    "badgeColor": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    "image": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    "basePriceTag": "Mulai Rp 200.000",
    "description": "Foto kelulusan dan wisuda dengan jubah akademik, selempang, dan toga bersama keluarga atau pasangan tercinta.",
    "durationOptions": [
      {
        "id": "grad-in-astra",
        "label": "Astra (Max 15 Menit) - Rp 200.000",
        "minutes": 15,
        "price": 200000
      },
      {
        "id": "grad-in-clara",
        "label": "Clara (Max 30 Menit) - Rp 300.000",
        "minutes": 30,
        "price": 300000
      },
      {
        "id": "grad-in-novaria",
        "label": "Novaria (Max 45 Menit) - Rp 400.000",
        "minutes": 45,
        "price": 400000,
        "isPopular": true
      },
      {
        "id": "grad-in-luxuria",
        "label": "Luxuria (Max 60 Menit) - Rp 500.000",
        "minutes": 60,
        "price": 500000
      }
    ],
    "personOptions": [
      {
        "count": 5,
        "label": "Wisudawan + Keluarga (1 - 5 Orang)",
        "extraPrice": 0
      },
      {
        "count": 8,
        "label": "+3 Pendamping (+Rp 30.000)",
        "extraPrice": 30000
      }
    ],
    "features": [
      "Durasi Max 15 - 60 Menit",
      "Unlimited Photo Raw",
      "1 Background Khusus Wisuda",
      "5 - 30 Editing Photo",
      "Include Cetak 10Rs 1x + Frame (Novaria & Luxuria)",
      "All File Share in Google Drive"
    ],
    "isActive": true
  },
  {
    "id": "pkg-graduation-outdoor",
    "name": "Graduation Outdoor Session",
    "category": "graduation",
    "badge": "Kampus & Spot Ikonik",
    "badgeColor": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
    "basePriceTag": "Mulai Rp 350.000",
    "description": "Sesi wisuda outdoor di kampus universitas atau lokasi megah bersama orang tua, sahabat, atau pasangan.",
    "durationOptions": [
      {
        "id": "grad-out-personal-astra",
        "label": "Personal Astra (Max 1 Jam) - Rp 350.000",
        "minutes": 60,
        "price": 350000
      },
      {
        "id": "grad-out-personal-luxuria",
        "label": "Personal Luxuria (Max 2 Jam) - Rp 700.000",
        "minutes": 120,
        "price": 700000,
        "isPopular": true
      },
      {
        "id": "grad-out-group-astra",
        "label": "Group Astra (Max 1 Jam) - Rp 600.000",
        "minutes": 60,
        "price": 600000
      },
      {
        "id": "grad-out-group-luxuria",
        "label": "Group Luxuria (Max 2 Jam) - Rp 1.200.000",
        "minutes": 120,
        "price": 1200000
      }
    ],
    "personOptions": [
      {
        "count": 1,
        "label": "Personal Wisudawan",
        "extraPrice": 0
      },
      {
        "count": 6,
        "label": "Grup Sahabat (1 - 6 Wisudawan)",
        "extraPrice": 0
      }
    ],
    "features": [
      "Foto Sendiri, Foto Keluarga & Foto Bareng Teman",
      "Durasi Max 1 - 2 Jam",
      "Unlimited Photo Raw",
      "30 - 60 Editing Photo",
      "All File Share in Google Drive"
    ],
    "isActive": true
  },
  {
    "id": "pkg-yearbook-indoor",
    "name": "Yearbook Indoor Studio",
    "category": "yearbook",
    "badge": "Buku Tahunan Sekolah",
    "badgeColor": "bg-teal-500/20 text-teal-300 border-teal-500/30",
    "image": "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop",
    "basePriceTag": "Mulai Rp 25.000 / orang",
    "description": "Pemotretan buku tahunan sekolah / kelas indoor dengan konsep tematik seragam di studio berkapasitas hingga 20 orang.",
    "durationOptions": [
      {
        "id": "yb-in-astra",
        "label": "Astra (Max 30 Menit) - Rp 25.000 / Orang",
        "minutes": 30,
        "price": 25000
      },
      {
        "id": "yb-in-clara",
        "label": "Clara (Max 60 Menit) - Rp 35.000 / Orang",
        "minutes": 60,
        "price": 35000,
        "isPopular": true
      }
    ],
    "personOptions": [
      {
        "count": 10,
        "label": "Minimal 10 Orang Siswa",
        "extraPrice": 0
      },
      {
        "count": 15,
        "label": "15 Orang Siswa",
        "extraPrice": 0
      },
      {
        "count": 20,
        "label": "Maksimal 20 Orang Siswa",
        "extraPrice": 0
      }
    ],
    "features": [
      "Max 20 Orang per sesi",
      "Durasi Max 30 - 60 Menit",
      "Unlimited Photo Raw",
      "Editing Per Orang 1 Photo",
      "All File Share in Google Drive"
    ],
    "isActive": true
  },
  {
    "id": "pkg-yearbook-outdoor",
    "name": "Yearbook Outdoor Session",
    "category": "yearbook",
    "badge": "Sinematik Buku Tahunan",
    "badgeColor": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    "image": "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=1200&auto=format&fit=crop",
    "basePriceTag": "Mulai Rp 25.000 / orang",
    "description": "Sesi buku tahunan di lokasi alam terbuka atau bangunan bersejarah dengan opsi video sinematik 3-5 menit.",
    "durationOptions": [
      {
        "id": "yb-out-astra",
        "label": "Astra (Max 60 Menit) - Rp 25.000 / Orang",
        "minutes": 60,
        "price": 25000
      },
      {
        "id": "yb-out-clara",
        "label": "Clara (Max 120 Menit) - Rp 35.000 / Orang",
        "minutes": 120,
        "price": 35000
      },
      {
        "id": "yb-out-luxuria",
        "label": "Luxuria (Max 120 Mnt + Video) - Rp 60.000 / Orang",
        "minutes": 120,
        "price": 60000,
        "isPopular": true
      }
    ],
    "personOptions": [
      {
        "count": 10,
        "label": "Minimal 10 Orang Siswa",
        "extraPrice": 0
      },
      {
        "count": 20,
        "label": "20 Orang Siswa",
        "extraPrice": 0
      }
    ],
    "features": [
      "Durasi Max 60 - 120 Menit",
      "Unlimited Photo Raw",
      "Editing Per Orang 1 Photo",
      "Video Sinematik 3 - 5 Menit (Paket Luxuria)",
      "All File Share in Google Drive"
    ],
    "isActive": true
  },
  {
    "id": "pkg-event-doc",
    "name": "Dokumentasi Acara & Gathering",
    "category": "event",
    "badge": "Liputan Profesional",
    "badgeColor": "bg-blue-500/20 text-blue-300 border-blue-500/30",
    "image": "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
    "basePriceTag": "Rp 700.000 / event",
    "description": "Liputan foto profesional untuk acara gathering keluarga, seminar bisnis, tunangan, arisan, reuni, atau corporate event.",
    "durationOptions": [
      {
        "id": "event-basic",
        "label": "Basic Event (1 Event, Max 3 Jam) - Rp 700.000",
        "minutes": 180,
        "price": 700000,
        "isPopular": true
      }
    ],
    "personOptions": [
      {
        "count": 50,
        "label": "Seluruh Tamu / Peserta Acara",
        "extraPrice": 0
      }
    ],
    "features": [
      "1 Event Lengkap",
      "Durasi Liputan Max 3 Jam",
      "Unlimited Photo Raw & Hi-Res",
      "Dokumentasi Momen, Tamu, & Suasana",
      "All File Share in Google Drive"
    ],
    "isActive": true
  },
  {
    "id": "pkg-event-wisuda",
    "name": "Liputan Hari Wisuda",
    "category": "graduation",
    "badge": "Hari Wisuda Kampus",
    "badgeColor": "bg-amber-500/20 text-amber-300 border-amber-500/30",
    "image": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop",
    "basePriceTag": "Mulai Rp 700.000",
    "description": "Liputan komprehensif foto atau video sinematik saat hari prosesi wisuda berlangsung di area kampus atau gedung serbaguna.",
    "durationOptions": [
      {
        "id": "wisuda-foto",
        "label": "Paket Foto Wisuda - Rp 700.000",
        "minutes": 120,
        "price": 700000,
        "isPopular": true
      },
      {
        "id": "wisuda-video",
        "label": "Paket Video Sinematik (2-3 Mnt) - Rp 800.000",
        "minutes": 120,
        "price": 800000
      }
    ],
    "personOptions": [
      {
        "count": 1,
        "label": "Wisudawan & Rombongan Keluarga",
        "extraPrice": 0
      }
    ],
    "features": [
      "Unlimited Photo Raw",
      "Editing Photo (Bisa Tambah Album/Figura)",
      "Video Sinematik 2 - 3 Menit (Pilihan Paket Video)",
      "All File Share in Google Drive"
    ],
    "isActive": true
  },
  {
    "id": "pkg-sewa-tempat",
    "name": "Sewa Tempat & Ruang Studio",
    "category": "sewa",
    "badge": "Fasilitas Studio Pro",
    "badgeColor": "bg-violet-500/20 text-violet-300 border-violet-500/30",
    "image": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop",
    "basePriceTag": "Mulai Rp 200.000",
    "description": "Sewa ruang studio foto lengkap dengan lighting Godox SK 400 dan trigger kamera untuk fotografer, kreator konten, atau desainer mandiri.",
    "durationOptions": [
      {
        "id": "sewa-30m",
        "label": "Basic (Max 30 Menit) - Rp 200.000",
        "minutes": 30,
        "price": 200000
      },
      {
        "id": "sewa-60m",
        "label": "Premium (Max 60 Menit) - Rp 350.000",
        "minutes": 60,
        "price": 350000,
        "isPopular": true
      }
    ],
    "personOptions": [
      {
        "count": 5,
        "label": "Tim Kreator (1 - 5 Orang)",
        "extraPrice": 0
      },
      {
        "count": 10,
        "label": "Tim Produksi (6 - 10 Orang) (+Rp 50.000)",
        "extraPrice": 50000
      }
    ],
    "features": [
      "2 Lighting Godox SK 400",
      "Trigger Wireless for Camera",
      "Akses ke Semua Background",
      "AC, Ruang Ganti & Cermin Rias"
    ],
    "isActive": true
  },
  {
    "id": "pkg-shot-drone",
    "name": "Shot Drone FPV & Aerial",
    "category": "drone",
    "badge": "Sinematik Udara",
    "badgeColor": "bg-red-500/20 text-red-300 border-red-500/30",
    "image": "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200&auto=format&fit=crop",
    "basePriceTag": "Rp 850.000",
    "description": "Pengambilan video udara sinematik dengan Drone DJI-Avata 360 resolusi ultra-tajam untuk lanskap, video klip, properti, atau event luar ruangan.",
    "durationOptions": [
      {
        "id": "drone-basic",
        "label": "Basic Flight Session - Rp 850.000",
        "minutes": 60,
        "price": 850000,
        "isPopular": true
      }
    ],
    "personOptions": [
      {
        "count": 1,
        "label": "Sesi Sesuai Arahan Klien",
        "extraPrice": 0
      }
    ],
    "features": [
      "Drone DJI-Avata 360",
      "Video Mentahan Full Resolusi",
      "Manuver Menyesuaikan Kebutuhan Client",
      "Pilot Drone Profesional"
    ],
    "isActive": true
  }
];

// Generate next 14 upcoming dates
function getUpcomingDates(): Array<{ dateString: string; dayName: string; dayNumber: number; monthName: string }> {
  const result = [];
  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    result.push({
      dateString,
      dayName: days[d.getDay()],
      dayNumber: d.getDate(),
      monthName: months[d.getMonth()],
    });
  }
  return result;
}


export const PACKAGE_GALLERIES: Record<string, string[]> = {
  "pkg-self-studio": [
    "https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop",
  ],
  "pkg-pas-photo": [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop",
  ],
  "pkg-personal": [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
  ],
  "pkg-maternity": [
    "https://images.unsplash.com/photo-1544126592-807ade215a0b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?q=80&w=1200&auto=format&fit=crop",
  ],
  "pkg-group-indoor": [
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop",
  ],
  "pkg-group-outdoor": [
    "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop",
  ],
  "pkg-family-indoor": [
    "https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542037104857-ffbc0b913162?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1577880216142-8549e9488dad?q=80&w=1200&auto=format&fit=crop",
  ],
  "pkg-family-outdoor": [
    "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=1200&auto=format&fit=crop",
  ],
  "pkg-birthday-indoor": [
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1200&auto=format&fit=crop",
  ],
  "pkg-birthday-outdoor": [
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1200&auto=format&fit=crop",
  ],
  "pkg-couple": [
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1200&auto=format&fit=crop",
  ],
  "pkg-prewedding": [
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519225424982-8c767e78d91c?q=80&w=1200&auto=format&fit=crop",
  ],
  "pkg-graduation-indoor": [
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
  ],
  "pkg-graduation-outdoor": [
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
  ],
  "pkg-yearbook": [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop",
  ],
  "pkg-event-dokumentasi": [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
  ],
  "pkg-sewa-studio": [
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop",
  ],
  "pkg-drone-aerial": [
    "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
  ],
  "room-self": [
    "https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop",
  ],
  "room-01": [
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop",
  ],
};

export const DEFAULT_STUDIO_GALLERY: string[] = [
  "https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop",
];

export default function StudioBookingExperience() {
  // Category Filter State for 18 service packages
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Dynamic Add-ons state (Loaded from /api/pricing)
  const [addons, setAddons] = useState<StudioAddon[]>([]);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

  // 1. Dynamic Packages state (Loaded from /api/booking-packages with fallback)
  const [packages, setPackages] = useState<BookingExperiencePackage[]>(BOOKING_PACKAGES);

  // Fetch dynamic packages from API (Live CMS Sync with Admin)
  useEffect(() => {
    async function loadDynamicPackages() {
      try {
        const res = await fetch("/api/booking-packages");
        const data = await res.json();
        if (data.success && Array.isArray(data.packages) && data.packages.length > 0) {
          const activeOnly = data.packages.filter((p: BookingExperiencePackage) => p.isActive !== false);
          if (activeOnly.length > 0) {
            setPackages(activeOnly);
            setActivePackageId((prev) => (activeOnly.some((p: BookingExperiencePackage) => p.id === prev) ? prev : activeOnly[0].id));
          }
        }
      } catch (e) {
        console.error("Gagal memuat paket booking dinamis:", e);
      }
    }
    loadDynamicPackages();

    async function loadAddons() {
      try {
        const res = await fetch("/api/pricing");
        const data = await res.json();
        if (data.success && Array.isArray(data.addons)) {
          setAddons(data.addons.filter((a: StudioAddon) => a.isActive !== false));
        }
      } catch (e) {
        console.error("Gagal memuat add-ons:", e);
      }
    }
    loadAddons();
  }, []);

  // Package selections state per package
  const [selectedDurationByPkg, setSelectedDurationByPkg] = useState<Record<string, string>>({
    "room-self": "self-15m",
    "room-01": "cyc-2h",
    "room-02": "loft-2h",
    "room-03": "noir-2h",
  });

  const [selectedPersonByPkg, setSelectedPersonByPkg] = useState<Record<string, number>>({
    "room-self": 1,
    "room-01": 4,
    "room-02": 4,
    "room-03": 3,
  });


  // Current active chosen package for booking
  const [activePackageId, setActivePackageId] = useState<string>("pkg-self-studio");
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  // Reset photo index when active package changes
  useEffect(() => {
    setActivePhotoIdx(0);
  }, [activePackageId]);

  // Step 2: Date
  const upcomingDates = useMemo(() => getUpcomingDates(), []);
  const [selectedDate, setSelectedDate] = useState<string>(upcomingDates[0].dateString);

  // Step 3: Time Slot
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState<boolean>(false);

  // Step 4: Client information
  const [clientName, setClientName] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [clientNotes, setClientNotes] = useState<string>("");
  const [paymentOption, setPaymentOption] = useState<"on_spot">("on_spot");

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [createdBooking, setCreatedBooking] = useState<StudioBooking | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Refs for smooth auto-scroll to successive steps
  const dateSectionRef = useRef<HTMLDivElement>(null);
  const timeSectionRef = useRef<HTMLDivElement>(null);
  const checkoutSectionRef = useRef<HTMLDivElement>(null);
  const successSectionRef = useRef<HTMLDivElement>(null);

  // Active package details
  const activePackage = useMemo(() => {
    return packages.find((p) => p.id === activePackageId) || packages[0] || BOOKING_PACKAGES[0];
  }, [packages, activePackageId]);

  // Current duration option of active package
  const activeDurationOption = useMemo(() => {
    const durId = selectedDurationByPkg[activePackage.id];
    return activePackage.durationOptions.find((d) => d.id === durId) || activePackage.durationOptions[0];
  }, [activePackage, selectedDurationByPkg]);

  // Current person option of active package
  const activePersonOption = useMemo(() => {
    const pCount = selectedPersonByPkg[activePackage.id];
    return activePackage.personOptions.find((p) => p.count === pCount) || activePackage.personOptions[0];
  }, [activePackage, selectedPersonByPkg]);

  // Category definitions for quick discovery
  const categoryTabs = [
    { id: "all", label: "Semua", count: packages.length },
    { id: "self-studio", label: "Self Studio", count: packages.filter((p) => p.category === "self-studio").length },
    { id: "pas-photo", label: "Pas Photo", count: packages.filter((p) => p.category === "pas-photo").length },
    { id: "personal", label: "Personal", count: packages.filter((p) => p.category === "personal").length },
    { id: "maternity", label: "Maternity", count: packages.filter((p) => p.category === "maternity").length },
    { id: "group", label: "Group", count: packages.filter((p) => p.category === "group").length },
    { id: "family", label: "Family", count: packages.filter((p) => p.category === "family").length },
    { id: "couple", label: "Couple & Prewed", count: packages.filter((p) => ["couple", "prewedding"].includes(p.category || "")).length },
    { id: "birthday", label: "Birthday", count: packages.filter((p) => p.category === "birthday").length },
    { id: "graduation", label: "Wisuda", count: packages.filter((p) => p.category === "graduation").length },
    { id: "yearbook", label: "Yearbook", count: packages.filter((p) => p.category === "yearbook").length },
    { id: "event-sewa-drone", label: "Event & Sewa Studio", count: packages.filter((p) => ["event", "sewa", "drone"].includes(p.category || "")).length },
  ];

  const filteredPackages = useMemo(() => {
    if (selectedCategory === "all") return packages;
    if (selectedCategory === "couple") {
      return packages.filter((p) => ["couple", "prewedding"].includes(p.category || ""));
    }
    if (selectedCategory === "event-sewa-drone") {
      return packages.filter((p) => ["event", "sewa", "drone"].includes(p.category || ""));
    }
    return packages.filter((p) => p.category === selectedCategory);
  }, [packages, selectedCategory]);

  // Handle category switch: if current package is not in the filtered category, select first available
  const handleSelectCategoryTab = (catId: string) => {
    setSelectedCategory(catId);
    setActivePhotoIdx(0);
    let nextList = packages;
    if (catId === "couple") {
      nextList = packages.filter((p) => ["couple", "prewedding"].includes(p.category || ""));
    } else if (catId === "event-sewa-drone") {
      nextList = packages.filter((p) => ["event", "sewa", "drone"].includes(p.category || ""));
    } else if (catId !== "all") {
      nextList = packages.filter((p) => p.category === catId);
    }
    if (nextList.length > 0 && !nextList.some((p) => p.id === activePackageId)) {
      setActivePackageId(nextList[0].id);
    }
  };

  // Get 4 distinct gallery images for active package
  const activePackagePhotos = useMemo(() => {
    const list = PACKAGE_GALLERIES[activePackage.id] || DEFAULT_STUDIO_GALLERY;
    const combined = [activePackage.image, ...list.filter((img) => img !== activePackage.image)];
    return Array.from(new Set(combined)).slice(0, 4);
  }, [activePackage]);

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calculate live price for a package
  const calculatePackagePrice = (pkg: BookingExperiencePackage) => {
    const durId = selectedDurationByPkg[pkg.id] || pkg.durationOptions[0].id;
    const durOpt = pkg.durationOptions.find((d) => d.id === durId) || pkg.durationOptions[0];

    const pCount = selectedPersonByPkg[pkg.id] ?? pkg.personOptions[0].count;
    const pOpt = pkg.personOptions.find((p) => p.count === pCount) || pkg.personOptions[0];

    return durOpt.price + pOpt.extraPrice;
  };

  const addonsTotal = useMemo(() => {
    return selectedAddonIds.reduce((sum, id) => {
      const found = addons.find((a) => a.id === id);
      return sum + (found ? found.price : 0);
    }, 0);
  }, [selectedAddonIds, addons]);

  const currentTotalPrice = useMemo(() => {
    return calculatePackagePrice(activePackage) + addonsTotal;
  }, [activePackage, activeDurationOption, activePersonOption, addonsTotal]);

  const depositAmount = useMemo(() => {
    if (activePackage.id === "pkg-self-studio" || activePackage.id === "room-self") {
      return Math.round(currentTotalPrice * 0.5); // 50% for self studio
    }
    return Math.round(currentTotalPrice * 0.3); // 30% for suite rooms
  }, [activePackage.id, currentTotalPrice]);

  // Format currency helper
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Pre-fill user data if logged in
  useEffect(() => {
    async function checkUserSession() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          if (data.user.name) setClientName(data.user.name);
          if (data.user.email) setClientEmail(data.user.email);
        }
      } catch (_) {}
    }
    checkUserSession();
  }, []);

  // Check availability when date or active package changes
  useEffect(() => {
    async function fetchAvailability() {
      if (!selectedDate) return;
      setLoadingAvailability(true);
      try {
        const res = await fetch(`/api/bookings/availability?date=${selectedDate}&roomId=${activePackage.id}`);
        const data = await res.json();
        if (data.success) {
          const booked = Array.isArray(data.bookedSlots) ? data.bookedSlots : [];
          setBookedSlots(booked);
        }
      } catch (e) {
        console.error("Gagal memeriksa ketersediaan:", e);
      } finally {
        setLoadingAvailability(false);
      }
    }
    fetchAvailability();
  }, [selectedDate, activePackage.id]);

  // Reset selected time if date changes
  useEffect(() => {
    setSelectedTimeSlot("");
  }, [selectedDate, activePackage.id]);

  // Available time slots based on package type
  const availableTimeSlots = useMemo(() => {
    const isSelfPhoto =
      activePackage.id === "room-self" ||
      activePackage.id === "pkg-self-studio" ||
      activePackage.category === "self-studio" ||
      activePackage.id === "pkg-pas-photo" ||
      activePackage.category === "pas-photo";

    if (isSelfPhoto) {
      // 15-minute / 30-minute self photo & pas photo express slots
      return [
        "09:00 - 09:15",
        "09:15 - 09:30",
        "09:30 - 09:45",
        "09:45 - 10:00",
        "10:00 - 10:15",
        "10:15 - 10:30",
        "10:30 - 10:45",
        "10:45 - 11:00",
        "11:00 - 11:30",
        "11:30 - 12:00",
        "13:00 - 13:30",
        "13:30 - 14:00",
        "14:00 - 14:30",
        "14:30 - 15:00",
        "15:00 - 15:30",
        "15:30 - 16:00",
        "16:00 - 16:30",
        "16:30 - 17:00",
        "18:00 - 18:30",
        "18:30 - 19:00",
        "19:00 - 19:30",
        "19:30 - 20:00",
        "20:00 - 20:30",
        "20:30 - 21:00",
      ];
    }

    // Studio Production Sessions
    return [
      "Pagi Sesi 1 (09:00 - 11:00)",
      "Siang Sesi 2 (11:00 - 13:00)",
      "Sore Sesi 3 (13:30 - 15:30)",
      "Senja Sesi 4 (16:00 - 18:00)",
      "Malam Sesi 5 (18:30 - 20:30)",
      "Seharian Penuh (09:00 - 17:00)",
    ];
  }, [activePackage.id]);

  // Action: Choose package card and scroll to Step 2 (Date)
  const handleSelectPackage = (pkgId: string) => {
    setActivePackageId(pkgId);
    setTimeout(() => {
      dateSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Action: Choose Date and scroll to Step 3 (Time)
  const handleSelectDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    setTimeout(() => {
      timeSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  // Action: Choose Time and scroll to Step 4 (Checkout form)
  const handleSelectTime = (slot: string) => {
    setSelectedTimeSlot(slot);
    setTimeout(() => {
      checkoutSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  // Action: Handle Booking Submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!clientName.trim()) {
      setSubmitError("Nama lengkap pemesan wajib diisi.");
      return;
    }
    if (!clientPhone.trim()) {
      setSubmitError("Nomor WhatsApp/Telepon wajib diisi untuk konfirmasi booking.");
      return;
    }
    if (!selectedTimeSlot) {
      setSubmitError("Silakan pilih waktu/jam sesi pemotretan terlebih dahulu.");
      timeSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setIsSubmitting(true);

    try {
      const depositPaid = 0;
      const paymentStatus = "unpaid";

      const selectedAddonsData = selectedAddonIds
        .map((id) => addons.find((a) => a.id === id))
        .filter((a): a is StudioAddon => Boolean(a))
        .map((a) => ({ id: a.id, name: a.name, price: a.price }));

      const bookingPayload = {
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim(),
        roomId: activePackage.id,
        roomName: `${activePackage.name} (${activeDurationOption.label}, ${activePersonOption.label})`,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        duration: activePackage.id === "pkg-self-studio" || activePackage.id === "room-self" ? "hourly" : activeDurationOption.minutes >= 480 ? "full" : "half",
        selectedAddons: selectedAddonsData,
        totalPrice: currentTotalPrice,
        depositPaid,
        paymentStatus,
        notes: `Metode Pembayaran: Cash di Tempat (Studio Kasir) | Durasi: ${activeDurationOption.label} | Peserta: ${activePersonOption.label}${selectedAddonsData.length > 0 ? ` | Addon: ${selectedAddonsData.map(a => a.name).join(', ')}` : ''}${clientNotes ? ` | Catatan: ${clientNotes.trim()}` : ""}`,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal membuat reservasi.");
      }

      setCreatedBooking(data.booking);
      setTimeout(() => {
        successSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memproses booking.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyBookingCode = () => {
    if (createdBooking?.id) {
      navigator.clipboard.writeText(createdBooking.id);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // WhatsApp concierge direct confirmation link generator
  const getWhatsAppConfirmationUrl = () => {
    if (!createdBooking) return "#";
    const phone = "6285196671398";
    const addonLines = (createdBooking.selectedAddons && createdBooking.selectedAddons.length > 0)
      ? "\n• Layanan Tambahan (Add-on):\n" + createdBooking.selectedAddons.map((a: { name: string; price: number }) => `  - ${a.name} (${formatRupiah(a.price)})`).join("\n") + "\n"
      : "";

    const text = encodeURIComponent(
      `Halo Origine Studio Malang, saya baru saja melakukan reservasi sesi studio online:\n\n` +
        `• Kode Booking: ${createdBooking.id}\n` +
        `• Nama: ${createdBooking.clientName}\n` +
        `• Paket: ${createdBooking.roomName}\n` +
        `• Tanggal: ${createdBooking.date}\n` +
        `• Jam: ${createdBooking.timeSlot}\n` +
        addonLines +
        `• Total Biaya: ${formatRupiah(createdBooking.totalPrice)}\n` +
        `• Metode Pembayaran: Cash di Tempat (Bayar di Studio)\n` +
        `• Status Bayar: Bayar Tunai di Kasir Studio saat Sesi Tiba\n\n` +
        `Mohon konfirmasi ketersediaan dan detail kedatangan. Terima kasih!`
    );
    return `https://wa.me/${phone}?text=${text}`;
  };

  return (
    <div className="space-y-16">
      {/* ============================================================ */}
      {/* 1. PROGRESS WIDGET INDICATOR */}
      {/* ============================================================ */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 shadow-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#720C10]/20 border border-[#720C10]/40 text-white">
            <span className="w-5 h-5 rounded-full bg-[#720C10] text-white flex items-center justify-center font-bold text-[10px]">
              1
            </span>
            <div className="truncate">
              <p className="text-[10px] text-zinc-400 uppercase">Langkah 1</p>
              <p className="font-semibold truncate">{activePackage.name.split(":")[0]}</p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
              selectedDate
                ? "bg-white/[0.04] border-white/15 text-white"
                : "bg-white/[0.01] border-white/5 text-zinc-500"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                selectedDate ? "bg-white/20 text-white" : "bg-zinc-800 text-zinc-500"
              }`}
            >
              2
            </span>
            <div className="truncate">
              <p className="text-[10px] text-zinc-400 uppercase">Langkah 2</p>
              <p className="font-semibold truncate">{selectedDate || "Pilih Tanggal"}</p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
              selectedTimeSlot
                ? "bg-white/[0.04] border-white/15 text-white"
                : "bg-white/[0.01] border-white/5 text-zinc-500"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                selectedTimeSlot ? "bg-white/20 text-white" : "bg-zinc-800 text-zinc-500"
              }`}
            >
              3
            </span>
            <div className="truncate">
              <p className="text-[10px] text-zinc-400 uppercase">Langkah 3</p>
              <p className="font-semibold truncate">{selectedTimeSlot || "Pilih Jam"}</p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
              createdBooking
                ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                : "bg-white/[0.01] border-white/5 text-zinc-500"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                createdBooking ? "bg-emerald-500 text-black" : "bg-zinc-800 text-zinc-500"
              }`}
            >
              4
            </span>
            <div className="truncate">
              <p className="text-[10px] text-zinc-400 uppercase">Langkah 4</p>
              <p className="font-semibold truncate">{createdBooking ? "Terkonfirmasi" : "Data & Booking"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. STEP 1: CARDS DENGAN FOTO, MENU PILIHAN & DROPDOWN */}
      {/* ============================================================ */}
      <section id="step-packages" className="space-y-3 sm:space-y-4">
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2.5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#ff6169] font-bold mb-0.5">
              <span className="w-2 h-2 rounded-full bg-[#720C10]" />
              LANGKAH 01 // PILIH PAKET STUDIO
            </div>
            <h2 className="text-xl sm:text-2xl font-serif text-white font-light">
              Katalog & <span className="italic font-serif-italic">Konfigurasi Sesi</span>
            </h2>
          </div>
          <p className="text-[11px] font-mono text-zinc-400">
            Pilih kategori di atas, klik foto untuk melihat angle studio, lalu tentukan opsi paket & tanggal.
          </p>
        </div>

        {/* 1. TOP CATEGORY BAR (Agar user tidak capek ketika semua paket ditampilkan) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categoryTabs.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectCategoryTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 border ${
                  isActive
                    ? "bg-[#720C10] text-white border-[#ff6169] shadow-md shadow-[#720C10]/30 font-semibold"
                    : "bg-[#141414] text-zinc-400 hover:text-white hover:bg-white/5 border-white/10"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${isActive ? "bg-white/20 text-white" : "bg-white/5 text-zinc-500"}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. SUB-PACKAGE SELECTOR (Jika kategori terpilih memiliki > 1 paket) */}
        {filteredPackages.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-mono uppercase text-zinc-500 shrink-0 mr-1">
              Pilihan Paket:
            </span>
            {filteredPackages.map((pkg) => {
              const isCurrent = activePackageId === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => {
                    setActivePackageId(pkg.id);
                    setActivePhotoIdx(0);
                  }}
                  className={`px-3 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                    isCurrent
                      ? "bg-[#720C10]/25 text-[#ff6169] border-[#ff6169]/80 font-semibold shadow-sm"
                      : "bg-[#101010] text-zinc-400 hover:text-zinc-200 border-white/5 hover:border-white/15"
                  }`}
                >
                  <span>{pkg.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 3. THE 1 MASTER COMPACT CARD (Galeri Foto Interaktif di Kiri + Keterangan & Kontrol di Kanan) */}
        {(() => {
          const currentDurId = selectedDurationByPkg[activePackage.id] || activePackage.durationOptions[0].id;
          const currentDur = activePackage.durationOptions.find((d) => d.id === currentDurId) || activePackage.durationOptions[0];
          const currentPersonCount = selectedPersonByPkg[activePackage.id] ?? activePackage.personOptions[0].count;
          const cardPrice = calculatePackagePrice(activePackage);
          const currentPhoto = activePackagePhotos[activePhotoIdx] || activePackagePhotos[0] || activePackage.image;

          const handlePrevPhoto = (e: React.MouseEvent) => {
            e.stopPropagation();
            setActivePhotoIdx((prev) => (prev - 1 + activePackagePhotos.length) % activePackagePhotos.length);
          };

          const handleNextPhoto = (e: React.MouseEvent) => {
            e.stopPropagation();
            setActivePhotoIdx((prev) => (prev + 1) % activePackagePhotos.length);
          };

          return (
            <div className="rounded-2xl sm:rounded-3xl bg-[#141414] border border-white/10 shadow-2xl p-3.5 sm:p-5 transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
                
                {/* SISI KIRI: MULTI-FOTO DENGAN FOTO BERUBAH SAAT DIKLIK (lg:col-span-5) */}
                <div className="lg:col-span-5 space-y-2.5">
                  {/* Foto Utama Besar (Compact max-height agar tidak memenuhi layar) */}
                  <div
                    onClick={() => setActivePhotoIdx((prev) => (prev + 1) % activePackagePhotos.length)}
                    className="relative aspect-[4/3] w-full max-h-[260px] sm:max-h-[290px] rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 group cursor-pointer select-none shadow-inner"
                    title="Klik foto untuk melihat foto studio berikutnya"
                  >
                    <Image
                      src={currentPhoto}
                      alt={`${activePackage.name} - Foto ${activePhotoIdx + 1}`}
                      fill
                      className="object-cover object-center transition-all duration-500 ease-out group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold border backdrop-blur-md ${activePackage.badgeColor}`}>
                        {activePackage.badge}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-zinc-300 border border-white/10 text-[10px] font-mono">
                        {activePackage.basePriceTag}
                      </span>
                    </div>

                    {/* Navigation Arrows (Prev / Next) */}
                    {activePackagePhotos.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={handlePrevPhoto}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 hover:bg-[#720C10] text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all opacity-80 hover:opacity-100 cursor-pointer shadow-md"
                          title="Foto sebelumnya"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextPhoto}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 hover:bg-[#720C10] text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all opacity-80 hover:opacity-100 cursor-pointer shadow-md"
                          title="Foto berikutnya"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Bottom Indicator & Counter */}
                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-zinc-300 pointer-events-none">
                      <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-zinc-300">
                        <Camera className="w-3 h-3 text-[#ff6169]" />
                        <span>Foto {activePhotoIdx + 1}/{activePackagePhotos.length}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-zinc-400">
                        Klik foto untuk ganti
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail Selector Baris (Banyak Foto yang Berubah Saat Diklik) */}
                  {activePackagePhotos.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
                      {activePackagePhotos.map((img, idx) => {
                        const isThumbActive = activePhotoIdx === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActivePhotoIdx(idx)}
                            className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 border transition-all duration-200 cursor-pointer ${
                              isThumbActive
                                ? "ring-2 ring-[#ff6169] border-[#ff6169] opacity-100 scale-105 shadow-md shadow-[#720C10]/30"
                                : "border-white/10 opacity-50 hover:opacity-90 hover:border-white/30"
                            }`}
                          >
                            <Image
                              src={img}
                              alt={`Thumbnail ${idx + 1}`}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                            {isThumbActive && (
                              <div className="absolute inset-0 bg-[#720C10]/20 pointer-events-none" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* SISI KANAN: KETERANGAN & DROPDOWN PILIHAN SUPER COMPACT (lg:col-span-7) */}
                <div className="lg:col-span-7 space-y-3.5">
                  {/* Title & Description */}
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#ff6169] font-bold mb-0.5">
                      <Sparkles className="w-3 h-3 text-[#ff6169]" />
                      <span>{activePackage.category?.toUpperCase() || "STUDIO SERVICE"}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-serif text-white font-medium">
                      {activePackage.name}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400 font-light leading-relaxed line-clamp-2">
                      {activePackage.description}
                    </p>
                  </div>

                  {/* Feature Highlights (Ringkas & Hemat Tempat) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 py-2 border-y border-white/5">
                    {activePackage.features.slice(0, 4).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                        <Check className="w-3 h-3 text-[#ff6169] shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Dropdowns Konfigurasi (Durasi & Orang) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Dropdown 1: Durasi / Opsi Paket */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1 flex items-center gap-1.5 font-semibold">
                        <Clock className="w-3 h-3 text-[#ff6169]" />
                        <span>Pilihan Durasi / Paket</span>
                      </label>
                      <div className="relative">
                        <select
                          value={currentDurId}
                          onChange={(e) => {
                            setSelectedDurationByPkg((prev) => ({
                              ...prev,
                              [activePackage.id]: e.target.value,
                            }));
                          }}
                          className="w-full appearance-none px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#ff6169] transition-colors cursor-pointer pr-8"
                        >
                          {activePackage.durationOptions.map((opt) => (
                            <option key={opt.id} value={opt.id} className="bg-zinc-900 text-white">
                              {opt.label} — {formatRupiah(opt.price)}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Dropdown 2: Jumlah Orang */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1 flex items-center gap-1.5 font-semibold">
                        <Users className="w-3 h-3 text-[#ff6169]" />
                        <span>Kapasitas Orang</span>
                      </label>
                      <div className="relative">
                        <select
                          value={currentPersonCount}
                          onChange={(e) => {
                            setSelectedPersonByPkg((prev) => ({
                              ...prev,
                              [activePackage.id]: Number(e.target.value),
                            }));
                          }}
                          className="w-full appearance-none px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#ff6169] transition-colors cursor-pointer pr-8"
                        >
                          {activePackage.personOptions.map((p) => (
                            <option key={p.count} value={p.count} className="bg-zinc-900 text-white">
                              {p.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Live Price Summary & Action Button */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10">
                    <div>
                      <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                        Estimasi Biaya Sesi
                      </p>
                      <p className="text-xl sm:text-2xl font-syne font-bold text-white flex items-center gap-2">
                        <span className="text-[#ff6169]">{formatRupiah(cardPrice)}</span>
                        <span className="text-[11px] font-mono text-zinc-400 font-normal">
                          ({currentDur.label.split("-")[0].trim()})
                        </span>
                      </p>
                    </div>

                    {/* Action Button: Lanjut ke Kalender Tanggal */}
                    <button
                      type="button"
                      onClick={() => handleSelectPackage(activePackage.id)}
                      className="px-5 py-2.5 rounded-xl bg-[#720C10] hover:bg-[#8e0e14] text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-lg shadow-[#720C10]/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 border border-[#ff6169]/30"
                    >
                      <span>Lanjut Pilih Tanggal (Langkah 02)</span>
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })()}
      </section>

      

      {/* ============================================================ */}
      {/* 3. STEP 2: PILIH TANGGAL BOOKING YANG TERSEDIA */}
      {/* ============================================================ */}
      <section
        ref={dateSectionRef}
        id="step-date"
        className="p-6 sm:p-8 rounded-3xl bg-[#141414] border border-white/10 shadow-2xl space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#ff6169] font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-[#720C10]" />
              LANGKAH 02 // PILIH TANGGAL SESI
            </div>
            <h3 className="text-xl sm:text-2xl font-serif text-white font-medium">
              Tanggal Kunjungan Studio
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Paket aktif: <span className="text-white font-semibold">{activePackage.name}</span> ({activeDurationOption.label}, {activePersonOption.label})
            </p>
          </div>

          {/* Quick Date Input picker for further dates */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400 hidden sm:inline">Pilih Kalender:</span>
            <input
              type="date"
              value={selectedDate}
              min={upcomingDates[0].dateString}
              onChange={(e) => handleSelectDate(e.target.value)}
              className="px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#ff6169] cursor-pointer"
            />
          </div>
        </div>

        {/* Horizontal interactive Date Cards Strip */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2.5 sm:gap-3">
          {upcomingDates.map((item) => {
            const isDateSelected = selectedDate === item.dateString;
            return (
              <button
                key={item.dateString}
                type="button"
                onClick={() => handleSelectDate(item.dateString)}
                className={`p-3 sm:p-4 rounded-2xl border text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-1 active:scale-95 ${
                  isDateSelected
                    ? "bg-[#720C10] border-[#ff6169] text-white shadow-xl shadow-[#720C10]/30 scale-105"
                    : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <span className="text-[10px] font-mono uppercase tracking-wider font-medium">
                  {item.dayName}
                </span>
                <span className="text-xl sm:text-2xl font-syne font-bold">
                  {item.dayNumber}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {item.monthName}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ketersediaan studio terhubung langsung ke panel admin secara real-time.</span>
          </div>
          <span className="text-zinc-500">Klik tanggal untuk lanjut ke pilihan jam</span>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. STEP 3: PILIH WAKTU / JAM BOOKING */}
      {/* ============================================================ */}
      <section
        ref={timeSectionRef}
        id="step-time"
        className="p-6 sm:p-8 rounded-3xl bg-[#141414] border border-white/10 shadow-2xl space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#ff6169] font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-[#720C10]" />
              LANGKAH 03 // PILIH WAKTU & SLOT JAM
            </div>
            <h3 className="text-xl sm:text-2xl font-serif text-white font-medium">
              Jadwal Sesi Tersedia Pada {selectedDate}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Pilih slot waktu yang sesuai. Slot yang sudah terisi otomatis tidak dapat dipilih.
            </p>
          </div>

          {loadingAvailability && (
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Memeriksa ketersediaan jam...</span>
            </div>
          )}
        </div>

        {/* Time Slot Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {availableTimeSlots.map((slot) => {
            const isBooked = bookedSlots.includes(slot);
            const isChosen = selectedTimeSlot === slot;

            if (isBooked) {
              return (
                <div
                  key={slot}
                  className="p-3.5 rounded-xl border border-white/5 bg-zinc-900/40 text-zinc-600 text-center text-xs font-mono cursor-not-allowed opacity-50 relative"
                  title="Slot jam ini sudah dipesan oleh klien lain"
                >
                  <span className="line-through block">{slot}</span>
                  <span className="text-[9px] uppercase tracking-wider text-rose-500/70 font-semibold block mt-0.5">
                    Penuh / Booked
                  </span>
                </div>
              );
            }

            return (
              <button
                key={slot}
                type="button"
                onClick={() => handleSelectTime(slot)}
                className={`p-3.5 rounded-xl border text-center transition-all duration-300 cursor-pointer font-mono text-xs flex flex-col items-center justify-center gap-1 active:scale-95 ${
                  isChosen
                    ? "bg-[#720C10] border-[#ff6169] text-white shadow-xl shadow-[#720C10]/40 scale-105 font-bold"
                    : "bg-white/[0.03] border-white/10 text-zinc-300 hover:text-white hover:border-[#ff6169]/50 hover:bg-white/[0.06]"
                }`}
              >
                <span>{slot}</span>
                <span className={`text-[9px] uppercase tracking-wider font-semibold ${isChosen ? "text-white" : "text-emerald-400"}`}>
                  {isChosen ? "Terpilih" : "Tersedia"}
                </span>
              </button>
            );
          })}
        </div>

        {selectedTimeSlot ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-mono text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Slot Terpilih: <strong>{selectedTimeSlot}</strong> pada tanggal <strong>{selectedDate}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                checkoutSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="text-[#ff6169] hover:text-white transition-colors underline flex items-center gap-1"
            >
              <span>Lanjut ke Formulir</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <p className="text-xs font-mono text-zinc-500 text-center py-2">
            Silakan klik salah satu kotak jam di atas untuk melanjutkan ke formulir reservasi.
          </p>
        )}
      </section>

      {/* ============================================================ */}
      {/* 5. STEP 4: FORMULIR DATA KLIEN & KONFIRMASI PEMBAYARAN */}
      {/* ============================================================ */}
      <section
        ref={checkoutSectionRef}
        id="step-checkout"
        className="p-6 sm:p-8 rounded-3xl bg-[#141414] border border-white/10 shadow-2xl space-y-8"
      >
        <div className="pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#ff6169] font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-[#720C10]" />
            LANGKAH 04 // DATA PEMESAN & KONFIRMASI RESERVASI
          </div>
          <h3 className="text-xl sm:text-2xl font-serif text-white font-medium">
            Formulir Reservasi Resmi Studio
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Reservasi akan langsung diteruskan ke sistem panel admin dan staf studio kami.
          </p>
        </div>

        <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form inputs */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5 font-semibold">
                Nama Lengkap Pemesan <span className="text-[#ff6169]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Contoh: Clarissa Sutedja"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-[#ff6169] transition-colors"
                />
                <User className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5 font-semibold">
                  Nomor WhatsApp / HP <span className="text-[#ff6169]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-[#ff6169] transition-colors"
                  />
                  <Phone className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5 font-semibold">
                  Alamat Email (Opsional)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-[#ff6169] transition-colors"
                  />
                  <Mail className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5 font-semibold">
                Catatan Sesi / Konsep Foto (Opsional)
              </label>
              <textarea
                rows={3}
                placeholder="Misal: Foto wisuda keluarga 4 orang, butuh properti kursi vintage atau request cetak polaroid tambahan..."
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-[#ff6169] transition-colors resize-none"
              />
            </div>

            {/* Metodologi Pembayaran */}
            <div className="pt-2">
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2 font-semibold">
                Opsi Pembayaran
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. OPSI AKTIF: CASH DI TEMPAT */}
                <div
                  className="p-4 rounded-2xl border bg-[#720C10]/15 border-[#ff6169] ring-1 ring-[#ff6169]/40 text-white relative flex flex-col justify-between shadow-lg shadow-[#720C10]/20"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-[#720C10] text-white">
                          <Banknote className="w-4 h-4" />
                        </span>
                        <span className="font-bold text-sm text-white">Cash di Tempat</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Aktif Saat Ini
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-light">
                      Pembayaran tunai langsung di kasir Origine Studio saat Anda tiba untuk sesi pemotretan. Tanpa perlu transfer biaya di muka.
                    </p>
                  </div>
                  <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">Total Tagihan Kasir:</span>
                    <span className="text-[#ff6169] font-bold font-syne text-sm">
                      {formatRupiah(currentTotalPrice)}
                    </span>
                  </div>
                </div>

                {/* 2. OPSI QRIS & E-WALLET: COMING SOON */}
                <div
                  className="p-4 rounded-2xl border border-white/10 bg-zinc-900/40 text-zinc-500 relative flex flex-col justify-between opacity-70 cursor-not-allowed select-none"
                  title="Pembayaran QRIS instan sedang dalam tahap integrasi sistem"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <span className="p-1.5 rounded-lg bg-white/5 text-zinc-400">
                          <QrCode className="w-4 h-4" />
                        </span>
                        <span className="font-semibold text-sm text-zinc-300">QRIS Instan & E-Wallet</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 tracking-wider">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed font-light">
                      Pembayaran online instan via BCA QRIS, GoPay, OVO, ShopeePay & DANA segera hadir untuk kemudahan transaksi Anda.
                    </p>
                  </div>
                  <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-600">
                    <span>Metode Digital:</span>
                    <span className="text-amber-400/70 font-mono text-[11px]">Segera Hadir</span>
                  </div>
                </div>
              </div>
            </div>

            {submitError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                <Info className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}
          </div>

          {/* Right Column: Invoice summary & Submit Button */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#181818] border border-white/10 shadow-xl space-y-6">
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#ff6169] font-bold">
                RINGKASAN RESERVASI
              </p>
              <h4 className="text-lg font-serif text-white font-medium mt-1">
                {activePackage.name}
              </h4>
            </div>

            <div className="space-y-3 pt-3 border-t border-white/10 text-xs font-mono">
              <div className="flex justify-between items-center text-zinc-400">
                <span>Durasi Sesi:</span>
                <span className="text-white font-medium">{activeDurationOption.label}</span>
              </div>

              <div className="flex justify-between items-center text-zinc-400">
                <span>Jumlah Orang:</span>
                <span className="text-white font-medium">{activePersonOption.label}</span>
              </div>

              <div className="flex justify-between items-center text-zinc-400">
                <span>Tanggal:</span>
                <span className="text-white font-medium">{selectedDate}</span>
              </div>

              <div className="flex justify-between items-center text-zinc-400">
                <span>Jam / Sesi:</span>
                <span className="text-[#ff6169] font-bold">
                  {selectedTimeSlot || "Belum dipilih"}
                </span>
              </div>

              <div className="flex justify-between items-center text-zinc-400">
                <span>Metode Pembayaran:</span>
                <span className="text-emerald-400 font-medium">Cash di Tempat (Studio)</span>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex justify-between items-center text-zinc-400 text-xs">
                  <span>Biaya Paket Dasar:</span>
                  <span>{formatRupiah(activeDurationOption.price)}</span>
                </div>
                {activePersonOption.extraPrice > 0 && (
                  <div className="flex justify-between items-center text-zinc-400 text-xs">
                    <span>Tambahan Orang:</span>
                    <span>+{formatRupiah(activePersonOption.extraPrice)}</span>
                  </div>
                )}
                {addonsTotal > 0 && (
                  <div className="flex justify-between items-center text-zinc-400 text-xs">
                    <span>Layanan Add-on ({selectedAddonIds.length}):</span>
                    <span className="text-emerald-400">+{formatRupiah(addonsTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-white text-base font-bold pt-2 border-t border-white/5">
                  <span>Total Biaya:</span>
                  <span className="text-xl font-syne text-[#ff6169]">
                    {formatRupiah(currentTotalPrice)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !selectedTimeSlot}
              className={`w-full py-4 rounded-xl font-mono text-xs uppercase tracking-widest font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xl ${
                isSubmitting || !selectedTimeSlot
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                  : "bg-[#720C10] hover:bg-[#8e0e14] text-white shadow-[#720C10]/40 border border-[#ff6169]/30 active:scale-95"
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menyimpan ke Admin Panel...</span>
                </>
              ) : (
                <>
                  <span>Konfirmasi & Buat Reservasi</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-[11px] font-mono text-zinc-500 text-center leading-relaxed flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Data otomatis masuk ke panel admin dan jadwal kalender studio.</span>
            </div>
          </div>
        </form>
      </section>

      {/* ============================================================ */}
      {/* 6. SUKSES: DIGITAL BOOKING PASS TIKET DIGITAL */}
      {/* ============================================================ */}
      {createdBooking && (
        <section
          ref={successSectionRef}
          id="step-success"
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#181818] to-[#101010] border-2 border-emerald-500/40 shadow-2xl space-y-8 animate-in fade-in duration-700"
        >
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="text-xs font-mono tracking-widest uppercase text-emerald-400 font-bold pt-2">
              RESERVASI BERHASIL DIBUAT
            </p>
            <h3 className="text-2xl sm:text-4xl font-serif text-white font-medium">
              Tiket Reservasi Resmi Origine Studio
            </h3>
            <p className="text-xs text-zinc-400 font-light">
              Reservasi Anda telah tersimpan di sistem panel admin studio kami. Silakan simpan kode booking berikut atau konfirmasi melalui WhatsApp Concierge.
            </p>
          </div>

          {/* Ticket Frame */}
          <div className="max-w-2xl mx-auto rounded-2xl bg-[#0f0f0f] border border-white/15 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dashed border-white/20">
              <div>
                <p className="text-[10px] font-mono uppercase text-zinc-500">KODE BOOKING RESMI</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-mono font-bold text-white tracking-wider">
                    {createdBooking.id}
                  </span>
                  <button
                    type="button"
                    onClick={copyBookingCode}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    title="Salin Kode Booking"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-[10px] font-mono uppercase text-zinc-500">STATUS SESI</p>
                <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {createdBooking.bookingStatus === "pending" ? "Terkonfirmasi (Pending)" : createdBooking.bookingStatus}
                </span>
              </div>
            </div>

            {/* Ticket Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 py-6 text-xs font-mono border-b border-dashed border-white/20">
              <div>
                <p className="text-zinc-500 text-[10px] uppercase">Nama Klien</p>
                <p className="text-white font-semibold mt-0.5">{createdBooking.clientName}</p>
                <p className="text-zinc-400 text-[11px]">{createdBooking.clientPhone}</p>
              </div>

              <div>
                <p className="text-zinc-500 text-[10px] uppercase">Tanggal Sesi</p>
                <p className="text-white font-semibold mt-0.5">{createdBooking.date}</p>
              </div>

              <div>
                <p className="text-zinc-500 text-[10px] uppercase">Jam / Waktu</p>
                <p className="text-[#ff6169] font-bold mt-0.5">{createdBooking.timeSlot}</p>
              </div>

              <div className="col-span-2">
                <p className="text-zinc-500 text-[10px] uppercase">Paket Studio</p>
                <p className="text-white font-medium mt-0.5 line-clamp-1">{createdBooking.roomName}</p>
              </div>

              <div>
                <p className="text-zinc-500 text-[10px] uppercase">Total Biaya</p>
                <p className="text-emerald-400 font-bold text-sm mt-0.5">{formatRupiah(createdBooking.totalPrice)}</p>
              </div>
            </div>

            {/* Payment instruction box */}
            <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-start gap-2.5">
              <Banknote className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white mb-0.5">Metode Pembayaran: Cash di Tempat</p>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  Silakan tunjukkan kode booking ini saat tiba di studio. Pembayaran dilakukan secara tunai (Cash) di kasir sebesar <strong className="text-emerald-400 font-bold">{formatRupiah(createdBooking.totalPrice)}</strong> saat jadwal sesi Anda tiba.
                </p>
              </div>
            </div>

            {/* Ticket Footer Action Buttons */}
            <div className="pt-6 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={getWhatsAppConfirmationUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konfirmasi via WhatsApp Studio</span>
              </a>

              <Link
                href="/admin/bookings"
                className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs uppercase font-medium tracking-wider transition-all flex items-center justify-center gap-2 border border-white/10"
              >
                <span>Lihat di Admin Panel</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setCreatedBooking(null);
                  setSelectedTimeSlot("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white font-mono text-xs uppercase transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Booking Baru</span>
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
