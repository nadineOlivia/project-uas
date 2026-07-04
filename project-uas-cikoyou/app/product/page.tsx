"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// --- DATA MENU PRODUK DENGAN DETAIL PREMIUM ---
const PRODUCTS = [
  { id: 1, name: 'Cireng Isi Ayam', desc: 'Isian ayam suir bumbu rica-rica gurih dengan limpahan rempah premium.', price: 10000, image: '/cirengayamm.png', pcs: '3 pcs', category: 'gurih', tag: '🔥 Terlaris', rating: '4.9 (180+ ulasan)' },
  { id: 2, name: 'Cireng Isi Keju', desc: 'Lelehan keju premium yang lumer, gurih, dan melimpah di setiap gigitan.', price: 10000, image: '/cirengkejuu.png', pcs: '3 pcs', category: 'gurih', tag: '🧀 Favorit', rating: '4.8 (120+ ulasan)' },
  { id: 3, name: 'Cireng Kuah Keju Chili oil', desc: 'Potongan cireng garing yang disiram kuah keju chili oil khas Cikoyou.', price: 16000, image: '/cirengkuahh.png', pcs: '5 pcs', category: 'kuah', tag: '🌶️ Pedas Nagih', rating: '5.0 (200+ ulasan)' },
];

export default function ProductPage() {
  // State untuk Filter Kategori agar tetap interaktif
  const [activeCategory, setActiveCategory] = useState<'semua' | 'gurih' | 'kuah'>('semua');

  const filteredProducts = PRODUCTS.filter(product => 
    activeCategory === 'semua' ? true : product.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-[#1F0303] text-[#F5E6D3] font-sans selection:bg-[#801414] selection:text-white antialiased relative overflow-hidden">
      
      {/* DEKORASI BACKGROUND AMBIENT GLOW */}
      <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-[#801414]/25 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-[#D4A373]/10 rounded-full blur-[130px] pointer-events-none" />

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
          <nav className="hidden md:flex items-center bg-[#0A0000]/60 border border-[#2C0707] rounded-full px-8 py-2.5">
            <Link href="/" className="text-sm font-bold text-white tracking-wide hover:text-[#D4A373] transition-colors">
              Home
            </Link>
          </nav>

          {/* KANAN - Tombol Aksi */}
          <div className="pr-1">
            <Link 
              href="/contact" 
              className="bg-[#801414] hover:bg-[#A61C1C] text-white font-black text-xs sm:text-sm uppercase tracking-wider py-2.5 px-6 rounded-full border border-[#A61C1C]/40 shadow-lg transition-all active:scale-95 whitespace-nowrap"
            >
              Hubungi Kami 📞
            </Link>
          </div>

        </header>
      </div>

      {/* MAIN CONTENT (Ditambah padding atas `pt-32` agar tidak tertutup header) */}
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-16 relative z-10">
        
        {/* HERO TITLE */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-[#ffeed8] uppercase bg-[#D4A373]/10 px-3 py-1.5 rounded-full border border-[#D4A373]/30">Premium Cireng Crispy</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 mb-3 bg-gradient-to-b from-white to-[#D1BFA7] bg-clip-text text-transparent uppercase tracking-tight">Katalog Menu</h2>
          <p className="text-sm text-[#ffeed8] leading-relaxed">Dibuat dari bahan pilihan dengan teknik khusus menghasilkan tekstur garing di luar, namun tetap lembut dan lumer di dalam.</p>
        </div>

        {/* TAB FILTER KATEGORI */}
        <div className="flex justify-center gap-3 mb-12">
          {(['semua', 'gurih', 'kuah'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                activeCategory === cat 
                  ? 'bg-gradient-to-r from-[#801414] to-[#4A0D0D] text-white border-[#D4A373]/40 shadow-lg' 
                  : 'bg-[#1F0303]/40 text-[#ffeed8] border-[#4A0D0D] hover:bg-[#2C0707]/60 hover:text-white hover:border-[#D4A373]/30'
              }`}
            >
              {cat === 'semua' ? '📂 Semua Menu' : cat === 'gurih' ? '🥟 Isian Gurih' : '🍲 Varian Kuah'}
            </button>
          ))}
        </div>

        {/* GRID PRODUK SHOWCASE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="group relative bg-[#2C0707]/40 border border-[#4A0D0D] hover:border-[#D4A373]/50 p-6 rounded-3xl flex flex-col justify-between backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(212,163,115,0.15)]"
            >
              {/* BADGE HALO / GLOW EFFECT DI BELAKANG GAMBAR */}
              <div className="absolute top-16 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#801414]/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div>
                {/* ATAS: BADGE & RATING */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-extrabold tracking-wider bg-[#D4A373]/20 text-[#ffbcbc] border border-[#D4A373]/30 px-2.5 py-1 rounded-md uppercase">
                    {product.tag}
                  </span>
                  <span className="text-xs text-[#D1BFA7] flex items-center gap-1">
                    ⭐ <span className="text-white font-medium text-[11px]">{product.rating}</span>
                  </span>
                </div>

                {/* TENGAH: WADAH GAMBAR DENGAN ANIMASI HOVER GAYA */}
                <div className="relative w-40 h-40 mx-auto my-6 filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]">
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill
                    sizes="160px"
                    className="object-contain transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 ease-out" 
                  />
                </div>

                {/* INFO TEKS */}
                <div className="text-center md:text-left mt-4">
                  <h3 className="text-xl font-extrabold text-white group-hover:text-[#ffeed8] transition-colors duration-300">{product.name}</h3>
                  <p className="text-xs text-[#ffeed8] mt-2 leading-relaxed min-h-[3rem]">{product.desc}</p>
                </div>
              </div>

              {/* BAWAH: TAMPILAN INFO HARGA & PORSI YANG ELEGAN */}
              <div className="mt-6 pt-4 border-t border-[#4A0D0D] flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-[#ffeed8] font-bold uppercase tracking-wide">Harga</p>
                  <p className="text-2xl font-black text-gray-200 mt-0.5">Rp {product.price.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-[#1F0303]/60 px-3 py-1.5 rounded-xl border border-[#4A0D0D] text-right shadow-inner">
                  <p className="text-[10px] text-[#D1BFA7] uppercase font-bold tracking-wider">Isi Porsi</p>
                  <p className="text-xs font-extrabold text-gray-300 mt-0.5">{product.pcs}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* KOTAK INFORMASI TAMBAHAN / HUBUNGI KONTAK */}
        <div className="mt-20 text-center bg-gradient-to-r from-[#2C0707]/60 to-transparent border border-[#4A0D0D] p-8 rounded-3xl backdrop-blur-xl max-w-3xl mx-auto shadow-lg">
          <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wide">Tertarik Mencicipi Kelezatan Cikoyou?</h3>
          <p className="text-sm text-[#ffeed8] mb-6 max-w-xl mx-auto">Silakan hubungi tim kami langsung untuk info pemesanan, ketersediaan stok harian outlet, atau kemitraan acara.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#801414] to-[#4A0D0D] hover:from-[#A61C1C] hover:to-[#5C1414] text-white border border-[#A61C1C]/30 font-bold text-sm rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-wider">
            Hubungi Kami Sekarang ➔
          </Link>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="mt-10 border-t border-[#4A0D0D] bg-[#2C0707]/30 py-6 text-center text-xs font-medium text-gray-200 relative z-10">
        &copy; {new Date().getFullYear()} Cikoyou E-Commerce. All rights reserved.
      </footer>

    </div>
  );
}