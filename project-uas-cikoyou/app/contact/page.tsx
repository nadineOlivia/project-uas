"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ContactPage() {
  // --- STATE SESI MEMBER (Agar Header Seragam) ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('cikoyou_session');
    if (session) setIsLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('cikoyou_session');
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-[#1F0303] text-[#ffeed8] font-sans selection:bg-[#801414] selection:text-white antialiased relative overflow-hidden">
      
      {/* DEKORASI BG EFFECT */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#801414]/25 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#D4A373]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER FLOATING PILL (KONSISTEN DENGAN HALAMAN LAIN) */}
      <div className="fixed top-6 left-0 w-full z-50 flex justify-center px-4 pointer-events-none">
        <header className="pointer-events-auto bg-[#1F0303]/95 backdrop-blur-xl border border-[#4A0D0D] rounded-full p-2 flex items-center justify-between w-full max-w-5xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          
          {/* KIRI - Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 pl-2 group">
            <div className="p-0.5 bg-[#4A0D0D] rounded-full border border-[#D4A373]/20 shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <Image src="/fotocikoyou.png" alt="Logo" width={40} height={40} className="rounded-full" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-lg font-black tracking-widest text-white leading-none mt-0.5">CIKOYOU</h1>
              <p className="text-[8px] tracking-[0.25em] text-[#ffeed8] font-bold uppercase mt-1">E-Commerce</p>
            </div>
          </Link>

          {/* TENGAH - Navigasi Kapsul */}
          <nav className="hidden md:flex items-center gap-6 bg-[#0A0000]/60 border border-[#2C0707] rounded-full px-8 py-2.5">
            <Link href="/" className="text-sm font-bold text-[#D1BFA7] tracking-wide hover:text-white transition-colors">Home</Link>
            <Link href="/order" className="text-sm font-bold text-[#D1BFA7] tracking-wide hover:text-white transition-colors">Menu</Link>
            <Link href="/contact" className="text-sm font-bold text-white tracking-wide hover:text-[#D4A373] transition-colors">Contact</Link>
          </nav>

          {/* KANAN - Tombol Aksi Dinamis */}
          <div className="pr-1">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="bg-[#801414] hover:bg-[#A61C1C] text-white font-black text-xs sm:text-sm uppercase tracking-wider py-2.5 px-6 rounded-full border border-[#A61C1C]/40 shadow-lg transition-all active:scale-95 whitespace-nowrap hidden sm:block"
              >
                Keluar
              </button>
            ) : (
              <Link 
                href="/account" 
                className="bg-[#2C0707] hover:bg-[#4A0D0D] text-[#ffeed8] hover:text-white font-black text-xs sm:text-sm uppercase tracking-wider py-2.5 px-6 rounded-full border border-[#4A0D0D] shadow-lg transition-all active:scale-95 whitespace-nowrap hidden sm:block"
              >
                Member Area
              </Link>
            )}
          </div>

        </header>
      </div>

      {/* MAIN CONTENT (Padding Top diubah jadi pt-32) */}
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20 relative z-10">
        
        {/* JUDUL HALAMAN */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-black mt-4 mb-3 bg-gradient-to-b from-white to-[#D1BFA7] bg-clip-text text-transparent uppercase tracking-tight">HUBUNGI KAMI</h2>
          <p className="text-sm md:text-base text-[#ffeed8] max-w-xl mx-auto font-medium">
            Ada pertanyaan atau mau pesan dalam jumlah besar untuk acara kamu? Yuk, langsung hubungi tim Cikoyou melalui kontak di bawah ini!
          </p>
        </div>

        {/* LAYOUT DUA KOLOM SEJAJAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* KOLOM 1: JAM OPERASIONAL */}
          <div className="bg-[#2C0707]/40 border border-[#4A0D0D] p-8 rounded-[2.5rem] backdrop-blur-sm flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="text-xl font-bold text-gray-200 mb-6 flex items-center gap-2">
                ⏰ Jam Operasional
              </h3>
              <div className="space-y-4 text-sm text-[#ffeed8]">
                <div className="flex justify-between border-b border-[#4A0D0D] pb-3">
                  <span>Senin - Jumat:</span>
                  <span className="font-bold text-[#e7c7a7]">10.00 - 21.00 WIB</span>
                </div>
                <div className="flex justify-between border-b border-[#4A0D0D] pb-3">
                  <span>Sabtu - Minggu:</span>
                  <span className="font-bold text-[#e7c7a7]">11.00 - 22.00 WIB</span>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-[#ffeed8] mt-8 italic font-medium">
              *Jam operasional dapat berubah saat hari libur nasional.
            </p>
          </div>

          {/* KOLOM 2: INFO KONTAK LANGSUNG */}
          <div className="bg-[#2C0707]/40 border border-[#4A0D0D] p-8 rounded-[2.5rem] backdrop-blur-sm space-y-4 shadow-xl">
            <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
              📍 Info Kontak
            </h3>
            
            {/* WhatsApp */}
            <a href="https://wa.me/62895386717090" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-[#1F0303]/60 border border-transparent hover:border-[#D4A373]/50 transition-all group shadow-sm">
              <div className="text-2xl bg-green-500/10 p-2 rounded-xl border border-green-500/20 group-hover:scale-110 transition-transform">💬</div>
              <div>
                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">WhatsApp Chat</p>
                <p className="text-sm font-bold text-white group-hover:text-[#e1bc97] transition-colors">+62 895-3867-17090</p>
              </div>
            </a>

            {/* Instagram */}
            <a href="https://www.instagram.com/cikoyou_/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-[#1F0303]/60 border border-transparent hover:border-[#D4A373]/50 transition-all group shadow-sm">
              <div className="text-2xl bg-pink-500/10 p-2 rounded-xl border border-pink-500/20 group-hover:scale-110 transition-transform">📸</div>
              <div>
                <p className="text-[10px] text-stone-300 font-bold uppercase tracking-widest">Instagram</p>
                <p className="text-sm font-bold text-white group-hover:text-[#e1bc97] transition-colors">@cikoyou.id</p>
              </div>
            </a>

            {/* Alamat */}
            <a href="https://maps.app.goo.gl/aj5iipakAYWya2Na7" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-[#1F0303]/60 border border-transparent hover:border-[#D4A373]/50 transition-all group shadow-sm">
              <div className="text-2xl bg-blue-500/10 p-2 rounded-xl border border-blue-500/20 group-hover:scale-110 transition-transform">🏠</div>
              <div>
                <p className="text-[10px] text-stone- font-bold uppercase tracking-widest">Location</p>
                <p className="text-sm font-bold text-white group-hover:text-[#e1bc97] transition-colors">Jl. Batu Butok rt 84 no 73</p>
              </div>
            </a>
          </div>
        </div>
      </main>

      {/* FOOTER MINI */}
      <footer className="mt-20 border-t border-[#4A0D0D] bg-[#2C0707]/30 py-6 text-center text-xs font-medium text-gray-200 relative z-10">
        © {new Date().getFullYear()} Cikoyou Indonesia. All rights reserved.
      </footer>

    </div>
  );
}