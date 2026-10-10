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
  Phone,
  Mail,
  User,
  Info,
  DollarSign,
  Layers,
  MapPin,
  RotateCcw,
} from "lucide-react";
import {
  StudioBooking,
  StaffSession,
  BookingExperiencePackage,
  DurationOption,
  PersonOption,
} from "@/lib/types";

export const BOOKING_PACKAGES: BookingExperiencePackage[] = [
  {
    id: "room-self",
    name: "Self Photo Studio (Origine Express)",
    badge: "Paling Populer • Self-Service",
    badgeColor: "bg-[#720C10] text-white border-[#720C10]/40",
    image: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&w=1200&auto=format&fit=crop",
    basePriceTag: "Mulai Rp 10.000 / 15 menit",
    description:
      "Sesi foto mandiri tanpa fotografer dengan pencahayaan studio profesional, wireless shutter clicker di tangan, dan live monitor 32 inci seketika.",
    durationOptions: [
      { id: "self-15m", label: "15 Menit", minutes: 15, price: 10000 },
      { id: "self-30m", label: "30 Menit", minutes: 30, price: 20000, isPopular: true },
      { id: "self-45m", label: "45 Menit", minutes: 45, price: 30000 },
      { id: "self-60m", label: "60 Menit (1 Jam)", minutes: 60, price: 40000 },
    ],
    personOptions: [
      { count: 1, label: "1 Orang (Termasuk)", extraPrice: 0 },
      { count: 2, label: "2 Orang (+Rp 5.000)", extraPrice: 5000 },
      { count: 3, label: "3 Orang (+Rp 10.000)", extraPrice: 10000 },
      { count: 4, label: "4 Orang (+Rp 15.000)", extraPrice: 15000 },
      { count: 5, label: "5+ Orang (+Rp 20.000)", extraPrice: 20000 },
    ],
    features: [
      "Kamera Full-Frame & Studio Lighting Otomatis",
      "Wireless Remote Shutter Clicker di tangan",
      "Live Monitor Preview 32 Inci Real-Time",
      "Unlimited Foto selama sesi berlangsung",
      "Termasuk 1 Cetak Foto Strip / Polaroid",
    ],
  },
  {
    id: "room-01",
    name: "Studio 01: Grand Cyclorama Utama",
    badge: "Flagship Cyclorama 12m",
    badgeColor: "bg-purple-900/60 text-purple-200 border-purple-500/30",
    image: "/images/studio-space.jpg",
    basePriceTag: "Mulai Rp 350.000 / jam",
    description:
      "Ruang cyclorama putih lengkung tanpa batas 180 m² dengan plafon 6,2m, motorized overhead lighting truss, dan akses drive-in untuk kendaraan.",
    durationOptions: [
      { id: "cyc-1h", label: "1 Jam Pemotretan", minutes: 60, price: 350000 },
      { id: "cyc-2h", label: "2 Jam Pemotretan", minutes: 120, price: 700000, isPopular: true },
      { id: "cyc-half", label: "4 Jam (Setengah Hari)", minutes: 240, price: 1300000 },
      { id: "cyc-full", label: "8 Jam (Seharian Penuh)", minutes: 480, price: 2400000 },
    ],
    personOptions: [
      { count: 4, label: "1 - 4 Orang (Termasuk)", extraPrice: 0 },
      { count: 8, label: "5 - 8 Orang (+Rp 50.000)", extraPrice: 50000 },
      { count: 12, label: "9 - 15 Orang (+Rp 100.000)", extraPrice: 100000 },
      { count: 20, label: "Tim Produksi Besar (+Rp 150.000)", extraPrice: 150000 },
    ],
    features: [
      "Cyclorama lengkung putih 12m tanpa batas",
      "Overhead motorized truss Broncolor",
      "Pintu drive-in untuk akses kendaraan",
      "Daya listrik 3-fase industri 63A",
    ],
  },
  {
    id: "room-02",
    name: "Studio 02: Loft Cahaya Alami",
    badge: "Daylight Natural Loft",
    badgeColor: "bg-amber-900/60 text-amber-200 border-amber-500/30",
    image: "/images/hero-fashion.jpg",
    basePriceTag: "Mulai Rp 275.000 / jam",
    description:
      "Jendela kaca arsitektur 5 meter menghadap utara untuk sebaran cahaya alami terbaur, dinding semen mentah, dan koleksi furnitur seni rupa.",
    durationOptions: [
      { id: "loft-1h", label: "1 Jam Pemotretan", minutes: 60, price: 275000 },
      { id: "loft-2h", label: "2 Jam Pemotretan", minutes: 120, price: 550000, isPopular: true },
      { id: "loft-half", label: "4 Jam (Setengah Hari)", minutes: 240, price: 1000000 },
      { id: "loft-full", label: "8 Jam (Seharian Penuh)", minutes: 480, price: 1900000 },
    ],
    personOptions: [
      { count: 4, label: "1 - 4 Orang (Termasuk)", extraPrice: 0 },
      { count: 8, label: "5 - 8 Orang (+Rp 40.000)", extraPrice: 40000 },
      { count: 12, label: "9+ Orang (+Rp 80.000)", extraPrice: 80000 },
    ],
    features: [
      "Cahaya matahari alami utara konsisten",
      "Dinding microcement & tekstur bata mentah",
      "Koleksi furnitur seni rupa & pedestal",
      "Stasiun rias MUA privat terintegrasi",
    ],
  },
  {
    id: "room-03",
    name: "Studio 03: Noir Chiaroscuro & Lab Gelap",
    badge: "Dark Chiaroscuro 360°",
    badgeColor: "bg-sky-900/60 text-sky-200 border-sky-500/30",
    image: "/images/portrait-art.jpg",
    basePriceTag: "Mulai Rp 250.000 / jam",
    description:
      "Ruang gelap total Chiaroscuro 100% kedap cahaya dengan beludru akustik hitam pekat, boom lighting presisi, dan mesin kabut kabin sinematik.",
    durationOptions: [
      { id: "noir-1h", label: "1 Jam Pemotretan", minutes: 60, price: 250000 },
      { id: "noir-2h", label: "2 Jam Pemotretan", minutes: 120, price: 500000, isPopular: true },
      { id: "noir-half", label: "4 Jam (Setengah Hari)", minutes: 240, price: 900000 },
      { id: "noir-full", label: "8 Jam (Seharian Penuh)", minutes: 480, price: 1700000 },
    ],
    personOptions: [
      { count: 3, label: "1 - 3 Orang (Termasuk)", extraPrice: 0 },
      { count: 6, label: "4 - 6 Orang (+Rp 35.000)", extraPrice: 35000 },
      { count: 10, label: "7+ Orang (+Rp 70.000)", extraPrice: 70000 },
    ],
    features: [
      "100% kedap cahaya dengan beludru akustik",
      "Rig pencahayaan overhead presisi",
      "Sistem mesin kabut kabin sinematik",
      "Layar referensi warna kalibrasi HDR",
    ],
  },
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

export default function StudioBookingExperience() {
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
  const [activePackageId, setActivePackageId] = useState<string>("room-self");

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
  const [paymentOption, setPaymentOption] = useState<"full" | "dp" | "on_spot">("dp");

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

  // Calculate live price for a package
  const calculatePackagePrice = (pkg: BookingExperiencePackage) => {
    const durId = selectedDurationByPkg[pkg.id] || pkg.durationOptions[0].id;
    const durOpt = pkg.durationOptions.find((d) => d.id === durId) || pkg.durationOptions[0];

    const pCount = selectedPersonByPkg[pkg.id] ?? pkg.personOptions[0].count;
    const pOpt = pkg.personOptions.find((p) => p.count === pCount) || pkg.personOptions[0];

    return durOpt.price + pOpt.extraPrice;
  };

  const currentTotalPrice = useMemo(() => {
    return calculatePackagePrice(activePackage);
  }, [activePackage, activeDurationOption, activePersonOption]);

  const depositAmount = useMemo(() => {
    if (activePackage.id === "room-self") {
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
    if (activePackage.id === "room-self") {
      // 15-minute / 30-minute self photo slots
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
      const depositPaid = paymentOption === "full" ? currentTotalPrice : paymentOption === "dp" ? depositAmount : 0;
      const paymentStatus = paymentOption === "full" ? "paid" : paymentOption === "dp" ? "dp_paid" : "unpaid";

      const bookingPayload = {
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim(),
        roomId: activePackage.id,
        roomName: `${activePackage.name} (${activeDurationOption.label}, ${activePersonOption.label})`,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        duration: activePackage.id === "room-self" ? "hourly" : activeDurationOption.minutes >= 480 ? "full" : "half",
        totalPrice: currentTotalPrice,
        depositPaid,
        paymentStatus,
        notes: `Durasi: ${activeDurationOption.label} | Peserta: ${activePersonOption.label}${clientNotes ? ` | Catatan: ${clientNotes.trim()}` : ""}`,
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
    const text = encodeURIComponent(
      `Halo Origine Studio Malang, saya baru saja melakukan reservasi sesi studio online:\n\n` +
        `• Kode Booking: ${createdBooking.id}\n` +
        `• Nama: ${createdBooking.clientName}\n` +
        `• Paket: ${createdBooking.roomName}\n` +
        `• Tanggal: ${createdBooking.date}\n` +
        `• Jam: ${createdBooking.timeSlot}\n` +
        `• Total Biaya: ${formatRupiah(createdBooking.totalPrice)}\n` +
        `• Status Bayar: ${createdBooking.paymentStatus === "paid" ? "Lunas" : createdBooking.paymentStatus === "dp_paid" ? `DP ${formatRupiah(createdBooking.depositPaid)}` : "Bayar di Studio"}\n\n` +
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
      <section id="step-packages" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#ff6169] font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-[#720C10]" />
              LANGKAH 01 // PILIH PAKET STUDIO & KONFIGURASI
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-white font-light">
              Pilihan Paket <span className="italic font-serif-italic">Studio & Self-Photo</span>
            </h2>
          </div>
          <p className="text-xs font-mono text-zinc-400">
            Tersedia opsi durasi menit/jam dan kapasitas orang di setiap kartu.
          </p>
        </div>

        {/* The Experience Cards Grid (Dynamic from Admin) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {packages.map((pkg) => {
            const isSelected = activePackageId === pkg.id;
            const currentDurId = selectedDurationByPkg[pkg.id] || pkg.durationOptions[0].id;
            const currentDur = pkg.durationOptions.find((d) => d.id === currentDurId) || pkg.durationOptions[0];
            const currentPersonCount = selectedPersonByPkg[pkg.id] ?? pkg.personOptions[0].count;
            const cardPrice = calculatePackagePrice(pkg);

            return (
              <div
                key={pkg.id}
                className={`group rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-2xl relative ${
                  isSelected
                    ? "bg-[#161616] border-[#ff6169] ring-2 ring-[#720C10]/80 shadow-[#720C10]/20"
                    : "bg-[#121212] border-white/10 hover:border-white/20 hover:bg-[#141414]"
                }`}
              >
                {/* Image Header with Badge */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
                  <Image
                    src={pkg.image}
                    alt={pkg.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={pkg.id === "room-self" || pkg.id === "room-01"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/30 to-black/50 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-semibold border backdrop-blur-md ${pkg.badgeColor}`}>
                      {pkg.badge}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-zinc-300 border border-white/10 text-[10px]">
                      {pkg.basePriceTag}
                    </span>
                  </div>

                  {/* Bottom Image Title */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl sm:text-2xl font-serif text-white font-medium drop-shadow-md">
                      {pkg.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 space-y-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      {pkg.description}
                    </p>

                    {/* Features checklist */}
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5">
                      {pkg.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                          <Check className="w-3.5 h-3.5 text-[#ff6169] shrink-0" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DROPDOWN CONTROLS: DURASI & JUMLAH ORANG (Sesuai Permintaan User) */}
                  <div className="pt-5 border-t border-white/10 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Dropdown 1: Berapa Menit / Durasi */}
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5 flex items-center gap-1.5 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-[#ff6169]" />
                          <span>Pilih Durasi</span>
                        </label>
                        <div className="relative">
                          <select
                            value={currentDurId}
                            onChange={(e) => {
                              setSelectedDurationByPkg((prev) => ({
                                ...prev,
                                [pkg.id]: e.target.value,
                              }));
                            }}
                            className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#ff6169] transition-colors cursor-pointer pr-8"
                          >
                            {pkg.durationOptions.map((opt) => (
                              <option key={opt.id} value={opt.id} className="bg-zinc-900 text-white">
                                {opt.label} — {formatRupiah(opt.price)}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* Dropdown 2: Berapa Orang */}
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5 flex items-center gap-1.5 font-semibold">
                          <Users className="w-3.5 h-3.5 text-[#ff6169]" />
                          <span>Jumlah Orang</span>
                        </label>
                        <div className="relative">
                          <select
                            value={currentPersonCount}
                            onChange={(e) => {
                              setSelectedPersonByPkg((prev) => ({
                                ...prev,
                                [pkg.id]: Number(e.target.value),
                              }));
                            }}
                            className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#ff6169] transition-colors cursor-pointer pr-8"
                          >
                            {pkg.personOptions.map((p) => (
                              <option key={p.count} value={p.count} className="bg-zinc-900 text-white">
                                {p.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* LIVE PRICE SUMMARY & BOOKING ACTION BUTTON */}
                    <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                          Estimasi Biaya Sesi
                        </p>
                        <p className="text-xl font-syne font-bold text-white flex items-center gap-1.5">
                          <span className="text-[#ff6169]">{formatRupiah(cardPrice)}</span>
                          <span className="text-[11px] font-mono text-zinc-400 font-normal">
                            ({currentDur.label})
                          </span>
                        </p>
                      </div>

                      {/* Tombol Booking yang mengarahkan kebawahnya (Step Tanggal) */}
                      <button
                        type="button"
                        onClick={() => handleSelectPackage(pkg.id)}
                        className={`px-5 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 ${
                          isSelected
                            ? "bg-[#720C10] hover:bg-[#8e0e14] text-white shadow-[#720C10]/40 ring-1 ring-white/20"
                            : "bg-white/10 hover:bg-[#720C10] text-zinc-200 hover:text-white border border-white/15 hover:border-[#720C10]"
                        }`}
                      >
                        <span>{isSelected ? "Paket Terpilih • Lanjut" : "Booking Sesi Ini"}</span>
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentOption("dp")}
                  className={`p-3 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer ${
                    paymentOption === "dp"
                      ? "bg-[#720C10]/20 border-[#ff6169] text-white"
                      : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="font-bold block text-white">Deposit / DP</span>
                  <span className="text-[11px] text-[#ff6169] block mt-0.5">{formatRupiah(depositAmount)}</span>
                  <span className="text-[10px] text-zinc-500 block">Sisa bayar di kasir studio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentOption("full")}
                  className={`p-3 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer ${
                    paymentOption === "full"
                      ? "bg-[#720C10]/20 border-[#ff6169] text-white"
                      : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="font-bold block text-white">Pelunasan Penuh</span>
                  <span className="text-[11px] text-emerald-400 block mt-0.5">{formatRupiah(currentTotalPrice)}</span>
                  <span className="text-[10px] text-zinc-500 block">Bebas antrean pembayaran</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentOption("on_spot")}
                  className={`p-3 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer ${
                    paymentOption === "on_spot"
                      ? "bg-[#720C10]/20 border-[#ff6169] text-white"
                      : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="font-bold block text-white">Bayar di Studio</span>
                  <span className="text-[11px] text-amber-300 block mt-0.5">On-The-Spot</span>
                  <span className="text-[10px] text-zinc-500 block">Cash / QRIS saat tiba</span>
                </button>
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
