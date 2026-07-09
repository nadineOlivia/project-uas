"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

// Data awal jika localStorage masih kosong
const DEFAULT_REVIEWS: Review[] = [
  { id: 1, name: 'Andi Wijaya', rating: 5, comment: 'Cireng kuahnya juara banget! Pedesnya pas dan nagih.', date: '23 Juni 2026' },
  { id: 2, name: 'Siti Aisyah', rating: 5, comment: 'Varian isi keju lumer di mulut. Anak-anak saya suka sekali.', date: '21 Juni 2026' },
  { id: 3, name: 'Budi Santoso', rating: 4, comment: 'Garing di luar, dalemnya empuk ga alot. Mantap pol.', date: '19 Juni 2026' }
];

export default function AboutPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // State Ulasan dimulai dari array kosong dulu, nanti diisi di useEffect
  const [reviews, setReviews] = useState<Review[]>([]);
  
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  // Sinkronisasi status login dan data ulasan dari localStorage
  useEffect(() => {
    // 1. Cek Session Login
    const session = localStorage.getItem('cikoyou_session');
    if (session) {
      const user = JSON.parse(session);
      setIsLoggedIn(true);
      setCurrentUser(user);
    }

    // 2. Cek Data Ulasan Tersimpan
    const savedReviews = localStorage.getItem('cikoyou_reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      setReviews(DEFAULT_REVIEWS);
      // Opsional: langsung simpan data default ke localstorage agar tersinkronisasi
      localStorage.setItem('cikoyou_reviews', JSON.stringify(DEFAULT_REVIEWS));
    }

    setIsLoaded(true);
  }, []);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    // Membuat format tanggal otomatis hari ini (Format: "Tanggal Bulan Tahun" -> Contoh: 9 Juli 2026)
    const today = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const newReview: Review = {
      id: Date.now(),
      name: currentUser.name,
      rating: newRating,
      comment: newComment,
      date: today
    };

    // Gabungkan ulasan baru ke dalam list ulasan yang sudah ada
    const updatedReviews = [newReview, ...reviews];
    
    // Simpan ke State dan LocalStorage agar permanen
    setReviews(updatedReviews);
    localStorage.setItem('cikoyou_reviews', JSON.stringify(updatedReviews));

    // Reset Form Input
    setNewComment('');
    setNewRating(5);
  };

  const handleLogout = () => {
    localStorage.removeItem('cikoyou_session');
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  if (!isLoaded) {
    return <div className="min-h-screen bg-[#1F0303] flex items-center justify-center text-[#ffeed8] text-sm tracking-widest uppercase">Memuat Halaman...</div>;
  }

  return (
    <div className="min-h-screen bg-[#1F0303] text-[#F5E6D3] font-sans selection:bg-[#801414] selection:text-white antialiased relative overflow-hidden">
      
      {/* DEKORASI AMBIENT BACKGROUND GLOW */}
      <div className="absolute top-[-5%] right-[-10%] w-[500px] h-[500px] bg-[#801414]/25 rounded-full blur-[130px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-[#D4A373]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* HEADER FLOATING PILL */}
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
            <Link href="/" className="text-sm font-bold text-white tracking-wide hover:text-[#D4A373] transition-colors">Home</Link>
            <Link href="/product" className="text-sm font-bold text-[#D1BFA7] tracking-wide hover:text-white transition-colors">Menu</Link>
          </nav>

          {/* KANAN - Tombol Aksi Dinamis */}
          <div className="pr-1">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="bg-[#801414] hover:bg-[#A61C1C] text-white font-black text-xs sm:text-sm uppercase tracking-wider py-2.5 px-6 rounded-full border border-[#A61C1C]/40 shadow-lg transition-all active:scale-95 whitespace-nowrap"
              >
                Keluar
              </button>
            ) : (
              <Link 
                href="/account" 
                className="bg-[#2C0707] hover:bg-[#4A0D0D] text-[#D4A373] hover:text-white font-black text-xs sm:text-sm uppercase tracking-wider py-2.5 px-6 rounded-full border border-[#4A0D0D] shadow-lg transition-all active:scale-95 whitespace-nowrap"
              >
                Member Area
              </Link>
            )}
          </div>

        </header>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-6 pt-32 pb-16 relative z-10">
        
        {/* ================= TAMPILAN ATAS: PROFIL BISNIS ================= */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          <div className="inline-block bg-[#2C0707]/60 border border-[#4A0D0D] px-5 py-1.5 rounded-full mb-6 shadow-md">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffeed8]">Business Profile 👑</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mt-4 mb-3 bg-gradient-to-b from-white to-[#D1BFA7] bg-clip-text text-transparent uppercase tracking-tight">CIKOYOU</h2>
          
          <p className="text-sm text-[#ffeed8] leading-relaxed max-w-3xl mx-auto tracking-wide">
            Berawal dari kecintaan pada kuliner jajanan tradisional, <span className="text-[#D4A373] font-bold">Cikoyou</span> hadir membawa inovasi baru. <span className="text-[#D4A373] font-bold">Cikoyou</span> adalah UMKM kuliner yang berfokus pada olahan cireng premium. Berdiri dengan semangat melestarikan jajanan nusantara, kami menghadirkan cireng dengan aneka isian modern seperti isian ayam dan keju lumer, dan kami juga ada menu cireng kuah KECIL (cireng kuah keju chili oil). Tagline kami adalah <span className="text-[#D4A373] italic">"Dari Gurihnya Cireng Untuk Kamu"</span>.
          </p>

          {/* 4 INFOGRAPHIC CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
            <div className="bg-[#2C0707]/40 border border-[#4A0D0D] hover:border-[#D4A373]/50 p-5 rounded-2xl flex flex-col items-center justify-center min-h-[140px] shadow-lg transition-colors">
              <span className="text-2xl mb-3">📍</span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-200">Lokasi</p>
              <p className="text-base font-extrabold text-[#ffeed8] mt-1">Balikpapan</p>
            </div>
            <div className="bg-[#2C0707]/40 border border-[#4A0D0D] hover:border-[#D4A373]/50 p-5 rounded-2xl flex flex-col items-center justify-center min-h-[140px] shadow-lg transition-colors">
              <span className="text-2xl mb-3">📅</span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-200">Berdiri</p>
              <p className="text-base font-extrabold text-[#ffeed8] mt-1">14 Januari 2024</p>
            </div>
            <div className="bg-[#2C0707]/40 border border-[#4A0D0D] hover:border-[#D4A373]/50 p-5 rounded-2xl flex flex-col items-center justify-center min-h-[140px] shadow-lg transition-colors">
              <span className="text-2xl mb-3">📦</span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-200">Penjualan</p>
              <p className="text-base font-extrabold text-[#ffeed8] mt-1">1000+ Pcs</p>
            </div>
            <div className="bg-[#2C0707]/40 border border-[#4A0D0D] hover:border-[#D4A373]/50 p-5 rounded-2xl flex flex-col items-center justify-center min-h-[140px] shadow-lg transition-colors">
              <span className="text-2xl mb-3">✨</span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-200">Kualitas</p>
              <p className="text-base font-extrabold text-[#ffeed8] mt-1">100% Halal</p>
            </div>
          </div>
        </div>

        <hr className="border-[#4A0D0D] my-16 max-w-4xl mx-auto" />

        {/* ================= TAMPILAN TENGAH-BAWAH: ULASAN ================= */}
        <div className="text-center mb-10">
          <h3 className="text-3xl font-black text-white tracking-wide uppercase flex items-center justify-center gap-2">
            Suara Pelanggan ⭐
          </h3>
          <p className="text-xs text-[#ffeed8] mt-2">Apa kata mereka yang sudah merasakan kelezatan Cikoyou?</p>
        </div>

        {/* STATISTIK RATING UTAMA BLOCK */}
        <div className="bg-[#2C0707]/40 border border-[#4A0D0D] p-8 rounded-3xl max-w-4xl mx-auto mb-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-md">
          <div className="text-center md:border-r border-[#4A0D0D] md:pr-12 min-w-[200px]">
            <h4 className="text-7xl font-black text-[#ffeed8] tracking-tighter">4.8</h4>
            <div className="text-amber-400 text-xl my-3 tracking-wide">★★★★★</div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffeed8]">Dari 1,284 Ulasan</p>
          </div>

          <div className="flex-1 w-full space-y-2.5 max-w-md">
            {[
              { star: 5, width: 'w-[85%]' },
              { star: 4, width: 'w-[12%]' },
              { star: 3, width: 'w-[4%]' },
              { star: 2, width: 'w-[1%]' },
              { star: 1, width: 'w-[1%]' }
            ].map((item) => (
              <div key={item.star} className="flex items-center gap-4 text-xs font-bold text-[#ffeed8]">
                <span className="w-3 text-right">{item.star}</span>
                <span className="text-amber-400 text-sm">★</span>
                <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden border border-white/[0.03]">
                  <div className={`h-full bg-gradient-to-r from-[#801414] to-[#ffeed8] rounded-full ${item.width}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LAYOUT INPUT ULASAN & DISPLAY LIST */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start max-w-4xl mx-auto">
          
          {/* KIRI: FORM / LOGIN ALERT */}
          <div className="md:col-span-5 bg-[#2C0707]/60 border border-[#4A0D0D] p-6 rounded-2xl backdrop-blur-xl">
            {isLoggedIn ? (
              <form onSubmit={handleSubmitReview} className="space-y-4 animate-fade-in">
                <h4 className="text-xs font-black text-[#ffeed8] uppercase tracking-wider">✍️ Berikan Ulasan Anda</h4>
                <p className="text-[11px] text-[#ffeed8]">Sebagai: <span className="text-white font-bold">{currentUser?.name}</span></p>
                
                <div>
                  <label className="block text-[10px] font-bold text-[#ffeed8] uppercase mb-1">Rating Bintang</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className={`text-xl transition-colors ${star <= newRating ? 'text-amber-400' : 'text-gray-600'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#ffeed8] uppercase mb-1">Tulis Ulasan</label>
                  <textarea
                    required
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ceritakan pengalamanmu menikmati Cireng Cikoyou..."
                    className="w-full bg-[#1F0303]/80 border border-[#4A0D0D] focus:border-[#D4A373] p-3 rounded-xl text-xs text-white placeholder-gray-600 outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-[#801414] to-[#4A0D0D] hover:from-[#A61C1C] hover:to-[#5C1414] text-white font-bold text-xs rounded-xl uppercase tracking-wider shadow-md transition-all active:scale-95 border border-[#A61C1C]/30"
                >
                  Kirim Ulasan Sekarang
                </button>
              </form>
            ) : (
              <div className="text-center py-6 animate-fade-in">
                <div className="text-3xl mb-3">🔒</div>
                <h4 className="text-sm font-bold text-white mb-1">Tulis Ulasan</h4>
                <p className="text-[11px] text-[#ffeed8] max-w-[200px] mx-auto mb-4 leading-relaxed">Silakan masuk ke akun member terlebih dahulu untuk dapat mengirim ulasan produk.</p>
                <Link 
                  href="/account" 
                  className="inline-block px-4 py-2 bg-[#4A0D0D]/50 hover:bg-[#4A0D0D] border border-[#D4A373]/30 text-[#ffeed8] hover:text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all"
                >
                  Masuk Akun Member
                </Link>
              </div>
            )}
          </div>

          {/* KANAN: LIST FEEDS SEMUA REVIEW */}
          <div className="md:col-span-7 space-y-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-[#2C0707]/30 border border-[#4A0D0D] p-4 rounded-xl transition-all hover:border-[#D4A373]/40">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="text-xs font-bold text-white">{rev.name}</h5>
                  <span className="text-[10px] text-[#ffeed8]">{rev.date}</span>
                </div>
                <div className="text-xs text-amber-400 mb-2">
                  {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                </div>
                <p className="text-xs text-[#ffeed8] leading-relaxed italic">"{rev.comment}"</p>
              </div>
            ))}
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="mt-10 border-t border-[#4A0D0D] bg-[#2C0707]/30 py-6 text-center text-xs font-medium text-gray-200 relative z-10">
        &copy; {new Date().getFullYear()} Cikoyou E-Commerce. All rights reserved.
      </footer>

    </div>
  );
}