"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- SINKRONISASI STATUS LOGIN ---
  useEffect(() => {
    const session = localStorage.getItem('cikoyou_session');
    if (session) {
      setIsLoggedIn(true);
    }
    setIsLoaded(true);
  }, []);

  // Tampilan loading sementara yang senada
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#1F0303] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#4A0D0D] border-t-[#D4A373] rounded-full animate-spin"></div>
        <div className="text-[#D4A373] font-bold tracking-[0.2em] uppercase text-sm animate-pulse">
          Memuat Cikoyou...
        </div>
      </div>
    );
  }

  return (
    // BACKGROUND UTAMA: Deep Crimson Velvet (Merah beludru tua yang elegan & sangat aman di mata)
    <div className="min-h-screen bg-[#1F0303] text-[#F5E6D3] font-sans selection:bg-[#801414] selection:text-white antialiased relative overflow-hidden">
      
      {/* 🌟 LUXURIOUS VELVET TEXTURE & GLOW SHADOWS */}
      {/* Pendaran merah ruby di tengah */}
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[80vw] h-[80vw] max-w-[800px] bg-[#801414]/25 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
      {/* Pendaran emas mawar di sudut bawah */}
      <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[#D4A373]/10 rounded-full blur-[120px] pointer-events-none" />
      {/* Pendaran gelap di sudut kiri */}
      <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-[#4A0D0D]/30 rounded-full blur-[100px] pointer-events-none" />

      {/* NAVBAR: Kapsul Transparan dengan Aksen Emas Mawar */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-full bg-[#2C0707]/60 backdrop-blur-2xl border border-[#5C1414] shadow-[0_10px_40px_rgba(0,0,0,0.6)] transition-all duration-300 hover:bg-[#2C0707]/80">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="p-0.5 bg-[#4A0D0D] rounded-full border border-[#D4A373]/30">
              <Image 
                src="/fotocikoyou.png" 
                alt="Logo Cikoyou" 
                width={34} 
                height={34} 
                className="rounded-full object-cover group-hover:rotate-[360deg] transition-transform duration-1000" 
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-lg font-black tracking-widest text-white leading-none">CIKOYOU</h1>
              <p className="text-[8px] tracking-[0.2em] text-[#ffeed8] font-bold uppercase mt-0.5">E-Commerce</p>
            </div>
          </Link>

          {/* Menu Navigasi Tengah */}
          <nav className="hidden md:flex items-center gap-8 bg-black/30 px-6 py-2 rounded-full border border-[#4A0D0D]">
            <Link href="/" className="text-xs font-bold text-white tracking-wider">Home</Link>
            <Link href="/order" className="text-xs font-medium text-[#ffeed8] hover:text-[#D4A373] tracking-wider transition-colors">Order</Link>
            <Link href="/contact" className="text-xs font-medium text-[#ffeed8] hover:text-[#D4A373] tracking-wider transition-colors">Contact</Link>
          </nav>

          {/* Tombol Login/Dashboard Dinamis */}
          <div>
            {!isLoggedIn ? (
              <Link href="/account" className="px-5 py-2 bg-[#D4A373] text-[#1F0303] hover:bg-[#E5B283] font-bold text-xs uppercase tracking-wider rounded-full transition-all flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95">
                <span>Masuk</span>
                <span className="bg-[#1F0303]/10 rounded-full w-4 h-4 flex items-center justify-center text-[8px]">➔</span>
              </Link>
            ) : (
              <Link href="/account" className="px-5 py-2 bg-[#801414] hover:bg-[#A61C1C] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all border border-[#9E2323] shadow-lg hover:scale-105 active:scale-95">
                Akun Saya
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative max-w-6xl mx-auto px-6 pt-40 pb-20 flex flex-col md:flex-row items-center justify-between gap-12 z-10 min-h-[90vh]">
        
        {/* Teks Kiri */}
        <div className="flex-1 text-center md:text-left space-y-8 z-20">
          <div className="inline-flex items-center gap-2 bg-[#801414]/20 border border-[#A61C1C]/40 px-4 py-2 rounded-full backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4A373] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4A373]"></span>
            </span>
            <span className="text-[10px] font-bold text-[#ffeed8] tracking-[0.2em] uppercase">Cita Rasa Premium Balikpapan</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-white">
            Gurihnya <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A373] via-white to-[#D4A373] bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
              Cireng
            </span> <br />
            Untuk Kamu.
          </h2>
          
          <p className="text-base text-[#ffeed8] leading-relaxed max-w-lg mx-auto md:mx-0 font-medium">
            Rasakan sensasi jajanan tradisional yang naik kelas. Dibuat dari bahan pilihan, isian melimpah, dan kerenyahan yang bikin nagih di setiap gigitan.
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/product" className="px-8 py-4 bg-gradient-to-r from-[#801414] to-[#4A0D0D] hover:from-[#A61C1C] hover:to-[#5C1414] text-white font-bold text-sm rounded-2xl uppercase tracking-widest shadow-[0_10px_30px_rgba(128,20,20,0.4)] transition-all active:scale-95 text-center flex items-center justify-center gap-2 border border-[#A61C1C]/30">
              Lihat Menu <span>↗</span>
            </Link>
            <Link href="/about" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-[#5C1414] text-white font-bold text-sm rounded-2xl uppercase tracking-widest transition-all text-center backdrop-blur-md active:scale-95">
              Cerita Cikoyou
            </Link>
          </div>
        </div>

        {/* Gambar Kanan (Centerpiece Cireng) */}
        <div className="flex-1 relative w-full max-w-lg aspect-square flex justify-center items-center">
          <div className="absolute w-[80%] h-[80%] bg-gradient-to-tr from-[#801414]/30 to-[#D4A373]/20 rounded-full blur-3xl animate-pulse"></div>
          <Image 
            src="/fotocikoyou.png" 
            alt="Cireng Premium Cikoyou"
            fill
            className="object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.8)] hover:scale-105 hover:-translate-y-2 transition-all duration-700 z-10"
          />
        </div>
      </section>

      {/* 2. SECTION KEUNGGULAN (Bento Grid Deep Velvet) */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Bukan Cireng Biasa</h3>
          <p className="text-sm text-[#ffeed8] font-medium tracking-wide">Kualitas adalah prioritas utama dapur Cikoyou.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kartu 1 */}
          <div className="group bg-[#2C0707]/40 border border-[#4A0D0D] p-8 rounded-[2.5rem] hover:border-[#D4A373]/40 hover:bg-[#3D0A0A]/50 transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm">
            <div className="w-14 h-14 bg-[#1F0303] rounded-2xl flex items-center justify-center text-2xl mb-6 border border-[#4A0D0D] group-hover:scale-110 transition-transform duration-300">⭐</div>
            <h4 className="text-xl font-bold text-white mb-3">Bahan Premium</h4>
            <p className="text-sm text-[#ffeed8] leading-relaxed">Menggunakan tepung tapioka terbaik dan daging ayam segar pilihan tanpa pengawet.</p>
          </div>

          {/* Kartu 2 */}
          <div className="group bg-[#2C0707]/40 border border-[#4A0D0D] p-8 rounded-[2.5rem] hover:border-[#D4A373]/40 hover:bg-[#3D0A0A]/50 transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm">
            <div className="w-14 h-14 bg-[#1F0303] rounded-2xl flex items-center justify-center text-2xl mb-6 border border-[#4A0D0D] group-hover:scale-110 transition-transform duration-300">🔥</div>
            <h4 className="text-xl font-bold text-white mb-3">Isian Melimpah</h4>
            <p className="text-sm text-[#ffeed8] leading-relaxed">Nikmati sensasi daging ayam rica-rica dan keju lumer yang padat di setiap gigitan.</p>
          </div>

          {/* Kartu 3 */}
          <div className="group bg-[#2C0707]/40 border border-[#4A0D0D] p-8 rounded-[2.5rem] hover:border-[#D4A373]/40 hover:bg-[#3D0A0A]/50 transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm">
            <div className="w-14 h-14 bg-[#1F0303] rounded-2xl flex items-center justify-center text-2xl mb-6 border border-[#4A0D0D] group-hover:scale-110 transition-transform duration-300">💯</div>
            <h4 className="text-xl font-bold text-white mb-3">100% Halal & Bersih</h4>
            <p className="text-sm text-[#ffeed8] leading-relaxed">Diproses di dapur yang sangat menjaga standar kebersihan dan dijamin kehalalannya.</p>
          </div>
        </div>
      </section>

      {/* 3. SECTION MENU FAVORIT (Modern Horizontal Cards) */}
      <section className="relative z-10 py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Menu Andalan</h3>
            <p className="text-sm text-[#ffeed8] font-medium">Favorit pelanggan setia Cikoyou.</p>
          </div>
          <Link href="/product" className="group text-sm font-bold text-white tracking-widest uppercase flex items-center gap-3 py-2 px-6 rounded-full border border-[#4A0D0D] bg-[#2C0707]/60 hover:bg-[#D4A373] hover:text-[#1F0303] transition-all">
            Semua Menu <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card Menu 1 */}
          <div className="group relative overflow-hidden bg-[#2C0707]/30 border border-[#4A0D0D] rounded-[2.5rem] p-3 pr-8 flex items-center gap-6 hover:border-[#D4A373]/30 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <div className="w-32 h-32 md:w-40 md:h-40 relative flex-shrink-0 bg-black/40 rounded-[2rem] p-3 border border-[#4A0D0D] group-hover:scale-105 transition-transform duration-500">
              <Image src="/cirengayamm.png" alt="Cireng Ayam" fill className="object-contain drop-shadow-xl p-2" />
            </div>
            <div className="flex-1 py-4">
              <div className="inline-block px-2.5 py-1 rounded-md bg-[#D4A373]/10 border border-[#D4A373]/20 text-[9px] font-bold tracking-widest text-ambar-300 uppercase mb-3">
                Best Seller
              </div>
              <h4 className="text-xl md:text-2xl font-bold text-white mb-1">Cireng Ayam</h4>
              <p className="text-xs md:text-sm text-[#ffeed8] mb-4 line-clamp-2">Isian ayam suir bumbu rica-rica pedas gurih yang bikin nagih.</p>
              <p className="text-xl font-bold text-gray-300">Rp 10.000 <span className="text-xs font-normal text-stone-400">/ 3pcs</span></p>
            </div>
          </div>

          {/* Card Menu 2 */}
          <div className="group relative overflow-hidden bg-[#2C0707]/30 border border-[#4A0D0D] rounded-[2.5rem] p-3 pr-8 flex items-center gap-6 hover:border-[#D4A373]/30 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <div className="w-32 h-32 md:w-40 md:h-40 relative flex-shrink-0 bg-black/40 rounded-[2rem] p-3 border border-[#4A0D0D] group-hover:scale-105 transition-transform duration-500">
              <Image src="/cirengkuahh.png" alt="Cireng Kuah" fill className="object-contain drop-shadow-xl p-2" />
            </div>
            <div className="flex-1 py-4">
              <div className="inline-block px-2.5 py-1 rounded-md bg-[#801414]/20 border border-[#A61C1C]/30 text-[9px] font-bold tracking-widest text-[#ffbcbc] uppercase mb-3">
                Varian Baru
              </div>
              <h4 className="text-xl md:text-2xl font-bold text-white mb-1">Cireng Kuah Chili Oil</h4>
              <p className="text-xs md:text-sm text-[#ffeed8] mb-4 line-clamp-2">Segarnya kuah pedas gurih dengan keju lumer di dalamnya.</p>
              <p className="text-xl font-bold text-gray-300">Rp 16.000 <span className="text-xs font-normal text-stone-400">/ 5pcs</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
       <footer className="mt-10 border-t border-[#4A0D0D] bg-[#2C0707]/30 py-6 text-center text-xs font-medium text-[#D1BFA7] relative z-10">
        <div className="flex justify-center gap-8 mb-6">
          <Link href="https://instagram.com/cikoyou_" target="_blank" className="text-xs font-bold tracking-[0.1em] uppercase text-gray-200 hover:text-[#D4A373] transition-colors">Instagram</Link>
          <Link href="#" className="text-xs font-bold tracking-[0.1em] uppercase text-gray-200 hover:text-[#D4A373] transition-colors">WhatsApp</Link>
        </div>
        <p className="text-[10px] text-gray-200 font-medium tracking-widest uppercase">
          &copy; {new Date().getFullYear()} Cikoyou Indonesia. Balikpapan.
        </p>
      </footer>

    </div>
  );
}