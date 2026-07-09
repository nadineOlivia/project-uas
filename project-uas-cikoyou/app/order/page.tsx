"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const PRODUCTS = [
  { id: 1, name: 'Cireng Isi Ayam', desc: 'Isian ayam suir bumbu rica rica gurih yang melimpah.', price: 10000, image: '/cirengayamm.png', pcs: '3pcs' },
  { id: 2, name: 'Cireng Isi Keju', desc: 'Lelehan keju premium yang gurih di setiap gigitan.', price: 10000, image: '/cirengkejuu.png', pcs: '3pcs' },
  { id: 3, name: 'Cireng Kuah Keju Chili Oil', desc: 'Potongan cireng renyah disiram kuah keju chili.', price: 16000, image: '/cirengkuahh.png', pcs: '5pcs' },
];

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export default function OrderPage() {
  // --- STATE TAMPILAN & KERANJANG ---
  const [currentView, setCurrentView] = useState<'menu' | 'payment' | 'status'>('menu');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // --- STATE CHECKOUT ---
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderId, setOrderId] = useState('');
  const [customerName, setCustomerName] = useState(''); 
  const [orderStatus, setOrderStatus] = useState('');
  const [receiptPreview, setReceiptPreview] = useState<string>('');

  // --- STATE VOUCHER ---
  const [voucherCode, setVoucherCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState({ text: '', type: '' });

  // --- STATE SESI & POIN MEMBER ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPoints, setUserPoints] = useState(0); // 🔥 BARU: Menyimpan jumlah poin akun yang sedang login
  const [usePointsDiscount, setUsePointsDiscount] = useState(false); // 🔥 BARU: Status apakah member mau tukar poin

  // --- EFEK & INTERVAL ---
  useEffect(() => {
    const session = localStorage.getItem('cikoyou_session');
    if (session) {
      setIsLoggedIn(true);
      try {
        // Ambil nama dari data session
        const parsedSession = JSON.parse(session);
        const nameFromSession = parsedSession.name || parsedSession.username || session;
        setCustomerName(nameFromSession);

        // Cari jumlah poin terbaru user ini dari database utama
        const dbUsers = JSON.parse(localStorage.getItem('cikoyou_database') || '[]');
        const currentUser = dbUsers.find((u: any) => u.name === nameFromSession);
        if (currentUser) {
          setUserPoints(currentUser.points || 0);
        }
      } catch (e) {
        // Fallback jika format session hanya string biasa
        setCustomerName(session);
        const dbUsers = JSON.parse(localStorage.getItem('cikoyou_database') || '[]');
        const currentUser = dbUsers.find((u: any) => u.name === session);
        if (currentUser) {
          setUserPoints(currentUser.points || 0);
        }
      }
    }
  }, [currentView]); // Direfresh setiap kali berganti view halaman

  // Update status pesanan secara real-time jika ada perubahan dari sisi Admin
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (currentView === 'status' && orderId) {
      intervalId = setInterval(() => {
        const existingOrders = JSON.parse(localStorage.getItem('cikoyou_orders') || '[]');
        const myOrder = existingOrders.find((o: any) => o.id === orderId);
        if (myOrder) {
          setOrderStatus(myOrder.status);
        }
      }, 1500);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentView, orderId]);

  // --- FUNGSI-FUNGSI LOGIKA ---
  const handleLogout = () => {
    localStorage.removeItem('cikoyou_session');
    setIsLoggedIn(false);
    setCustomerName('');
    setUserPoints(0);
    setUsePointsDiscount(false);
  };

  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    if (cart.length === 1) { 
      setDiscountAmount(0);
      setVoucherCode('');
      setVoucherMessage({ text: '', type: '' });
      setUsePointsDiscount(false);
    }
  };

  // KUMPULAN HITUNGAN KALKULASI NOTA (TERMASUK POTONGAN POIN)
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const intermediateTotal = Math.max(0, cartTotal - discountAmount);
  
  // Simulasi nilai tukar poin: 1 Poin = Rp 100 potongan harga
  const poinMaksimalYangBisaDipakai = Math.min(userPoints, Math.ceil(intermediateTotal / 100));
  const finalPointsDiscount = usePointsDiscount ? poinMaksimalYangBisaDipakai * 100 : 0;
  
  const finalTotal = Math.max(0, intermediateTotal - finalPointsDiscount);

  const handleApplyVoucher = () => {
    const code = voucherCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'MEMBERBARU20') {
      const discount = cartTotal * 0.2;
      setDiscountAmount(discount);
      setVoucherMessage({ text: 'Yeay! Voucher Member Baru Diskon 20% berhasil dipakai.', type: 'success' });
    } else if (code === 'CIKO10') {
      const discount = cartTotal * 0.1;
      setDiscountAmount(discount);
      setVoucherMessage({ text: 'Yeay! Voucher Diskon 10% berhasil dipakai.', type: 'success' });
    } else if (code === 'HEMAT5K') {
      setDiscountAmount(5000);
      setVoucherMessage({ text: 'Yeay! Potongan Rp 5.000 berhasil dipakai.', type: 'success' });
    } else {
      setDiscountAmount(0);
      setVoucherMessage({ text: 'Yah, kode voucher tidak ditemukan atau tidak valid.', type: 'error' });
    }
  };

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return alert("Ukuran berkas terlalu besar! Maksimal ukuran adalah 5MB.");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return alert("Keranjang masih kosong!");
    setIsCartOpen(false);
    setCurrentView('payment');
  };

  const handlePay = () => {
    if (!customerName.trim()) return alert("Masukkan nama pemesan terlebih dahulu!");
    if (!paymentMethod) return alert("Pilih metode pembayaran terlebih dahulu!");
    
    // Validasi bukti pembayaran
    if ((paymentMethod === 'transfer' || paymentMethod === 'qris') && !receiptPreview) {
      return alert("Silakan unggah bukti pembayaran Anda terlebih dahulu!");
    }
    
    // 🔥 LOGIKA BARU: Jika menukarkan poin, kurangi langsung poin di database user saat order dibuat
    if (isLoggedIn && usePointsDiscount && poinMaksimalYangBisaDipakai > 0) {
      const localUsers = JSON.parse(localStorage.getItem('cikoyou_database') || '[]');
      const updatedUsers = localUsers.map((user: any) => {
        if (user.name === customerName) {
          return { ...user, points: Math.max(0, (user.points || 0) - poinMaksimalYangBisaDipakai) };
        }
        return user;
      });
      localStorage.setItem('cikoyou_database', JSON.stringify(updatedUsers));
      setUserPoints(prev => Math.max(0, prev - poinMaksimalYangBisaDipakai));
    }

    const newOrderId = `CKY-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setOrderId(newOrderId);

    const itemsSummary = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');
    const initialStatus = paymentMethod === 'cash' ? 'Menunggu Pembayaran' : 'Pesanan Masuk';
    setOrderStatus(initialStatus);

    const newOrder = {
      id: newOrderId,
      customerName: customerName,
      items: itemsSummary,
      totalPrice: finalTotal,
      status: initialStatus, 
      paymentMethod: paymentMethod,       
      paymentProof: receiptPreview || null, 
      date: new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    const existingOrders = JSON.parse(localStorage.getItem('cikoyou_orders') || '[]');
    
    try {
      localStorage.setItem('cikoyou_orders', JSON.stringify([newOrder, ...existingOrders]));
    } catch (e) {
      console.warn("Storage penuh, menyimpan data transaksi tanpa lampiran string gambar utama.");
      const optimizedOrder = { ...newOrder, paymentProof: "Terlampir di Sesi" };
      localStorage.setItem('cikoyou_orders', JSON.stringify([optimizedOrder, ...existingOrders]));
    }

    setCurrentView('status');
  };

  const handleBackToMenu = () => {
    setCart([]); 
    setPaymentMethod('');
    if (!isLoggedIn) setCustomerName('');
    setOrderStatus('');
    setVoucherCode('');
    setDiscountAmount(0);
    setVoucherMessage({ text: '', type: '' });
    setReceiptPreview('');
    setUsePointsDiscount(false);
    setCurrentView('menu');
  };

  return (
    <div className="min-h-screen bg-[#1F0303] text-[#F5E6D3] font-sans selection:bg-[#801414] selection:text-white antialiased relative overflow-hidden">
      
      {/* 🌟 LUXURIOUS AMBIENT LIGHT */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#801414]/25 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#D4A373]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER FLOATING PILL */}
      <div className="fixed top-6 left-0 w-full z-50 flex justify-center px-4 pointer-events-none">
        <header className="pointer-events-auto bg-[#1F0303]/95 backdrop-blur-xl border border-[#4A0D0D] rounded-full p-2 flex items-center justify-between w-full max-w-5xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          
          <Link href="/" className="flex items-center gap-3 pl-2 group">
            <div className="p-0.5 bg-[#4A0D0D] rounded-full border border-[#D4A373]/20 shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <Image src="/fotocikoyou.png" alt="Logo" width={40} height={40} className="rounded-full" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-lg font-black tracking-widest text-white leading-none mt-0.5">CIKOYOU</h1>
              <p className="text-[8px] tracking-[0.25em] text-[#ffeed8] font-bold uppercase mt-1">E-Commerce</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 bg-[#0A0000]/60 border border-[#2C0707] rounded-full px-8 py-2.5">
            <Link href="/" className="text-sm font-bold text-[#D1BFA7] tracking-wide hover:text-white transition-colors">Home</Link>
            <Link href="/product" className="text-sm font-bold text-white tracking-wide hover:text-[#D4A373] transition-colors">Menu</Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4 pr-1">
            {currentView === 'menu' && (
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#0A0000]/60 border border-[#4A0D0D] text-[#D4A373] hover:scale-110 hover:text-white transition-all shadow-sm"
              >
                <span className="text-lg">🛒</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#801414] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-[#1F0303]">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            )}

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
                className="bg-[#2C0707] hover:bg-[#4A0D0D] text-[#D4A373] hover:text-white font-black text-xs sm:text-sm uppercase tracking-wider py-2.5 px-6 rounded-full border border-[#4A0D0D] shadow-lg transition-all active:scale-95 whitespace-nowrap hidden sm:block"
              >
                Member Area
              </Link>
            )}
          </div>
        </header>
      </div>

      {/* VIEW: MENU UTAMA */}
      {currentView === 'menu' && (
        <main className="max-w-5xl mx-auto px-6 pt-32 pb-12 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-3 bg-gradient-to-b from-white to-[#D1BFA7] bg-clip-text text-transparent uppercase tracking-tight">Menu Cikoyou</h2>
            <p className="text-sm text-[#ffeed8] font-medium">Pilih menu favoritmu dan klik tombol keranjang di atas untuk checkout.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="group bg-[#2C0707]/40 border border-[#4A0D0D] p-6 rounded-[2.5rem] flex flex-col items-center text-center backdrop-blur-sm hover:border-[#D4A373]/30 hover:bg-[#3D0A0A]/50 transition-all duration-300 shadow-xl">
                <div className="relative w-36 h-36 mb-6 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
                  <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 144px, 144px" className="object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                <p className="text-xs text-[#ffeed8] mb-4 flex-grow leading-relaxed">{product.desc}</p>
                <p className="text-xl font-black text-gray-200 mb-0.5">Rp {product.price.toLocaleString('id-ID')}</p>
                <p className="text-[10px] font-bold text-stone-300 tracking-wider uppercase mb-5">{product.pcs}</p>
                <button 
                  onClick={() => handleAddToCart(product)} 
                  className="w-full py-3.5 bg-gradient-to-r from-[#801414] to-[#4A0D0D] hover:from-[#A61C1C] hover:to-[#5C1414] text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all border border-[#A61C1C]/30 active:scale-95 shadow-md"
                >
                  + Masukkan Keranjang
                </button>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* VIEW: HALAMAN PEMBAYARAN & CHECKOUT */}
      {currentView === 'payment' && (
        <main className="max-w-2xl mx-auto px-6 pt-32 pb-12 relative z-10">
          <button onClick={() => setCurrentView('menu')} className="text-[#ffeed8] hover:text-[#E5B283] text-xs uppercase tracking-wider font-bold mb-6 flex items-center gap-2 transition-colors">
            ⬅️ Kembali ke Menu
          </button>

          <div className="bg-[#2C0707]/40 border border-[#4A0D0D] p-8 rounded-[2.5rem] backdrop-blur-sm shadow-2xl">
            
            {/* BREAKDOWN TOTAL STRIP */}
            <div className="border-b border-[#4A0D0D] pb-6 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[#ffeed8]">Subtotal</span>
                <span className="font-bold text-gray-200">Rp {cartTotal.toLocaleString('id-ID')}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between items-center mb-2 text-amber-200 text-sm">
                  <span>Diskon Voucher</span>
                  <span className="font-bold">- Rp {discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}

              {/* 🔥 TAMPILAN BARU: Potongan Poin di Nota */}
              {usePointsDiscount && finalPointsDiscount > 0 && (
                <div className="flex justify-between items-center mb-2 text-orange-300 text-sm font-medium">
                  <span>Tukar Poin ({poinMaksimalYangBisaDipakai} Poin)</span>
                  <span className="font-bold">- Rp {finalPointsDiscount.toLocaleString('id-ID')}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-base font-bold text-gray-300">Total Tagihan</span>
                <span className="text-3xl font-black text-[#f6debe]">Rp {finalTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* INPUT NAMA PEMESAN (OTOMATIS DIKUNCI KALAU SUDAH LOGIN MEMBER) */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-gray-200 uppercase tracking-widest mb-2">Nama Pemesan</label>
              <input 
                type="text" 
                required 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)} 
                disabled={isLoggedIn} 
                className={`w-full bg-[#1F0303]/60 border border-[#4A0D0D] focus:border-[#D4A373] px-4 py-3 rounded-xl text-gray-200 text-sm outline-none transition-all placeholder-stone-600 ${isLoggedIn ? 'opacity-60 cursor-not-allowed select-none' : ''}`} 
                placeholder="Masukkan nama kamu di sini..." 
              />
              {isLoggedIn && (
                <p className="text-[10px] text-amber-200/70 mt-1.5">✨ Sesi member aktif. Nama dikunci otomatis agar riwayat poin tersinkronisasi.</p>
              )}
            </div>

            {/* PANEL INPUT VOUCHER */}
            <div className="mb-4 p-4 bg-[#1F0303]/50 rounded-2xl border border-dashed border-[#5C1414]">
              <label className="block text-[10px] font-bold text-[#ffeed8] uppercase tracking-widest mb-2">🎟️ Punya Kode Voucher?</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="MEMBERBARU20, CIKO10, HEMAT5K" 
                  className="flex-1 bg-black/40 border border-[#4A0D0D] focus:border-[#D4A373] px-4 py-2.5 rounded-xl text-xs text-white outline-none uppercase tracking-wider placeholder-stone-600" 
                />
                <button 
                  onClick={handleApplyVoucher}
                  className="px-5 py-2.5 bg-[#4A0D0D] hover:bg-[#5C1414] border border-[#D4A373]/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors active:scale-95"
                >
                  Pakai
                </button>
              </div>
              {voucherMessage.text && (
                <p className={`text-xs mt-2 font-medium ${voucherMessage.type === 'success' ? 'text-amber-200' : 'text-red-400'}`}>
                  {voucherMessage.type === 'success' ? '✔️' : '⚠️'} {voucherMessage.text}
                </p>
              )}
            </div>

            {/* 🔥 PANEL BARU: FITUR TUKAR POIN MEMBER */}
            {isLoggedIn && userPoints > 0 && (
              <div className="mb-6 p-4 bg-[#801414]/10 rounded-2xl border border-[#4A0D0D] flex items-center justify-between shadow-inner">
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">🪙 Gunakan Poin Cikoyou</p>
                  <p className="text-[11px] text-[#ffeed8]/80 mt-0.5">
                    Miliki <span className="text-amber-300 font-bold">{userPoints} Poin</span> (1 Poin = Rp 100)
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={usePointsDiscount} 
                    onChange={(e) => setUsePointsDiscount(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-700/80 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            )}

            {/* OPSI METODE PEMBAYARAN */}
            <h3 className="text-xs font-bold text-[#ffeed8] uppercase tracking-widest mb-4">Pilih Metode Pembayaran</h3>
            <div className="space-y-3 mb-8">
              <label className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'cash' ? 'bg-[#801414]/20 border-[#D4A373]' : 'bg-[#1F0303]/60 border-transparent hover:border-[#4A0D0D]'}`}>
                <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={(e) => { setPaymentMethod(e.target.value); setReceiptPreview(''); }} className="w-4 h-4 accent-[#D4A373]" />
                <div className="text-xl">💵</div>
                <div>
                  <p className="font-bold text-white text-sm">Cash (Bayar di Tempat)</p>
                  <p className="text-[11px] text-[#ffeed8]">Bayar langsung saat mengambil pesanan.</p>
                </div>
              </label>

              <label className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'transfer' ? 'bg-[#801414]/20 border-[#D4A373]' : 'bg-[#1F0303]/60 border-transparent hover:border-[#4A0D0D]'}`}>
                <input type="radio" name="payment" value="transfer" checked={paymentMethod === 'transfer'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 accent-[#D4A373]" />
                <div className="text-xl">🏦</div>
                <div>
                  <p className="font-bold text-white text-sm">Transfer Bank</p>
                  <p className="text-[11px] text-[#ffeed8]">BCA, Mandiri, BNI, BRI.</p>
                </div>
              </label>

              <label className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'qris' ? 'bg-[#801414]/20 border-[#D4A373]' : 'bg-[#1F0303]/60 border-transparent hover:border-[#4A0D0D]'}`}>
                <input type="radio" name="payment" value="qris" checked={paymentMethod === 'qris'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 accent-[#D4A373]" />
                <div className="text-xl">📱</div>
                <div>
                  <p className="font-bold text-white text-sm">QRIS</p>
                  <p className="text-[11px] text-[#ffeed8]">Scan via GoPay, OVO, Dana, M-Banking.</p>
                </div>
              </label>
            </div>

            {/* DETIL UNTUK METODE TRANSFER BANK */}
            {paymentMethod === 'transfer' && (
              <div className="mb-6 p-4 bg-[#120101] rounded-2xl border border-[#4A0D0D] text-center">
                <p className="text-[10px] text-stone-500 uppercase tracking-widest">Transfer ke BCA:</p>
                <p className="text-xl font-black text-white tracking-widest my-1">8910 1112 13</p>
                <p className="text-xs text-[#ffeed8] font-medium mb-4">a.n Cikoyou Indonesia</p>
              </div>
            )}
            
            {/* DETIL UNTUK METODE QRIS */}
            {paymentMethod === 'qris' && (
              <div className="mb-6 p-4 bg-[#120101] rounded-2xl border border-[#4A0D0D] flex flex-col items-center">
                <p className="text-xs text-[#ffeed8] mb-4">Scan QR Code ini untuk membayar:</p>
                <div className="relative w-72 h-72 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white mb-4">
                  <Image src="/qris-code.jpeg" alt="QRIS Cikoyou" fill className="object-contain p-2" />
                </div>
              </div>
            )}

            {/* INPUT UNTUK UPLOAD BUKTI PEMBAYARAN */}
            {(paymentMethod === 'transfer' || paymentMethod === 'qris') && (
              <div className="mb-8 p-5 bg-[#120101]/90 rounded-2xl border border-dashed border-[#5C1414]">
                <label className="block text-[10px] font-bold text-gray-200 uppercase tracking-widest mb-3">📸 Unggah Bukti Pembayaran (Wajib)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleReceiptChange}
                  className="hidden" 
                  id="receipt-upload" 
                />
                <label 
                  htmlFor="receipt-upload" 
                  className="flex flex-col items-center justify-center p-6 border border-[#4A0D0D] bg-black/20 rounded-xl cursor-pointer hover:border-[#D4A373] transition-all group min-h-[140px]"
                >
                  {receiptPreview ? (
                    <div className="flex flex-col items-center w-full gap-3">
                      <div className="relative w-full h-44 rounded-lg overflow-hidden border border-[#4A0D0D]">
                        <Image src={receiptPreview} alt="Pratinjau Bukti" fill className="object-contain" />
                      </div>
                      <span className="text-[11px] text-amber-200 bg-[#801414]/30 px-3 py-1 rounded-full border border-[#801414]">Klik untuk ganti foto</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📤</span>
                      <span className="text-xs text-[#ffeed8] font-semibold text-center">Klik di sini untuk memilih gambar bukti pembayaran</span>
                      <span className="text-[10px] text-stone-500 mt-1">Mendukung format JPG, PNG (Maks 5MB)</span>
                    </>
                  )}
                </label>
              </div>
            )}

            <button 
              onClick={handlePay} 
              className="w-full py-4 bg-gradient-to-r from-[#801414] to-[#4A0D0D] hover:from-[#A61C1C] hover:to-[#5C1414] text-white font-black tracking-widest uppercase rounded-2xl transition-all active:scale-95 shadow-xl border border-[#A61C1C]/30 text-sm"
            >
              {paymentMethod === 'qris' && receiptPreview ? 'Sistem Baca QRIS Sukses & Selesaikan' : 'Selesaikan Pesanan'}
            </button>
          </div>
        </main>
      )}

      {/* VIEW: REKAP & STATUS PESANAN */}
      {currentView === 'status' && (
        <main className="max-w-xl mx-auto px-6 pt-32 pb-20 relative z-10 text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-4 transition-all duration-500 ${
            orderStatus === 'Selesai' ? 'bg-green-500/20 border-green-500 text-green-400' :
            orderStatus === 'Dibatalkan' ? 'bg-red-500/20 border-red-500 text-red-400' :
            'bg-[#801414]/20 border-[#D4A373] text-[#D4A373]'
          }`}>
            <span className="text-5xl">{orderStatus === 'Selesai' ? '✅' : orderStatus === 'Dibatalkan' ? '❌' : '⏱️'}</span>
          </div>
          
          <h2 className="text-4xl font-black mb-2 text-white uppercase tracking-wide">Pesanan Berhasil!</h2>
          <p className="text-sm text-[#ffeed8] mb-8">Terima kasih <span className="font-bold text-[#D4A373]">{customerName}</span>, pantau terus status dapur kami di bawah ini.</p>

          <div className="bg-[#2C0707]/40 border border-[#4A0D0D] p-6 rounded-[2rem] text-left mb-8 shadow-2xl">
            <div className="flex justify-between border-b border-[#4A0D0D] pb-4 mb-4 text-sm">
              <span className="text-[#ffeed8]">ID Pesanan</span>
              <span className="font-bold text-gray-300 tracking-wider">{orderId}</span>
            </div>
            <div className="flex justify-between border-b border-[#4A0D0D] pb-4 mb-4 text-sm">
              <span className="text-[#ffeed8]">Metode</span>
              <span className="font-bold text-gray-200 uppercase tracking-wide">{paymentMethod}</span>
            </div>
            
            <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-white/5 mb-4">
              <span className="text-xs text-[#ffeed8] font-bold uppercase tracking-wider">Status Dapur</span>
              <span className={`font-black text-xs uppercase px-3 py-1 rounded-md border ${
                orderStatus === 'Selesai' ? 'text-green-400 bg-green-500/10 border-green-500/30' :
                (orderStatus === 'Dibatalkan' || orderStatus === 'Ditolak' || orderStatus === 'Pesanan Ditolak') ? 'text-red-400 bg-red-500/10 border-red-500/30' :
                orderStatus === 'Pesanan Masuk' ? 'text-yellow-200 bg-yellow-500/10 border-yellow-500/30 animate-pulse' :
                'text-amber-300 bg-orange-500/10 border-orange-500/30 animate-pulse'
              }`}>
                {orderStatus === 'Selesai' 
                  ? 'Siap Diambil 🎉' 
                  : (orderStatus === 'Dibatalkan' || orderStatus === 'Ditolak' || orderStatus === 'Pesanan Ditolak') 
                    ? 'Dibatalkan ❌' 
                    : orderStatus === 'Menunggu Pembayaran' 
                      ? 'Menunggu Bayar ⏳' 
                      : 'Sedang Diproses 🍳'
                }
              </span>
            </div>
            
            {/* TAMPILAN BUKTI PEMBAYARAN DI NOTA STATUS */}
            {receiptPreview && (
              <div className="border-t border-[#4A0D0D] pt-4 mt-2">
                <span className="text-[10px] font-bold text-[#ffeed8] uppercase tracking-widest block mb-2">📄 Bukti Transfer Kamu:</span>
                <div className="relative w-full h-40 bg-black/40 border border-[#4A0D0D] rounded-xl overflow-hidden p-1">
                  <Image src={receiptPreview} alt="Bukti Pembayaran Tersimpan" fill className="object-contain" />
                </div>
              </div>
            )}
          </div>

          <button onClick={handleBackToMenu} className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-[#5C1414] text-white font-bold text-xs uppercase tracking-widest rounded-full transition-colors">
            Tutup & Pesan Lagi
          </button>
        </main>
      )}

      {/* DRAWERS PANEL: KERANJANG BELANJA SLIDEOUT */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#1A0202] z-50 shadow-[-10px_0_40px_rgba(0,0,0,0.8)] flex flex-col border-l border-[#4A0D0D] transform transition-transform duration-300">
            <div className="p-5 border-b border-[#4A0D0D] flex items-center justify-between bg-[#2C0707]">
              <h2 className="text-lg font-black text-[#ffeed8] uppercase tracking-wider">🛒 Keranjang Saya</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-2xl text-gray-300 hover:text-white">&times;</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center text-stone-500 text-sm mt-12 font-medium">Keranjang masih kosong nih :(</div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="bg-[#2C0707]/30 border border-white/5 p-3 rounded-2xl flex items-center gap-4 shadow-inner">
                    <div className="relative w-12 h-12 shrink-0 drop-shadow-md bg-[#1F0303] rounded-xl p-1 border border-[#4A0D0D]">
                      <Image src={item.image} alt={item.name} fill sizes="48px" className="object-contain" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <p className="text-xs text-[#ffeed8] font-semibold mt-0.5">Rp {item.price.toLocaleString('id-ID')} x {item.quantity}</p>
                    </div>
                    <button onClick={() => handleRemoveFromCart(item.id)} className="text-[10px] font-bold bg-[#801414]/40 hover:bg-[#801414] text-white px-3 py-1.5 rounded-lg border border-[#A61C1C]/20 transition-all uppercase tracking-wider">
                      Hapus
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 bg-[#2C0707] border-t border-[#4A0D0D]">
                <div className="flex justify-between items-center mb-5">
                  <span className="text-xs text-[#ffeed8] font-bold uppercase tracking-wider">Total Harga:</span>
                  <span className="text-2xl font-black text-gray-200">Rp {cartTotal.toLocaleString('id-ID')}</span>
                </div>
                <button 
                  onClick={handleProceedToCheckout} 
                  className="w-full py-3.5 bg-gradient-to-r from-[#801414] to-[#4A0D0D] hover:from-[#A61C1C] text-white font-black text-xs tracking-widest uppercase rounded-xl border border-[#A61C1C]/30 shadow-lg"
                >
                  Proses Checkout ➡️
                </button>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}