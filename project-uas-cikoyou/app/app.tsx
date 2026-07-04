import React, { useState } from 'react';

// Tipe data untuk menu
type MenuKey = 'HOME' | 'ABOUT' | 'ORDER' | 'PRODUCT' | 'CONTACT' | 'ACCOUNT';

export default function CikoyouWebsite() {
  const [activeMenu, setActiveMenu] = useState<MenuKey>('HOME');

  // Struktur Data berdasarkan Sitemap
  const sitemapData = {
    ABOUT: [
      { id: 1, title: 'Business Profile' },
      { id: 2, title: 'Product Ratings' },
      { id: 3, title: 'Customer Reviews' },
    ],
    ORDER: [
      { id: 1, title: 'Shopping Cart' },
      { id: 2, title: 'Checkout' },
      { id: 3, title: 'Payment Method' },
      { id: 4, title: 'Order Status' },
    ],
    PRODUCT: [
      { id: 1, title: 'Cireng isi ayam' },
      { id: 2, title: 'Cireng Isi Keju' },
      { id: 3, title: 'Cireng isi Kuah Kecil' },
    ],
    CONTACT: [ // Memperbaiki typo 'CONTACK' menjadi 'CONTACT'
      { id: 1, title: 'WhatsApp' },
      { id: 2, title: 'Instagram' },
      { id: 3, title: 'Location' },
    ],
    ACCOUNT: [
      { id: 1, title: 'Register' },
      { id: 2, title: 'My Account' },
      { id: 3, title: 'Profile' },
    ],
  };

  // Fungsi untuk render sub-menu sebagai kartu (cards)
  const renderSubMenu = (menuKey: Exclude<MenuKey, 'HOME'>) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {sitemapData[menuKey].map((item) => (
          <div 
            key={item.id} 
            className="bg-[#E6D5B8] text-[#4A2511] font-semibold p-6 rounded-lg shadow-md hover:bg-[#d8c29d] transition cursor-pointer flex items-center justify-center text-center"
          >
            {item.title}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#5C0A0A] text-white font-sans selection:bg-[#E6D5B8] selection:text-black">
      
      {/* HEADER / NAVBAR */}
      <header className="flex items-center justify-between p-6 border-b border-[#801b1b]">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setActiveMenu('HOME')}
        >
          {/* Ikon Cart Sederhana sebagai Logo Teks */}
          <div className="text-3xl">🛒</div>
          <div>
            <h1 className="text-2xl font-bold tracking-wider">E-COMMERCE</h1>
            <p className="text-sm text-gray-300">Cikoyou</p>
          </div>
        </div>
        
        {/* Navigasi Utama */}
        <nav className="hidden md:flex gap-6 font-semibold">
          {(Object.keys(sitemapData) as Array<Exclude<MenuKey, 'HOME'>>).map((menu) => (
            <button
              key={menu}
              onClick={() => setActiveMenu(menu)}
              className={`px-4 py-2 rounded-md transition ${
                activeMenu === menu 
                  ? 'bg-[#8B653E] text-white' 
                  : 'hover:bg-[#801b1b] text-gray-200'
              }`}
            >
              {menu}
            </button>
          ))}
        </nav>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-5xl mx-auto p-8 flex flex-col items-center mt-10">
        
        {activeMenu === 'HOME' ? (
          // Tampilan Home Page
          <div className="text-center animate-fade-in flex flex-col items-center">
            <div className="bg-[#3A2618] px-12 py-6 rounded-md shadow-lg border border-[#4d3320] mb-12">
              <h2 className="text-4xl font-bold text-white">HOME PAGE</h2>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl text-center mb-10">
              Selamat datang di Cikoyou! Silakan pilih menu di atas untuk mulai berbelanja aneka cireng lezat kami.
            </p>
            
            {/* Logo Placeholder (Meniru lingkaran logo Cikoyou) */}
            <div className="w-64 h-64 bg-red-800 rounded-full border-4 border-white flex flex-col items-center justify-center p-4 shadow-2xl mt-8">
              <h3 className="text-3xl font-black tracking-widest text-white mb-2 shadow-sm">CIKOYOU</h3>
              <div className="text-5xl my-2">🥟</div>
              <p className="text-[10px] text-center font-bold tracking-widest mt-2 uppercase">
                Dari Gurihnya Cireng Untuk Kamu
              </p>
            </div>
          </div>
        ) : (
          // Tampilan Sub-Menu (About, Order, Product, dsb)
          <div className="w-full animate-fade-in">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-[#8B653E] px-10 py-4 rounded-md shadow-lg w-64 text-center">
                <h2 className="text-2xl font-bold">{activeMenu}</h2>
              </div>
              {/* Garis Hierarki (Opsional untuk estetika sitemap) */}
              <div className="w-px h-8 bg-white mt-4"></div>
            </div>

            {/* Render List Sub Menu Sesuai Kategori */}
            {renderSubMenu(activeMenu)}
          </div>
        )}
      </main>

    </div>
  );
}