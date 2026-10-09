import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="noise-overlay min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-700/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-700/20 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-sky-700/10 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center animate-pulse-glow">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold gradient-text">FotoStudio</span>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors duration-200"
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                Daftar Gratis
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-32">
        <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-purple-300 mb-8 animate-fadeInUp">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block"></span>
          Studio Profesional &bull; 500+ Klien Puas
        </div>

        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 animate-fadeInUp delay-100">
          <span className="text-white">Abadikan Setiap</span>
          <br />
          <span className="gradient-text">Momen Berharga</span>
          <br />
          <span className="text-white">Anda</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed animate-fadeInUp delay-200">
          FotoStudio hadir untuk mengabadikan kenangan indah Anda dengan sentuhan artistik
          dan kualitas profesional. Dari foto pernikahan hingga produk komersial.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp delay-300">
          <Link
            href="/auth/register"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1 inline-flex items-center gap-2"
          >
            Mulai Sekarang
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="#services"
            className="px-8 py-4 glass rounded-2xl text-white font-bold text-lg hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 inline-flex items-center gap-2"
          >
            Lihat Layanan
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 animate-fadeInUp delay-400">
          {[
            { value: "500+", label: "Klien Puas" },
            { value: "5K+", label: "Sesi Foto" },
            { value: "10+", label: "Tahun Pengalaman" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-black gradient-text">{stat.value}</div>
              <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative z-10 px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Layanan <span className="gradient-text">Unggulan</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Kami menyediakan berbagai layanan fotografi profesional sesuai kebutuhan Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "💍",
                title: "Foto Pernikahan",
                desc: "Abadikan momen sakral pernikahan Anda dengan style dokumenter modern dan artistik",
                price: "Mulai Rp 5 Juta",
                gradient: "from-pink-500/20 to-rose-500/20",
                border: "border-pink-500/20",
              },
              {
                icon: "👨‍👩‍👧‍👦",
                title: "Foto Keluarga",
                desc: "Kenangan bersama keluarga yang hangat dan penuh cinta dalam frame yang indah",
                price: "Mulai Rp 1.5 Juta",
                gradient: "from-amber-500/20 to-orange-500/20",
                border: "border-amber-500/20",
              },
              {
                icon: "📦",
                title: "Foto Produk",
                desc: "Tampilkan produk Anda dengan visual yang menawan dan meningkatkan penjualan",
                price: "Mulai Rp 2 Juta",
                gradient: "from-cyan-500/20 to-sky-500/20",
                border: "border-cyan-500/20",
              },
              {
                icon: "🎓",
                title: "Foto Wisuda",
                desc: "Rayakan pencapaian akademis Anda dengan foto wisuda yang elegan dan berkesan",
                price: "Mulai Rp 800 Ribu",
                gradient: "from-purple-500/20 to-violet-500/20",
                border: "border-purple-500/20",
              },
              {
                icon: "👤",
                title: "Foto Portofolio",
                desc: "Bangun portofolio profesional dengan foto headshot berkualitas tinggi",
                price: "Mulai Rp 600 Ribu",
                gradient: "from-green-500/20 to-emerald-500/20",
                border: "border-green-500/20",
              },
              {
                icon: "🎉",
                title: "Foto Event",
                desc: "Dokumentasi acara perusahaan, peluncuran produk, dan berbagai event korporat",
                price: "Mulai Rp 3 Juta",
                gradient: "from-indigo-500/20 to-blue-500/20",
                border: "border-indigo-500/20",
              },
            ].map((service) => (
              <div
                key={service.title}
                className={`p-6 rounded-2xl bg-gradient-to-br ${service.gradient} border ${service.border} backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-white font-bold text-xl mb-2">{service.title}</h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{service.desc}</p>
                <div className="text-purple-400 font-semibold text-sm">{service.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="relative z-10 px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Apa Kata <span className="gradient-text">Klien Kami</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Amelia",
                role: "Pengantin",
                text: "Hasil foto pernikahan kami sangat memuaskan! Tim FotoStudio sangat profesional dan ramah. Setiap momen berhasil diabadikan dengan sempurna.",
                rating: 5,
                avatar: "SA",
              },
              {
                name: "Budi Santoso",
                role: "Pemilik Toko Online",
                text: "Foto produk dari FotoStudio benar-benar meningkatkan penjualan kami. Kualitas visual yang luar biasa dengan harga yang sangat terjangkau.",
                rating: 5,
                avatar: "BS",
              },
              {
                name: "Rina Putri",
                role: "Fresh Graduate",
                text: "Foto wisuda saya terlihat sangat elegan dan profesional. Sangat puas dengan hasilnya! Pasti akan merekomendasikan ke teman-teman.",
                rating: 5,
                avatar: "RP",
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="glass p-6 rounded-2xl hover:border-purple-500/30 transition-colors duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-slate-400 text-xs">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 md:px-12 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl glass border border-purple-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Siap Membuat <span className="gradient-text">Kenangan Indah</span>?
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                Daftar sekarang dan dapatkan konsultasi gratis untuk sesi foto pertama Anda
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/register"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1 inline-flex items-center justify-center gap-2"
                >
                  Daftar Gratis Sekarang
                </Link>
                <Link
                  href="/auth/login"
                  className="px-8 py-4 glass rounded-2xl text-white font-bold text-lg hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 inline-flex items-center justify-center gap-2"
                >
                  Sudah Punya Akun? Masuk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 md:px-12 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-bold gradient-text">FotoStudio</span>
          </div>
          <p className="text-slate-500 text-sm">
            &copy; 2026 FotoStudio. Semua hak dilindungi.
          </p>
        </div>
      </footer>
    </main>
  );
}
