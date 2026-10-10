import fs from 'fs';
import path from 'path';
import {
  StudioUser,
  StudioRoomPricing,
  StudioAddon,
  StudioBooking,
  StudioGalleryItem,
  StudioSpaceItem,
  StudioAboutContent,
  StudioContactSettings,
  BookingExperiencePackage,
} from './types';

interface DatabaseData {
  users: StudioUser[];
  rooms: StudioRoomPricing[];
  addons: StudioAddon[];
  bookings: StudioBooking[];
  gallery: StudioGalleryItem[];
  spaces: StudioSpaceItem[];
  about: StudioAboutContent;
  settings: StudioContactSettings;
  bookingPackages: BookingExperiencePackage[];
}

const initialData: DatabaseData = {
  users: [
    {
      id: 'usr-owner-01',
      name: 'Ratna Kusuma (Owner)',
      email: 'owner@originestudio.com',
      username: 'owner_ratna',
      passcode: 'orig8899',
      password: 'ownerpassword',
      role: 'owner',
      status: 'active',
      phone: '+6285196671398',
      notes: 'Pemilik Studio & Pengarah Utama Origine Studio',
      createdAt: '2026-01-01T08:00:00Z',
      createdBy: 'system',
    },
    {
      id: 'usr-admin-01',
      name: 'Aditya Pratama (Studio Admin)',
      email: 'admin@originestudio.com',
      username: 'admin_studio',
      passcode: 'admin123',
      password: 'adminpassword',
      role: 'admin',
      status: 'active',
      phone: '+6281234567890',
      notes: 'Administrator Operasional & Reservasi',
      createdAt: '2026-01-05T09:00:00Z',
      createdBy: 'usr-owner-01',
    },
    {
      id: 'usr-kasir-01',
      name: 'Siti Rahma (Kasir Studio)',
      email: 'kasir@originestudio.com',
      username: 'kasir_belung',
      passcode: 'kasir77',
      password: 'kasirpassword',
      role: 'kasir',
      status: 'active',
      phone: '+6285233445566',
      notes: 'Kasir Front Office & Konfirmasi Pembayaran',
      createdAt: '2026-01-10T10:00:00Z',
      createdBy: 'usr-admin-01',
    },
    {
      id: 'usr-magang-01',
      name: 'Bima Arya (Kru Magang Visual)',
      email: 'magang@originestudio.com',
      username: 'magang_visual',
      passcode: 'magang2026',
      password: 'magangpassword',
      role: 'magang',
      status: 'active',
      phone: '+6287811223344',
      notes: 'Asisten Studio & Logistik Sesi',
      createdAt: '2026-02-01T11:00:00Z',
      createdBy: 'usr-admin-01',
    },
    {
      id: 'usr-client-01',
      name: 'Clarissa Sutedja',
      email: 'clarissa@vogue.id',
      username: 'klien_clarissa',
      passcode: 'klien123',
      password: 'userpassword',
      role: 'user',
      status: 'active',
      phone: '+6281987654321',
      notes: 'Klien Regular Editorial Mode',
      createdAt: '2026-02-15T14:30:00Z',
      createdBy: 'self-register',
    },
  ],
  rooms: [
    {
      id: 'room-01',
      name: 'Studio 01: Cyclorama Utama',
      code: 'CYC-01',
      dimensions: '180 m² • Cyclorama Lengkung 12m • Plafon 6,2m',
      halfDayPrice: 2500000,
      fullDayPrice: 4500000,
      hourlyRate: 700000,
      description: 'Ruang monumentil dengan cyclorama lengkung tanpa batas untuk pemotretan komersial, fashion, dan grup besar.',
      features: [
        'Motorized overhead lighting truss',
        'Pintu drive-in untuk akses kendaraan',
        'Daya 3-fase industri 63A',
        'Area tethering & mezanin VIP'
      ],
      isActive: true,
    },
    {
      id: 'room-02',
      name: 'Studio 02: Loft Cahaya Alami',
      code: 'LOFT-02',
      dimensions: '140 m² • Jendela Baja 5m Menghadap Utara',
      halfDayPrice: 1800000,
      fullDayPrice: 3200000,
      hourlyRate: 500000,
      description: 'Pencahayaan matahari alami terbaur sepanjang hari dengan tekstur dinding kapur mentah dan lantai microcement.',
      features: [
        'Cahaya alami konsisten arah utara',
        'Dinding microcement dan tekstur bata mentah',
        'Koleksi furnitur seni rupa & pedestal',
        'Stasiun rias MUA terintegrasi'
      ],
      isActive: true,
    },
    {
      id: 'room-03',
      name: 'Studio 03: Ruang Noir & Chiaroscuro',
      code: 'NOIR-03',
      dimensions: '110 m² • Beludru Akustik 360° Kedap Cahaya',
      halfDayPrice: 1500000,
      fullDayPrice: 2800000,
      hourlyRate: 450000,
      description: 'Ruang gelap total Chiaroscuro untuk potret seni rupa berkarakter dramatis dan sinematografi.',
      features: [
        '100% kedap cahaya dengan beludru akustik',
        'Rig pencahayaan overhead presisi',
        'Sistem mesin kabut kabin sinematik',
        'Layar referensi warna kalibrasi HDR'
      ],
      isActive: true,
    },
    {
      id: 'room-self',
      name: 'Self Photo Studio (Origine Express)',
      code: 'SELF-01',
      dimensions: '35 m² • Pro Lighting • Wireless Shutter Clicker • Live Screen',
      halfDayPrice: 40000,
      fullDayPrice: 80000,
      hourlyRate: 40000,
      description: 'Sesi foto mandiri tanpa fotografer dengan lighting studio profesional, wireless shutter clicker, live monitor, dan cetak foto langsung.',
      features: [
        'Kamera Full-Frame & Studio Lighting Otomatis',
        'Wireless Shutter Clicker di tangan',
        'Live Preview Screen 32 inci seketika',
        'Unlimited Shots selama durasi sesi',
        'Cetak foto Polaroid/Strip & High-Res digital file',
      ],
      isActive: true,
    },
  ],
  addons: [
    {
      id: 'addon-01',
      name: 'Broncolor Scoro Powerpack + Para 220 FB',
      price: 650000,
      category: 'lighting',
      desc: 'Reflektor parabolik 2,2m legendaris untuk pencahayaan lembut memeluk siluet subjek.',
      isActive: true,
    },
    {
      id: 'addon-02',
      name: 'Kit Format Menengah Phase One IQ4 150MP',
      price: 1200000,
      category: 'camera',
      desc: 'Kamera beresolusi super tajam dengan lensa Schneider Kreuznach 45mm, 80mm & 150mm.',
      isActive: true,
    },
    {
      id: 'addon-03',
      name: 'Master Operator Digital & Tethering EIZO',
      price: 450000,
      category: 'crew',
      desc: 'Operator tether teknis di lokasi untuk kalibrasi profil warna dan backup simultan.',
      isActive: true,
    },
    {
      id: 'addon-04',
      name: 'Suite VIP Tata Rias & Ruang Busana Desainer',
      price: 300000,
      category: 'space',
      desc: 'Ruang rias privat 3 cermin dengan steamer busana dan gantungan pakaian desainer.',
      isActive: true,
    },
    {
      id: 'addon-05',
      name: 'Lab Analog: Cuci Cetak & Pindai Flextight',
      price: 350000,
      category: 'service',
      desc: 'Pengembangan film format 120 / 35mm C-41 & B/W di hari yang sama dengan pindai resolusi tinggi.',
      isActive: true,
    },
  ],
  bookings: [
    {
      id: 'ORG-2026-001',
      clientName: 'Clarissa Sutedja',
      clientEmail: 'clarissa@vogue.id',
      clientPhone: '+6281987654321',
      roomId: 'room-01',
      roomName: 'Studio 01: Cyclorama Utama',
      date: '2026-10-18',
      timeSlot: 'Pagi (09:00 - 13:00)',
      duration: 'half',
      selectedAddons: [
        { id: 'addon-01', name: 'Broncolor Scoro Powerpack', price: 650000 },
        { id: 'addon-03', name: 'Master Operator Digital', price: 450000 },
      ],
      totalPrice: 3600000,
      depositPaid: 3600000,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      notes: 'Editorial mode lookbook Autumn/Winter 2026.',
      createdAt: '2026-10-08T10:15:00Z',
      handledBy: 'Siti Rahma (Kasir)',
    },
    {
      id: 'ORG-2026-002',
      clientName: 'Biyan Wanaatmadja Studio',
      clientEmail: 'production@biyan.com',
      clientPhone: '+6281122334455',
      roomId: 'room-02',
      roomName: 'Studio 02: Loft Cahaya Alami',
      date: '2026-10-22',
      timeSlot: 'Seharian Penuh (09:00 - 17:00)',
      duration: 'full',
      selectedAddons: [
        { id: 'addon-04', name: 'Suite VIP Tata Rias', price: 300000 },
      ],
      totalPrice: 3500000,
      depositPaid: 1750000,
      paymentStatus: 'dp_paid',
      bookingStatus: 'confirmed',
      notes: 'Pemotretan koleksi busana etnik modern Malang.',
      createdAt: '2026-10-09T14:20:00Z',
      handledBy: 'Aditya Pratama (Admin)',
    },
    {
      id: 'ORG-2026-003',
      clientName: 'Dr. Hendra Gunawan',
      clientEmail: 'hendra.gunawan@gmail.com',
      clientPhone: '+6281399887766',
      roomId: 'room-01',
      roomName: 'Studio 01: Cyclorama Utama',
      date: '2026-10-25',
      timeSlot: 'Sore (14:00 - 18:00)',
      duration: 'half',
      selectedAddons: [],
      totalPrice: 2500000,
      depositPaid: 0,
      paymentStatus: 'unpaid',
      bookingStatus: 'pending',
      notes: 'Sesi foto keluarga & wisuda FK Universitas Brawijaya.',
      createdAt: '2026-10-10T06:45:00Z',
      handledBy: 'Online Booking',
    },
    {
      id: 'ORG-2026-004',
      clientName: 'Lanskap Kopi Malang',
      clientEmail: 'halo@lanskapkopi.id',
      clientPhone: '+6285733221100',
      roomId: 'room-03',
      roomName: 'Studio 03: Ruang Noir & Chiaroscuro',
      date: '2026-10-07',
      timeSlot: 'Pagi (09:00 - 13:00)',
      duration: 'half',
      selectedAddons: [
        { id: 'addon-02', name: 'Kit Format Menengah Phase One', price: 1200000 },
      ],
      totalPrice: 2700000,
      depositPaid: 2700000,
      paymentStatus: 'paid',
      bookingStatus: 'completed',
      notes: 'Foto produk kemasan kopi biji single origin lereng Bromo.',
      createdAt: '2026-10-02T11:00:00Z',
      handledBy: 'Siti Rahma (Kasir)',
    },
  ],
  gallery: [
    {
      id: 'gal-01',
      title: 'Ethereal Silhouette — Koleksi Wol Kasual',
      category: 'Editorial',
      imageUrl: '/images/hero-fashion.jpg',
      photographer: 'Origine Studio Team',
      date: '2026-09-15',
      client: 'Vogue Indonesia',
      featured: true,
      aspectRatio: 'portrait',
    },
    {
      id: 'gal-02',
      title: 'Ruang Tanpa Batas — Cyclorama Set Monumentil',
      category: 'Studio Space',
      imageUrl: '/images/studio-space.jpg',
      photographer: 'Aditya Pratama',
      date: '2026-09-20',
      client: 'Origine Architecture',
      featured: true,
      aspectRatio: 'landscape',
    },
    {
      id: 'gal-03',
      title: 'Chiaroscuro Potret Seni Rupa Monokrom',
      category: 'Fine Art',
      imageUrl: '/images/portrait-art.jpg',
      photographer: 'Ratna Kusuma',
      date: '2026-09-28',
      client: 'Galeri Nasional',
      featured: true,
      aspectRatio: 'portrait',
    },
    {
      id: 'gal-04',
      title: 'Lembayung Poncokusumo — Prewedding Seri Bromo',
      category: 'Portrait',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
      photographer: 'Bima Arya',
      date: '2026-10-02',
      client: 'Arya & Karina',
      featured: true,
      aspectRatio: 'portrait',
    },
  ],
  spaces: [
    {
      id: 'studio-01',
      number: '01',
      name: 'Cyclorama Utama',
      tagline: 'Ruang Monumental Tanpa Batas untuk Kampanye Komersial, Fashion Couture & Produksi Otomotif',
      image: '/images/studio-space.jpg',
      secondaryImage: '/images/hero-fashion.jpg',
      area: '180 m² (1.937 sq ft)',
      ceiling: 'Tinggi Bersih 6,2 meter',
      cove: 'Lengkung Lebar 12m x Kedalaman 9m',
      power: 'Listrik 3-Fase Camlock 63 Ampere',
      hourlyRate: 'Rp 350.000 / jam',
      features: [
        'Sistem motorized truss dengan powerpack Broncolor Scoro',
        'Akses pintu roller drive-in langsung untuk pemotretan mobil/motor',
        'Perlakuan akustik kedap suara untuk perekaman video sinkron',
        'Mezanin VIP privat untuk klien dengan pemandangan ke lantai set',
      ],
      idealFor: [
        'Editorial Mode & Kampanye Brand Internasional',
        'Foto Grup Besar, Wisuda Keluarga & Paduan Suara',
        'Produksi Video Komersial & Musik Klip',
        'Pemotretan Otomotif (Mobil / Moge Masuk Studio)',
      ],
      equipmentIncluded: [
        '4x Broncolor Siros 800 S WiFi Flash Heads',
        '1x Broncolor Para 220 FB Reflector Giant Softbox',
        'Overhead Motorized Truss Rigging System',
        'Kabel Daya Industri Camlock 63A',
      ],
      isActive: true,
    },
    {
      id: 'studio-02',
      number: '02',
      name: 'Loft Cahaya Alami',
      tagline: 'Lingkungan Editorial Alami Disinari Matahari dengan Tekstur Mentah',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
      secondaryImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
      area: '140 m² (1.506 sq ft)',
      ceiling: 'Rangka Kayu Ekspos 5,0m',
      cove: 'Jendela Baja Utara Lantai ke Plafon',
      power: 'Daya Bersih Fase Tunggal 32A',
      hourlyRate: 'Rp 275.000 / jam',
      features: [
        'Cahaya alami baur (diffuse) lembut yang stabil sepanjang hari',
        'Dinding kapur mentah bertekstur, microcement poles & bata bersejarah',
        'Furnitur pilihan desain abad pertengahan & properti pedestal seni rupa',
        'Stasiun tata rias MUA dan penataan rambut bergerak terintegrasi',
      ],
      idealFor: [
        'Potret Intim, Prewedding Alami & Maternity',
        'Katalog Busana Minimalis & Foto Produk Tekstur',
        'Sesi Wawancara Video Cahaya Alami',
        'Karya Seni Rupa Kontemporer',
      ],
      equipmentIncluded: [
        'Koleksi Reflector Sunbounce & Diffuser Scrim 2x2m',
        'Set C-Stand Matthews & Grip Arm Lengkap',
        'Set Dinding Tekstur Portable (Kapur, Kayu & Semen)',
        'Stasiun Rias MUA Berpindah Berlampu Hollywood',
      ],
      isActive: true,
    },
    {
      id: 'studio-03',
      number: '03',
      name: 'Ruang Noir & Lab Kamar Gelap',
      tagline: 'Ruang Gelap Total & Lab Kimia Kamar Gelap Analog',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
      secondaryImage: '/images/portrait-art.jpg',
      area: '110 m² (1.184 sq ft)',
      ceiling: 'Langit-langit Hitam Matte 4,5m',
      cove: 'Tirai Beludru Akustik 360° Penyekat Cahaya',
      power: 'Daya Studio Bersih 32A',
      hourlyRate: 'Rp 250.000 / jam',
      features: [
        '100% kedap cahaya dengan kapabilitas chiaroscuro kontras tinggi',
        'Pemindai drum optik Hasselblad Flextight & lab arsip klise film',
        'Sistem mesin kabut asap atmosferis Rosco & rig proyeksi digital',
        'Suite kalibrasi digital khusus dengan monitor referensi warna 4K HDR',
      ],
      idealFor: [
        'Potret Fine Art Chiaroscuro & Monokrom',
        'Cetak Klise Film Analog Tradisional (Gelatin Silver)',
        'Eksplorasi Proyeksi Visual & Efek Kabut Asap',
        'Color Grading & Proofing Digital Resolusi Ekstrem',
      ],
      equipmentIncluded: [
        '3x Aputure LS 600d Pro Daylight LED (Continuous Light)',
        '1x Aputure Spotlight Mount dengan Shutter Blades',
        'Mesin Kabut Asap Atmosferis Rosco Vapour',
        'Set Flag & Floppy Frame 40x40 Solid Black',
      ],
      isActive: true,
    },
  ],
  about: {
    headline: 'Saat Presisi Optik Bertemu Seni Haute Couture.',
    subheadline: 'Kisah di Balik Origine Studio.',
    storyParagraph1: 'Berawal dari sebuah gagasan sederhana: menciptakan ruang visual di mana waktu seolah melambat, membiarkan cahaya membentuk memori abadi yang tidak pernah lekang oleh pergantian zaman.',
    storyParagraph2: 'Berakar di ketenangan Jl. Raya Belung, Poncokusumo, Malang, studio kami menjadi ruang istimewa untuk mengabadikan momen personal, portofolio editorial, potret keluarga, hingga produksi visual jenama terkemuka.',
    milestones: [
      { label: 'Dedikasi Kualitas', value: '100%' },
      { label: 'Klien Terabadikan', value: '500+' },
      { label: 'Jl. Raya Belung', value: 'Malang' },
    ],
    team: [
      {
        id: 'team-01',
        name: 'Ratna Kusuma',
        role: 'Founder & Creative Director',
        bio: 'Berpengalaman lebih dari 8 tahun dalam fotografi mode editorial dan potret seni rupa. Ratna mendirikan Origine Studio untuk membawa standar visual internasional haute couture ke lanskap budaya Malang yang memesona.',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
        gear: 'Leica SL2-S • Hasselblad 907X',
      },
      {
        id: 'team-02',
        name: 'Aditya Pratama',
        role: 'Lead Photographer & Lighting Master',
        bio: 'Spesialis dalam tata cahaya chiaroscuro kontras tinggi dan sains warna digital. Aditya memastikan setiap kilatan strobo dan pantulan reflektor menangkap dimensi terbaik setiap subjek.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
        gear: 'Phase One IQ4 • Broncolor Scoro Rig',
      },
      {
        id: 'team-03',
        name: 'Dinda Maharani',
        role: 'Art Stylist & Post-Production Lead',
        bio: 'Menjaga keaslian tekstur kulit organik dan gradasi nada warna film abadi dalam setiap berkas arsip master resolusi tinggi yang diserahkan kepada klien.',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
        gear: 'Eizo ColorEdge 4K • Capture One Studio',
      },
    ],
    values: [
      {
        id: 'val-01',
        title: 'Keaslian Tanpa Rekayasa Berlebih',
        desc: 'Kami percaya potret terindah lahir dari emosi yang jujur. Kami menolak teknik filter sintetis murahan yang mengaburkan kepribadian sejati Anda.',
      },
      {
        id: 'val-02',
        title: 'Presisi Cahaya Standar Dunia',
        desc: 'Mengombinasikan kehangatan cahaya matahari alami dengan generator pencahayaan Broncolor dan Profoto berstandar editorial Paris dan Milan.',
      },
      {
        id: 'val-03',
        title: 'Privasi Eksklusif Tanpa Gangguan',
        desc: 'Setiap sesi pemotretan berlangsung tertutup. Tidak ada penonton luar, tidak ada antrean berdesakan—hanya Anda, kru, dan karya seni yang sedang diciptakan.',
      },
      {
        id: 'val-04',
        title: 'Kenyamanan Keramahan Malang',
        desc: 'Suasana sejuk di Jl. Raya Belung, Poncokusumo dengan sajian kopi artisanal lokal menyambut Anda bagaikan ruang tamu sahabat dekat.',
      },
    ],
    clientBrands: [
      'VOGUE',
      'HARPER\'S BAZAAR',
      'ELLE',
      'GQ',
      'L\'OFFICIEL',
      'CARTIER',
      'CHANEL',
      'SAINT LAURENT',
    ],
  },
  settings: {
    brandName: 'Origine Studio',
    tagline: 'Timeless Memories From the Origine',
    phone: '+62 851-9667-1398',
    whatsappNumber: '6285196671398',
    email: 'concierge@origine-studio.my.id',
    addressLine1: 'Jl. Raya Belung, Belung',
    addressSubdistrict: 'Kec. Poncokusumo',
    addressCity: 'Kabupaten Malang, Jawa Timur 65157',
    googleMapsUrl: 'https://maps.app.goo.gl/XUjKjMeSeEBewEgq6',
    operatingHours: '08:00 - 22:00 WIB',
    instagramHandle: '@originestudio',
  },
  bookingPackages: [
    {
      id: 'room-self',
      name: 'Self Photo Studio (Origine Express)',
      badge: 'Paling Populer • Self-Service',
      badgeColor: 'bg-[#720C10] text-white border-[#720C10]/40',
      image: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&w=1200&auto=format&fit=crop',
      basePriceTag: 'Mulai Rp 10.000 / 15 menit',
      description: 'Sesi foto mandiri tanpa fotografer dengan pencahayaan studio profesional, wireless shutter clicker di tangan, dan live monitor 32 inci seketika.',
      durationOptions: [
        { id: 'self-15m', label: '15 Menit', minutes: 15, price: 10000 },
        { id: 'self-30m', label: '30 Menit', minutes: 30, price: 20000, isPopular: true },
        { id: 'self-45m', label: '45 Menit', minutes: 45, price: 30000 },
        { id: 'self-60m', label: '60 Menit (1 Jam)', minutes: 60, price: 40000 },
      ],
      personOptions: [
        { count: 1, label: '1 Orang (Termasuk)', extraPrice: 0 },
        { count: 2, label: '2 Orang (+Rp 5.000)', extraPrice: 5000 },
        { count: 3, label: '3 Orang (+Rp 10.000)', extraPrice: 10000 },
        { count: 4, label: '4 Orang (+Rp 15.000)', extraPrice: 15000 },
        { count: 5, label: '5+ Orang (+Rp 20.000)', extraPrice: 20000 },
      ],
      features: [
        'Kamera Full-Frame & Studio Lighting Otomatis',
        'Wireless Remote Shutter Clicker di tangan',
        'Live Monitor Preview 32 Inci Real-Time',
        'Unlimited Foto selama sesi berlangsung',
        'Termasuk 1 Cetak Foto Strip / Polaroid',
      ],
      isActive: true,
    },
    {
      id: 'room-01',
      name: 'Studio 01: Grand Cyclorama Utama',
      badge: 'Flagship Cyclorama 12m',
      badgeColor: 'bg-purple-900/60 text-purple-200 border-purple-500/30',
      image: '/images/studio-space.jpg',
      basePriceTag: 'Mulai Rp 350.000 / jam',
      description: 'Ruang cyclorama putih lengkung tanpa batas 180 m² dengan plafon 6,2m, motorized overhead lighting truss, dan akses drive-in untuk kendaraan.',
      durationOptions: [
        { id: 'cyc-1h', label: '1 Jam Pemotretan', minutes: 60, price: 350000 },
        { id: 'cyc-2h', label: '2 Jam Pemotretan', minutes: 120, price: 700000, isPopular: true },
        { id: 'cyc-half', label: '4 Jam (Setengah Hari)', minutes: 240, price: 1300000 },
        { id: 'cyc-full', label: '8 Jam (Seharian Penuh)', minutes: 480, price: 2400000 },
      ],
      personOptions: [
        { count: 4, label: '1 - 4 Orang (Termasuk)', extraPrice: 0 },
        { count: 8, label: '5 - 8 Orang (+Rp 50.000)', extraPrice: 50000 },
        { count: 12, label: '9 - 15 Orang (+Rp 100.000)', extraPrice: 100000 },
        { count: 20, label: 'Tim Produksi Besar (+Rp 150.000)', extraPrice: 150000 },
      ],
      features: [
        'Cyclorama lengkung putih 12m tanpa batas',
        'Overhead motorized truss Broncolor',
        'Pintu drive-in untuk akses kendaraan',
        'Daya listrik 3-fase industri 63A',
      ],
      isActive: true,
    },
    {
      id: 'room-02',
      name: 'Studio 02: Loft Cahaya Alami',
      badge: 'Daylight Natural Loft',
      badgeColor: 'bg-amber-900/60 text-amber-200 border-amber-500/30',
      image: '/images/hero-fashion.jpg',
      basePriceTag: 'Mulai Rp 275.000 / jam',
      description: 'Jendela kaca arsitektur 5 meter menghadap utara untuk sebaran cahaya alami terbaur, dinding semen mentah, dan koleksi furnitur seni rupa.',
      durationOptions: [
        { id: 'loft-1h', label: '1 Jam Pemotretan', minutes: 60, price: 275000 },
        { id: 'loft-2h', label: '2 Jam Pemotretan', minutes: 120, price: 550000, isPopular: true },
        { id: 'loft-half', label: '4 Jam (Setengah Hari)', minutes: 240, price: 1000000 },
        { id: 'loft-full', label: '8 Jam (Seharian Penuh)', minutes: 480, price: 1900000 },
      ],
      personOptions: [
        { count: 4, label: '1 - 4 Orang (Termasuk)', extraPrice: 0 },
        { count: 8, label: '5 - 8 Orang (+Rp 40.000)', extraPrice: 40000 },
        { count: 12, label: '9+ Orang (+Rp 80.000)', extraPrice: 80000 },
      ],
      features: [
        'Cahaya matahari alami utara konsisten',
        'Dinding microcement & tekstur bata mentah',
        'Koleksi furnitur seni rupa & pedestal',
        'Stasiun rias MUA privat terintegrasi',
      ],
      isActive: true,
    },
    {
      id: 'room-03',
      name: 'Studio 03: Noir Chiaroscuro & Lab Gelap',
      badge: 'Dark Chiaroscuro 360°',
      badgeColor: 'bg-sky-900/60 text-sky-200 border-sky-500/30',
      image: '/images/portrait-art.jpg',
      basePriceTag: 'Mulai Rp 250.000 / jam',
      description: 'Ruang gelap total Chiaroscuro 100% kedap cahaya dengan beludru akustik hitam pekat, boom lighting presisi, dan mesin kabut kabin sinematik.',
      durationOptions: [
        { id: 'noir-1h', label: '1 Jam Pemotretan', minutes: 60, price: 250000 },
        { id: 'noir-2h', label: '2 Jam Pemotretan', minutes: 120, price: 500000, isPopular: true },
        { id: 'noir-half', label: '4 Jam (Setengah Hari)', minutes: 240, price: 900000 },
        { id: 'noir-full', label: '8 Jam (Seharian Penuh)', minutes: 480, price: 1700000 },
      ],
      personOptions: [
        { count: 3, label: '1 - 3 Orang (Termasuk)', extraPrice: 0 },
        { count: 6, label: '4 - 6 Orang (+Rp 35.000)', extraPrice: 35000 },
        { count: 10, label: '7+ Orang (+Rp 70.000)', extraPrice: 70000 },
      ],
      features: [
        '100% kedap cahaya dengan beludru akustik',
        'Rig pencahayaan overhead presisi',
        'Sistem mesin kabut kabin sinematik',
        'Layar referensi warna kalibrasi HDR',
      ],
      isActive: true,
    },
  ],
};

// File paths for local development and Vercel serverless environment
const isVercel = Boolean(process.env.VERCEL);
const LOCAL_DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');
const VERCEL_TMP_PATH = path.join('/tmp', 'db.json');

// In-memory cache for fast access across function invocations
let inMemoryData: DatabaseData | null = null;

function getActiveDbPath(): string {
  return isVercel ? VERCEL_TMP_PATH : LOCAL_DB_PATH;
}

function ensureDataDir(targetPath: string) {
  try {
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(/*turbopackIgnore: true*/ dir)) {
      fs.mkdirSync(/*turbopackIgnore: true*/ dir, { recursive: true });
    }
  } catch (e) {
    // Read-only filesystem warning on serverless (non-critical, in-memory cache takes over)
    console.warn('Filesystem directory check notice:', e);
  }
}

export function getDatabase(): DatabaseData {
  if (inMemoryData) {
    return inMemoryData;
  }

  const activePath = getActiveDbPath();

  // 1. Try reading from active path (or bundled src/data/db.json)
  const pathsToCheck = [activePath, LOCAL_DB_PATH];
  for (const p of pathsToCheck) {
    try {
      if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
        const content = fs.readFileSync(/*turbopackIgnore: true*/ p, 'utf-8');
        const parsedData: DatabaseData = JSON.parse(content);

        // Ensure defaults are populated if missing from earlier schema versions
        let modified = false;
        if (!parsedData.spaces || parsedData.spaces.length === 0) {
          parsedData.spaces = initialData.spaces;
          modified = true;
        }
        if (!parsedData.about) {
          parsedData.about = initialData.about;
          modified = true;
        }
        if (!parsedData.settings) {
          parsedData.settings = initialData.settings;
          modified = true;
        }
        if (!parsedData.bookingPackages || parsedData.bookingPackages.length === 0) {
          parsedData.bookingPackages = initialData.bookingPackages;
          modified = true;
        }
        if (modified) {
          try {
            fs.writeFileSync(/*turbopackIgnore: true*/ p, JSON.stringify(parsedData, null, 2), 'utf-8');
          } catch (_) {}
        }

        inMemoryData = parsedData;
        return inMemoryData;
      }
    } catch (_) {
      // Continue to next fallback
    }
  }

  // 2. Initialize with default curated studio data
  inMemoryData = JSON.parse(JSON.stringify(initialData));

  // 3. Try to save to active path if writable
  try {
    ensureDataDir(activePath);
    fs.writeFileSync(/*turbopackIgnore: true*/ activePath, JSON.stringify(inMemoryData, null, 2), 'utf-8');
  } catch (e) {
    // Harmless in serverless if filesystem is ephemeral/read-only
    console.warn('Serverless filesystem notice (using in-memory cache):', e);
  }

  return inMemoryData!;
}

export function saveDatabase(data: DatabaseData) {
  inMemoryData = data;
  const activePath = getActiveDbPath();

  try {
    ensureDataDir(activePath);
    fs.writeFileSync(/*turbopackIgnore: true*/ activePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Storage persistence fallback (cached in memory):', e);
  }
}
