"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface UserAccount {
  name: string;
  email: string;
  phone: string;
  memberTier: string;
  memberId: string;
  points: number;
  joinDate: string;
  password?: string;
}

export default function AccountPage() {
  // --- STATE UTAMA ---
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // --- STATE INPUT FORM ---
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // --- STATE UI DASHBOARD ---
  const [activeTab, setActiveTab] = useState<'dashboard' | 'voucher' | 'favorit'>('dashboard');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [authError, setAuthError] = useState('');

  // --- 1. MENGAMBIL SESI ---
  useEffect(() => {
    const session = localStorage.getItem('cikoyou_session');
    if (session) {
      setCurrentUser(JSON.parse(session));
      setIsLoggedIn(true);
    }
    setIsLoaded(true);
  }, []);

  // --- 2. FUNGSI PENDAFTARAN (REGISTER) ---
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const localUsers = JSON.parse(localStorage.getItem('cikoyou_database') || '[]');
    
    // Mencegah error huruf besar/kecil dan spasi
    const safeEmail = regEmail.toLowerCase().trim();
    
    const isExist = localUsers.some((u: UserAccount) => u.email === safeEmail);
    if (isExist) {
      setAuthError('Email ini sudah terdaftar! Silakan beralih ke menu Masuk.');
      return;
    }

    const newUser: UserAccount = {
      name: regName,
      email: safeEmail,
      phone: regPhone,
      password: regPassword,
      memberTier: 'New Member 🏆',
      memberId: `CKY-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      points: 100,
      joinDate: 'Juni 2026'
    };

    localUsers.push(newUser);
    localStorage.setItem('cikoyou_database', JSON.stringify(localUsers));
    localStorage.setItem('cikoyou_session', JSON.stringify(newUser));
    
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setActiveTab('dashboard');

    setRegName(''); setRegEmail(''); setRegPhone(''); setRegPassword('');
  };

  // --- 3. FUNGSI MASUK (LOGIN) ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const localUsers = JSON.parse(localStorage.getItem('cikoyou_database') || '[]');
    const safeEmail = loginEmail.toLowerCase().trim();
    
    const foundUser = localUsers.find((u: UserAccount) => u.email === safeEmail && u.password === loginPassword);

    if (foundUser) {
      localStorage.setItem('cikoyou_session', JSON.stringify(foundUser));
      setCurrentUser(foundUser);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      setLoginEmail('');
      setLoginPassword('');
    } else {
      setAuthError('Email atau password salah / Belum terdaftar!');
    }
  };

  // --- 4. FUNGSI KELUAR ---
  const handleConfirmLogout = () => {
    localStorage.removeItem('cikoyou_session');
    setCurrentUser(null);
    setIsLoggedIn(false);
    setIsLogoutModalOpen(false);
    setAuthMode('login');
  };

  // --- 5. FUNGSI SALIN KODE ---
  const handleCopyCode = (code: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(code)
        .then(() => {
          setCopiedCode(code);
          setTimeout(() => setCopiedCode(null), 2000);
        })
        .catch(() => {
          alert('Ups, gagal menyalin kode.');
        });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        document.execCommand('copy');
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
      } catch (error) {
        alert('Ups, fitur salin tidak didukung oleh browsermu.');
      }
      document.body.removeChild(textArea);
    }
  };

  if (!isLoaded) {
    return <div className="min-h-screen bg-[#1F0303] flex items-center justify-center text-[#D4A373] text-sm tracking-widest uppercase font-bold">Memuat Ruang Member...</div>;
  }

  return (
    <div className="min-h-screen bg-[#1F0303] text-[#F5E6D3] font-sans selection:bg-[#801414] selection:text-white antialiased relative overflow-hidden">
      
      {/* 🌟 LUXURIOUS AMBIENT LIGHT */}
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
            <Link href="/contact" className="text-sm font-bold text-[#D1BFA7] tracking-wide hover:text-white transition-colors">Contact</Link>
          </nav>

          {/* KANAN - Tombol Aksi Dinamis */}
          <div className="pr-1">
            {isLoggedIn ? (
              <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className="bg-[#801414] hover:bg-[#A61C1C] text-white font-black text-xs sm:text-sm uppercase tracking-wider py-2.5 px-6 rounded-full border border-[#A61C1C]/40 shadow-lg transition-all active:scale-95 whitespace-nowrap hidden sm:block"
              >
                Keluar
              </button>
            ) : (
              <div className="bg-[#D4A373] text-[#1F0303] font-black text-xs sm:text-sm uppercase tracking-wider py-2.5 px-6 rounded-full border border-[#D4A373] shadow-[0_0_15px_rgba(212,163,115,0.4)] whitespace-nowrap hidden sm:block">
                Member Area
              </div>
            )}
          </div>

        </header>
      </div>

      {/* ================= BELUM LOGIN ================= */}
      {!isLoggedIn ? (
        <main className="max-w-md mx-auto px-6 pt-32 pb-16 relative z-10 flex flex-col justify-center min-h-screen">
          <div className="bg-[#2C0707]/40 border border-[#4A0D0D] p-8 rounded-[2.5rem] backdrop-blur-sm shadow-2xl">
            
            {/* Navigasi Toggle Menus */}
            <div className="flex border-b border-[#4A0D0D] mb-6">
              <button 
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
                className={`flex-1 pb-3 text-sm font-black uppercase tracking-wider border-b-2 transition-all ${authMode === 'register' ? 'border-[#ffeed8] text-[#ffeed8]' : 'border-transparent text-[#D1BFA7] hover:text-[#D4A373]'}`}
              >
                📝 Daftar
              </button>
              <button 
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                className={`flex-1 pb-3 text-sm font-black uppercase tracking-wider border-b-2 transition-all ${authMode === 'login' ? 'border-[#ffeed8] text-[#ffeed8]' : 'border-transparent text-[#D1BFA7] hover:text-[#D4A373]'}`}
              >
                🔐 Masuk
              </button>
            </div>

            {authError && (
              <div className="mb-6 p-3 bg-red-950/50 border border-red-500/50 rounded-xl text-xs text-red-300 text-center font-bold">
                ⚠️ {authError}
              </div>
            )}

            {/* FORM DAFTAR */}
            {authMode === 'register' ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#ffeed8] uppercase tracking-widest mb-2">Nama Lengkap</label>
                  <input type="text" required placeholder="Contoh: Ahmad Rafli" value={regName} onChange={(e) => setRegName(e.target.value)} className="w-full bg-[#1F0303]/60 border border-[#4A0D0D] focus:border-[#ffeed8] px-4 py-3 rounded-xl text-sm text-white outline-none transition-all placeholder-stone-600" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#ffeed8] uppercase tracking-widest mb-2">Email Aktif</label>
                  <input type="email" required placeholder="nama@email.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="w-full bg-[#1F0303]/60 border border-[#4A0D0D] focus:border-[#ffeed8] px-4 py-3 rounded-xl text-sm text-white outline-none transition-all placeholder-stone-600" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#ffeed8] uppercase tracking-widest mb-2">Nomor WhatsApp</label>
                  <input type="tel" required placeholder="0812xxxxxxxx" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} className="w-full bg-[#1F0303]/60 border border-[#4A0D0D] focus:border-[#ffeed8] px-4 py-3 rounded-xl text-sm text-white outline-none transition-all placeholder-stone-600" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#ffeed8] uppercase tracking-widest mb-2">Buat Password</label>
                  <input type="password" required placeholder="••••••••" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className="w-full bg-[#1F0303]/60 border border-[#4A0D0D] focus:border-[#ffeed8] px-4 py-3 rounded-xl text-sm text-white outline-none transition-all placeholder-stone-600" />
                </div>
                <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#801414] to-[#4A0D0D] hover:from-[#A61C1C] hover:to-[#5C1414] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 border border-[#A61C1C]/30 shadow-lg mt-6">
                  Buat Akun Member ➔
                </button>
              </form>
            ) : (
              /* FORM MASUK (LOGIN) */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#ffeed8] uppercase tracking-widest mb-2">Email Member</label>
                  <input type="email" required placeholder="nama@email.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full bg-[#1F0303]/60 border border-[#4A0D0D] focus:border-[#ffeed8] px-4 py-3 rounded-xl text-sm text-white outline-none transition-all placeholder-stone-600" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#ffeed8] uppercase tracking-widest mb-2">Password</label>
                  <input type="password" required placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full bg-[#1F0303]/60 border border-[#4A0D0D] focus:border-[#ffeed8] px-4 py-3 rounded-xl text-sm text-white outline-none transition-all placeholder-stone-600" />
                </div>
                <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#801414] to-[#4A0D0D] hover:from-[#A61C1C] hover:to-[#5C1414] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 border border-[#A61C1C]/30 shadow-lg mt-6">
                  Masuk Ke Aplikasi ➔
                </button>
              </form>
            )}
          </div>
        </main>
      ) : (
        
        // ================= SUDAH LOGIN: SCREEN DASHBOARD =================
        <main className="max-w-5xl mx-auto px-6 pt-32 pb-16 relative z-10">
          
          {/* PROFILE CARD */}
          <div className="bg-[#2C0707]/40 border border-[#4A0D0D] p-8 rounded-[2.5rem] backdrop-blur-sm shadow-xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="relative w-24 h-24 bg-gradient-to-br from-[#801414] to-[#4A0D0D] rounded-full p-1 border border-[#D4A373]/40 shadow-lg">
                <div className="w-full h-full bg-[#1F0303] rounded-full flex items-center justify-center text-2xl font-black text-[#ffeed8]">
                  {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'CK'}
                </div>
                <span className="absolute bottom-0 right-0 bg-[#801414] text-white text-[10px] px-2 py-0.5 rounded-full font-black border border-[#D4A373]/50 shadow-md">PRO</span>
              </div>
              
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-[#D4A373]/20 text-amber-200 border border-[#D4A373]/40">
                  {currentUser?.memberTier}
                </span>
                <h2 className="text-2xl font-black text-gray-200 mt-3">{currentUser?.name}</h2>
                <p className="text-xs text-[#ffeed8] mt-1">ID Member: {currentUser?.memberId} &bull; Gabung {currentUser?.joinDate}</p>
              </div>
            </div>

            <div className="bg-[#1F0303]/60 border border-[#4A0D0D] px-8 py-5 rounded-2xl text-center md:text-right min-w-[200px] shadow-inner">
              <p className="text-[10px] text-stone-300 font-bold uppercase tracking-widest">Cikoyou Points</p>
              <p className="text-4xl font-black text-amber-300 mt-1 tracking-tight">
                {currentUser?.points.toLocaleString('id-ID')} <span className="text-xs text-[#D1BFA7] font-medium">Pts</span>
              </p>
            </div>
          </div>

          {/* TWO COLUMNS LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* TABS KIRI */}
            <div className="lg:col-span-4 space-y-3">
              {[
                { id: 'dashboard', label: '👤 Informasi Akun', desc: 'Detail data diri terdaftar' },
                { id: 'voucher', label: '🎟️ Voucher Kupon', desc: 'Klaim penawaran khusus' },
                { id: 'favorit', label: '⭐ Varian Terfavorit', desc: 'Rekomendasi menu pilihan' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex flex-col ${activeTab === tab.id ? 'bg-gradient-to-r from-[#801414] to-[#4A0D0D] border-[#D4A373]/50 shadow-lg text-white scale-[1.02]' : 'bg-[#1F0303]/40 border-[#4A0D0D] hover:border-[#D4A373]/30 text-[#ffeed8]'}`}
                >
                  <span className="text-sm font-bold">{tab.label}</span>
                  <span className={`text-[11px] mt-1 ${activeTab === tab.id ? 'text-[#ffeed8]' : 'text-stone-400'}`}>{tab.desc}</span>
                </button>
              ))}

              <button onClick={() => setIsLogoutModalOpen(true)} className="w-full text-left p-5 rounded-2xl border border-[#4A0D0D] bg-[#1F0303]/40 hover:bg-[#801414]/20 transition-all flex items-center gap-3 text-[#ffeed8] mt-6 hover:text-white">
                <span className="text-sm font-bold">🔄 Keluar / Ganti Akun</span>
              </button>
            </div>

            {/* TAB KONTEN KANAN */}
            <div className="lg:col-span-8 bg-[#2C0707]/40 border border-[#4A0D0D] p-8 rounded-[2.5rem] backdrop-blur-sm shadow-xl min-h-[350px]">
              
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-white border-b border-[#4A0D0D] pb-4 uppercase tracking-wide">Informasi Akun</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Nama Lengkap</label>
                      <p className="bg-[#1F0303]/60 border border-[#4A0D0D] px-4 py-3 rounded-xl text-white font-medium">{currentUser?.name}</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Alamat Email</label>
                      <p className="bg-[#1F0303]/60 border border-[#4A0D0D] px-4 py-3 rounded-xl text-white font-medium">{currentUser?.email}</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Nomor Handphone</label>
                      <p className="bg-[#1F0303]/60 border border-[#4A0D0D] px-4 py-3 rounded-xl text-white font-medium">{currentUser?.phone}</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Status Membership</label>
                      <p className="bg-[#D4A373]/10 border border-[#D4A373]/30 px-4 py-3 rounded-xl font-black text-amber-200">{currentUser?.memberTier}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'voucher' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-white border-b border-[#4A0D0D] pb-4 uppercase tracking-wide">Kupon Member Baru</h3>
                  <div className="bg-[#1F0303]/60 border border-[#4A0D0D] p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-inner">
                    <div>
                      <h4 className="text-lg font-black text-gray-200 mb-1">Diskon Selamat Datang 20%</h4>
                      <p className="text-xs text-[#ffeed8]">Potongan harga eksklusif untuk pendaftaran anggota baru.</p>
                      <p className="text-[10px] font-bold text-amber-200 mt-3 bg-[#D4A373]/10 inline-block px-2 py-1 rounded border border-[#D4A373]/20">⌛ Kadaluarsa: 31 Des 2026</p>
                    </div>
                    <button
                      onClick={() => handleCopyCode('MEMBERBARU20')}
                      className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all min-w-[130px] border shadow-lg ${copiedCode === 'MEMBERBARU20' ? 'bg-green-600/20 border-green-500/50 text-green-400' : 'bg-[#801414] text-white border-[#A61C1C]/30 hover:bg-[#A61C1C]'}`}
                    >
                      {copiedCode === 'MEMBERBARU20' ? '📋 TERSALIN!' : '✂️ SALIN KODE'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'favorit' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-white border-b border-[#4A0D0D] pb-4 uppercase tracking-wide">Rekomendasi Menu Populer</h3>
                  <div className="bg-[#1F0303]/60 border border-[#4A0D0D] p-4 rounded-2xl flex items-center gap-5 hover:border-[#D4A373]/30 transition-colors cursor-pointer group">
                    <div className="relative w-20 h-20 shrink-0 bg-[#2C0707] rounded-xl p-2 border border-[#4A0D0D]">
                      <Image src="/cirengayamm.png" alt="Cireng" fill className="object-contain drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black bg-[#D4A373]/20 text-[#ffeed8] border border-[#D4A373]/30 px-2 py-1 rounded uppercase tracking-widest">🔥 Terlaris</span>
                      <h4 className="text-base font-bold text-white mt-2 group-hover:text-gray-200 transition-colors">Cireng Isi Ayam Suir</h4>
                      <Link href="/order" className="text-[11px] text-stone-400 hover:text-white font-bold block mt-2 transition-colors uppercase tracking-wider">Lihat Katalog Menu ➔</Link>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer className="mt-10 border-t border-[#4A0D0D] bg-[#2C0707]/30 py-6 text-center text-xs font-medium text-gray-200 relative z-10">
        &copy; {new Date().getFullYear()} Cikoyou E-Commerce. All rights reserved.
      </footer>

      {/* MODAL CONFIRMATION LOG OUT */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#2C0707] border border-[#4A0D0D] p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="text-5xl mb-4">🚪</div>
            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">Konfirmasi Keluar</h3>
            <p className="text-sm text-[#ffeed8] mb-8">Apakah Anda yakin ingin keluar? Sesi Anda akan diakhiri.</p>
            <div className="flex gap-4">
              <button onClick={() => setIsLogoutModalOpen(false)} className="flex-1 py-3.5 bg-[#1F0303]/60 hover:bg-[#1F0303] text-white text-xs uppercase tracking-widest font-bold rounded-xl border border-[#4A0D0D] transition-colors">Batal</button>
              <button onClick={handleConfirmLogout} className="flex-1 py-3.5 bg-gradient-to-r from-[#801414] to-[#4A0D0D] hover:from-[#A61C1C] hover:to-[#5C1414] text-white text-xs uppercase tracking-widest font-bold rounded-xl border border-[#A61C1C]/30 transition-all shadow-lg">Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}