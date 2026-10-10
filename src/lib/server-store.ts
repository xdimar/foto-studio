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
        "id": "add-tambah-orang",
        "name": "Tambah Orang",
        "price": 10000,
        "category": "service",
        "desc": "Penambahan 1 orang ekstra dalam sesi pemotretan",
        "isActive": true
    },
    {
        "id": "add-tambah-edit",
        "name": "Tambah Editing Foto (Tone Warna)",
        "price": 5000,
        "category": "service",
        "desc": "Penambahan edit tone warna profesional per foto",
        "isActive": true
    },
    {
        "id": "add-tambah-durasi",
        "name": "Tambah Durasi Waktu (5 Menit)",
        "price": 10000,
        "category": "service",
        "desc": "Perpanjangan waktu sesi foto per 5 menit",
        "isActive": true
    },
    {
        "id": "add-tambah-bg",
        "name": "Tambah Background",
        "price": 20000,
        "category": "service",
        "desc": "Ganti atau tambah 1 latar background warna/tekstur lain",
        "isActive": true
    },
    {
        "id": "add-cetak-4r",
        "name": "Cetak Foto 4R",
        "price": 7000,
        "category": "print",
        "desc": "Cetak foto berkualitas tinggi ukuran 4R (10 x 15 cm)",
        "isActive": true
    },
    {
        "id": "add-cetak-10rs",
        "name": "Cetak Foto 10Rs",
        "price": 15000,
        "category": "print",
        "desc": "Cetak foto tajam ukuran 10Rs (25 x 35 cm)",
        "isActive": true
    },
    {
        "id": "add-cetak-12rs-basic",
        "name": "Cetak Foto 12Rs (Basic)",
        "price": 50000,
        "category": "print",
        "desc": "Cetak foto ukuran 12Rs standar",
        "isActive": true
    },
    {
        "id": "add-cetak-12rs-prem",
        "name": "Cetak Foto 12Rs (Premium)",
        "price": 90000,
        "category": "print",
        "desc": "Cetak foto ukuran 12Rs kertas fine art premium",
        "isActive": true
    },
    {
        "id": "add-cetak-16rs",
        "name": "Cetak Foto 16Rs",
        "price": 130000,
        "category": "print",
        "desc": "Cetak foto ukuran besar 16Rs (40 x 60 cm)",
        "isActive": true
    },
    {
        "id": "add-cetak-20rs",
        "name": "Cetak Foto 20Rs",
        "price": 150000,
        "category": "print",
        "desc": "Cetak foto galeri ukuran 20Rs (50 x 75 cm)",
        "isActive": true
    },
    {
        "id": "add-cetak-24rs",
        "name": "Cetak Foto 24Rs",
        "price": 160000,
        "category": "print",
        "desc": "Cetak foto format besar 24Rs (60 x 90 cm)",
        "isActive": true
    },
    {
        "id": "add-polaroid-2r",
        "name": "Cetak Polaroid 2R (9 Polaroid)",
        "price": 18000,
        "category": "print",
        "desc": "Paket 9 lembar foto cetak gaya Polaroid mini ukuran 2R",
        "isActive": true
    },
    {
        "id": "add-polaroid-strip-3",
        "name": "Cetak Polaroid Strip isi 3 (2 Strip - 6 Foto)",
        "price": 8000,
        "category": "print",
        "desc": "2 lembar photostrip dengan total 6 foto",
        "isActive": true
    },
    {
        "id": "add-polaroid-strip-4",
        "name": "Cetak Polaroid Strip isi 4 (2 Strip - 8 Foto)",
        "price": 10000,
        "category": "print",
        "desc": "2 lembar photostrip dengan total 8 foto",
        "isActive": true
    },
    {
        "id": "add-polaroid-strip-5",
        "name": "Cetak Polaroid Strip isi 5 (4 Strip - 20 Foto)",
        "price": 20000,
        "category": "print",
        "desc": "4 lembar photostrip dengan total 20 foto",
        "isActive": true
    },
    {
        "id": "add-polaroid-4r-1",
        "name": "Polaroid 4R isi 1 Foto",
        "price": 7000,
        "category": "print",
        "desc": "1 lembar foto ukuran 4R bergaya bingkai Polaroid",
        "isActive": true
    },
    {
        "id": "add-polaroid-4r-4",
        "name": "Polaroid 4R isi 4 Foto Collage",
        "price": 10000,
        "category": "print",
        "desc": "1 lembar foto 4R dengan kolase 4 foto estetik",
        "isActive": true
    },
    {
        "id": "add-figura-10rs",
        "name": "Figura 10Rs",
        "price": 30000,
        "category": "frame",
        "desc": "Bingkai foto minimalis modern ukuran 10Rs",
        "isActive": true
    },
    {
        "id": "add-figura-12rs",
        "name": "Figura 12Rs",
        "price": 50000,
        "category": "frame",
        "desc": "Bingkai foto minimalis modern ukuran 12Rs",
        "isActive": true
    },
    {
        "id": "add-figura-16rs",
        "name": "Figura 16Rs",
        "price": 100000,
        "category": "frame",
        "desc": "Bingkai foto elegan kokoh ukuran 16Rs",
        "isActive": true
    },
    {
        "id": "add-figura-20rs",
        "name": "Figura 20Rs",
        "price": 120000,
        "category": "frame",
        "desc": "Bingkai foto display galeri ukuran 20Rs",
        "isActive": true
    },
    {
        "id": "add-figura-24rs",
        "name": "Figura 24Rs",
        "price": 150000,
        "category": "frame",
        "desc": "Bingkai foto mahakarya display ukuran 24Rs",
        "isActive": true
    },
    {
        "id": "add-album-10",
        "name": "Album 10 Sheet (Halaman)",
        "price": 75000,
        "category": "album",
        "desc": "Album hardcover eksklusif kapasitas 10 sheet",
        "isActive": true
    },
    {
        "id": "add-album-20",
        "name": "Album 20 Sheet (Halaman)",
        "price": 150000,
        "category": "album",
        "desc": "Album hardcover eksklusif kapasitas 20 sheet",
        "isActive": true
    }
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
  if (inMemoryData && isVercel) {
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
