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
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface Order {
  id: string;
  customerName: string;
  items: string;
  totalPrice: number;
  status: 'Menunggu Pembayaran' | 'Pesanan Masuk' | 'Selesai' | 'Dibatalkan' | 'Ditolak';
  date: string;
  paymentMethod?: string; // 'QRIS' atau 'Transfer Bank'
  paymentProof?: string;  // URL atau Base64 string gambar bukti pembayaran
}

const initialProducts: Product[] = [
  { id: 1, name: 'Cireng Ayam Suir', price: 10000, image: '/cirengayamm.png' },
  { id: 2, name: 'Cireng Kuah Chili Oil', price: 16000, image: '/cirengkuahh.png' }
];

export default function AdminPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'users' | 'products'>('overview');
  
  const [usersDatabase, setUsersDatabase] = useState<UserAccount[]>([]);
  const [productsDatabase, setProductsDatabase] = useState<Product[]>([]);
  const [ordersDatabase, setOrdersDatabase] = useState<Order[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product>({ id: 0, name: '', price: 0, image: '' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // State baru untuk memperbesar foto bukti pembayaran pembeli
  const [selectedProofImage, setSelectedProofImage] = useState<string | null>(null);

  const [orderActionState, setOrderActionState] = useState<{
    isOpen: boolean;
    actionType: 'cancel' | 'reject' | 'delete' | null;
    orderId: string | null;
  }>({ isOpen: false, actionType: null, orderId: null });

  useEffect(() => {
    const adminSession = localStorage.getItem('cikoyou_admin_session');
    if (adminSession === 'active') {
      setIsAdminLoggedIn(true);
      fetchUsersData();
      fetchOrdersData();
      fetchProductsData();
    }
    setIsLoaded(true);
  }, []);

  const fetchUsersData = () => {
    const localUsers = JSON.parse(localStorage.getItem('cikoyou_database') || '[]');
    setUsersDatabase(localUsers);
  };

  const fetchOrdersData = () => {
    const localOrders = JSON.parse(localStorage.getItem('cikoyou_orders') || '[]');
    setOrdersDatabase(localOrders);
  };

  const fetchProductsData = () => {
    const localProducts = localStorage.getItem('cikoyou_products');
    if (localProducts) {
      setProductsDatabase(JSON.parse(localProducts));
    } else {
      setProductsDatabase(initialProducts);
      localStorage.setItem('cikoyou_products', JSON.stringify(initialProducts));
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (loginEmail === 'admin@cikoyou.com' && loginPassword === 'admin123') {
      localStorage.setItem('cikoyou_admin_session', 'active');
      setIsAdminLoggedIn(true);
      fetchUsersData();
      fetchOrdersData();
      fetchProductsData();
    } else {
      setAuthError('Kredensial Admin tidak valid!');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('cikoyou_admin_session');
    setIsAdminLoggedIn(false);
    setLoginEmail('');
    setLoginPassword('');
  };

  const handleApprovePayment = (orderId: string) => {
    const updatedOrders = ordersDatabase.map(o => o.id === orderId ? { ...o, status: 'Pesanan Masuk' as const } : o);
    setOrdersDatabase(updatedOrders);
    localStorage.setItem('cikoyou_orders', JSON.stringify(updatedOrders));
  };

  const handleCompleteOrder = (orderId: string) => {
    const updatedOrders = ordersDatabase.map(o => o.id === orderId ? { ...o, status: 'Selesai' as const } : o);
    setOrdersDatabase(updatedOrders);
    localStorage.setItem('cikoyou_orders', JSON.stringify(updatedOrders));
  };

  const handleCancelOrderClick = (orderId: string) => {
    setOrderActionState({ isOpen: true, actionType: 'cancel', orderId });
  };

  const handleRejectOrderClick = (orderId: string) => {
    setOrderActionState({ isOpen: true, actionType: 'reject', orderId });
  };

  const handleDeleteOrderClick = (orderId: string) => {
    setOrderActionState({ isOpen: true, actionType: 'delete', orderId });
  };

  const executeOrderAction = () => {
    const { actionType, orderId } = orderActionState;
    if (!orderId) return;

    let updatedOrders = [...ordersDatabase];

    if (actionType === 'cancel') {
      updatedOrders = updatedOrders.map(o => o.id === orderId ? { ...o, status: 'Dibatalkan' as const } : o);
    } else if (actionType === 'reject') {
      // 🌟 UBAH DI SINI: Mengubah status 'Ditolak' menjadi 'Dibatalkan' agar seragam
      updatedOrders = updatedOrders.map(o => o.id === orderId ? { ...o, status: 'Dibatalkan' as const } : o);
    } else if (actionType === 'delete') {
      updatedOrders = updatedOrders.filter(o => o.id !== orderId);
    }

    setOrdersDatabase(updatedOrders);
    localStorage.setItem('cikoyou_orders', JSON.stringify(updatedOrders));
    setOrderActionState({ isOpen: false, actionType: null, orderId: null });
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      const updatedProducts = productsDatabase.filter(p => p.id !== productToDelete.id);
      setProductsDatabase(updatedProducts);
      localStorage.setItem('cikoyou_products', JSON.stringify(updatedProducts));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleOpenForm = (product?: Product) => {
    if (product) {
      setIsEditing(true);
      setCurrentProduct(product);
    } else {
      setIsEditing(false);
      setCurrentProduct({ id: Date.now(), name: '', price: 0, image: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedProducts;
    
    if (isEditing) {
      updatedProducts = productsDatabase.map(p => p.id === currentProduct.id ? currentProduct : p);
    } else {
      updatedProducts = [...productsDatabase, currentProduct];
    }
    
    setProductsDatabase(updatedProducts);
    localStorage.setItem('cikoyou_products', JSON.stringify(updatedProducts));
    setIsModalOpen(false);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#1F0303] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-4 border-[#801414]/30 border-t-[#D4A373] rounded-full animate-spin"></div>
        <p className="text-[#F5E6D3] text-xs font-bold uppercase tracking-[0.2em] animate-pulse">Menyiapkan Portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1F0303] text-[#F5E6D3] font-sans selection:bg-[#801414] selection:text-white antialiased relative overflow-hidden">
      
      {/* 🌟 LUXURIOUS VELVET TEXTURE & GLOW SHADOWS */}
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[80vw] h-[80vw] max-w-[800px] bg-[#801414]/25 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[#D4A373]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-[#4A0D0D]/30 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER NAV */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
        <div className="flex items-center justify-between px-6 py-3 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#D4A373]/50 shadow-[0_0_15px_rgba(212,163,115,0.3)]">
              <Image 
                src="/fotocikoyou.png" 
                alt="Logo Cikoyou" 
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500" 
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-lg font-black tracking-widest text-white leading-none drop-shadow-md">CIKOYOU</h1>
              <p className="text-[9px] tracking-[0.25em] text-[#ffeed8] font-bold uppercase mt-1">Admin Space</p>
            </div>
          </Link>
          
          {isAdminLoggedIn && (
            <button onClick={handleAdminLogout} className="flex items-center gap-2 text-xs font-bold bg-white/5 hover:bg-red-500/20 text-[#F5E6D3] hover:text-red-400 px-5 py-2.5 rounded-xl border border-white/10 hover:border-red-500/30 transition-all active:scale-95">
              <span>Keluar</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          )}
        </div>
      </header>

      {!isAdminLoggedIn ? (
        // SCREEN LOGIN
        <main className="flex items-center justify-center min-h-screen px-6 relative z-10 pt-20">
          <div className="bg-black/20 border border-white/10 p-10 rounded-3xl backdrop-blur-2xl shadow-2xl max-w-sm w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#801414] to-transparent"></div>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#801414] to-[#4A0D0D] rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg border border-white/20 transform rotate-3">
                <span className="text-2xl">🔐</span>
              </div>
              <h2 className="text-2xl font-black text-[#F5E6D3] tracking-wide">Portal Admin</h2>
              <p className="text-xs text-gray-300 mt-2 font-medium">Akses eksklusif staf Cikoyou</p>
            </div>

            {authError && (
              <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-200 text-center font-bold flex items-center justify-center gap-2">
                <span>⚠️</span> {authError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#ffeed8] uppercase tracking-wider ml-1">Email</label>
                <input type="email" required placeholder="admin@cikoyou.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full bg-black/40 border border-white/10 focus:border-[#801414] px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all focus:shadow-[0_0_15px_rgba(128,20,20,0.2)]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#ffeed8] uppercase tracking-wider ml-1">Password</label>
                <input type="password" required placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full bg-black/40 border border-white/10 focus:border-[#801414] px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all focus:shadow-[0_0_15px_rgba(128,20,20,0.2)]" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-[#801414] to-[#4A0D0D] hover:from-[#a31a1a] hover:to-[#801414] border border-white/10 text-[#F5E6D3] font-black text-xs rounded-xl uppercase tracking-[0.15em] shadow-[0_5px_20px_rgba(128,20,20,0.4)] transition-all hover:-translate-y-0.5 active:scale-95 mt-4">
                Masuk Sistem
              </button>
            </form>
          </div>
        </main>
      ) : (
        // SCREEN DASHBOARD
        <main className="max-w-6xl mx-auto px-6 pb-12 pt-32 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* SIDEBAR */}
            <div className="lg:w-64 shrink-0 space-y-6">
              <div className="bg-black/20 border border-white/10 rounded-3xl p-4 backdrop-blur-xl">
                <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 px-3">Menu Dashboard</div>
                <div className="space-y-2">
                  {[
                    { id: 'overview', icon: '📊', label: 'Ringkasan' },
                    { id: 'orders', icon: '🛒', label: 'Pesanan' }, 
                    { id: 'users', icon: '👥', label: 'Data Member' },
                    { id: 'products', icon: '📦', label: 'Katalog Menu' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 text-left px-4 py-3.5 rounded-2xl transition-all font-bold text-sm group ${
                        activeTab === tab.id 
                        ? 'bg-gradient-to-r from-[#801414]/30 to-transparent border border-[#801414]/50 text-[#be9c70] shadow-[inset_4px_0_0_#D4A373]' 
                        : 'text-[#ffeed8] hover:bg-white/5 hover:text-[#F5E6D3] border border-transparent'
                      }`}
                    >
                      <span className={`text-lg transition-transform ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>{tab.icon}</span>
                      {tab.label}
                      {tab.id === 'orders' && ordersDatabase.some(o => o.status === 'Pesanan Masuk' || o.status === 'Menunggu Pembayaran') && (
                        <span className="ml-auto flex h-3 w-3 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* KONTEN UTAMA */}
            <div className="flex-1 min-w-0">
              
              {/* HEADER KONTEN */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-black text-white">
                    {activeTab === 'overview' && 'Ringkasan Bisnis'}
                    {activeTab === 'orders' && 'Manajemen Pesanan'}
                    {activeTab === 'users' && 'Database Member'}
                    {activeTab === 'products' && 'Katalog Menu'}
                  </h2>
                  <p className="text-gray-300 text-sm mt-1">Pantau dan kelola data operasional Cikoyou.</p>
                </div>

                {activeTab !== 'overview' && (
                  <button 
                    onClick={() => {
                      if(activeTab === 'orders') fetchOrdersData();
                      if(activeTab === 'users') fetchUsersData();
                      if(activeTab === 'products') handleOpenForm();
                    }} 
                    className="flex items-center justify-center gap-2 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-xl text-[#ffeed8] transition-all active:scale-95"
                  >
                    {activeTab === 'products' ? (
                      <><span>➕</span> Tambah Menu</>
                    ) : (
                      <><span>🔄</span> Segarkan Data</>
                    )}
                  </button>
                )}
              </div>

              {/* TAB: RINGKASAN */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    { title: 'Total Member', value: usersDatabase.length, suffix: 'Akun', icon: '👥', color: 'from-blue-900/40 to-blue-600/10', border: 'border-blue-500/20' },
                    { title: 'Total Transaksi', value: ordersDatabase.length, suffix: 'Pesanan', icon: '🛒', color: 'from-[#801414]/40 to-[#4A0D0D]/10', border: 'border-[#801414]/30' },
                    { title: 'Status Server', value: 'Online', suffix: 'Lancar', icon: '⚡', color: 'from-green-900/40 to-green-600/10', border: 'border-green-500/20', isOnline: true }
                  ].map((stat, i) => (
                    <div key={i} className={`bg-gradient-to-br ${stat.color} border ${stat.border} p-6 rounded-3xl backdrop-blur-xl relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
                      <div className="absolute top-4 right-4 w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-2xl border border-white/10 group-hover:rotate-12 transition-transform">
                        {stat.icon}
                      </div>
                      <div className="text-gray-300 text-[10px] font-black uppercase tracking-wider mb-2">{stat.title}</div>
                      <div className="text-4xl font-black text-[#ffeed8] flex items-end gap-2">
                        {stat.isOnline ? (
                          <div className="flex items-center gap-3 text-green-400">
                            <span className="w-3.5 h-3.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.8)]"></span>
                            Online
                          </div>
                        ) : (
                          <>
                            {stat.value} <span className="text-sm font-medium text-gray-300 mb-1">{stat.suffix}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: PESANAN */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {ordersDatabase.length === 0 ? (
                    <div className="py-20 text-center text-gray-300 text-sm font-medium bg-black/20 rounded-3xl border border-white/5 border-dashed">
                      Belum ada pesanan masuk.
                    </div>
                  ) : (
                    ordersDatabase.map((order) => (
                      <div key={order.id} className="bg-black/20 border border-white/10 p-6 rounded-3xl flex flex-col md:flex-row md:items-start justify-between gap-6 backdrop-blur-xl hover:bg-white/[0.04] transition-all">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-black text-[#ffeed8] text-xl">{order.customerName}</h4>
                            <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg border flex items-center gap-1.5 ${
                              order.status === 'Menunggu Pembayaran' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                              order.status === 'Pesanan Masuk' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]' :
                              order.status === 'Selesai' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                              'bg-red-500/10 text-red-300 border-red-500/30'
                            }`}>
                              {order.status === 'Pesanan Masuk' && <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>}
                              {order.status === 'Pesanan Masuk' ? 'Lunas - Siapkan' : order.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-300 mb-4 font-medium">
                            <span className="bg-white/10 px-2 py-0.5 rounded text-[9px]">ID: {order.id}</span>
                            <span>•</span>
                            <span>{order.date}</span>
                          </div>
                          <p className="text-sm text-[#ffeed8] bg-black/40 p-3 rounded-xl border border-white/5">{order.items}</p>
                          
                          {/* INFO METODE & BUKTI PEMBAYARAN */}
                          <div className="mt-4 flex flex-wrap items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10">
                            <div className="flex items-center gap-2">
                              <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">Metode:</div>
                              <div className="text-xs font-black text-[#be9c70] bg-[#801414]/30 px-3 py-1 rounded-lg border border-[#801414]/50">
                                {order.paymentMethod || 'Belum Dipilih'}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="text-xs font-bold text-gray-300 uppercase tracking-wider ml-2">Bukti:</div>
                              {order.paymentProof ? (
                                <div className="flex items-center gap-3">
                                  {/* 📸 FOTO PRATINJAU MINI LANGSUNG DI BARIS ADMIN */}
                                  <div 
                                    onClick={() => setSelectedProofImage(order.paymentProof!)} 
                                    className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/20 cursor-pointer hover:border-[#D4A373] transition-all group/thumb bg-black/40 shrink-0"
                                    title="Klik untuk memperbesar gambar"
                                  >
                                    <img 
                                      src={order.paymentProof} 
                                      alt="Mini Bukti" 
                                      className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300" 
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                                      <span className="text-[10px]">🔍</span>
                                    </div>
                                  </div>
                                  <button 
                                    onClick={() => setSelectedProofImage(order.paymentProof!)} 
                                    className="text-xs font-black text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/30 transition-all flex items-center gap-1.5"
                                  >
                                    Perbesar
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-lg border border-orange-500/30">Belum Upload</span>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-gray-200 font-black mt-4 text-lg">Total: Rp {order.totalPrice.toLocaleString('id-ID')}</p>
                        </div>
                        
                        <div className="flex flex-col gap-2.5 min-w-[180px]">
                          {order.status === 'Menunggu Pembayaran' && (
                            <>
                              <button onClick={() => handleApprovePayment(order.id)} className="w-full text-xs font-black bg-green-500/20 hover:bg-green-500 border border-green-500/50 text-green-300 hover:text-white px-4 py-3 rounded-xl transition-all active:scale-95">
                                ✔️ Validasi Pembayaran
                              </button>
                              <button onClick={() => handleCancelOrderClick(order.id)} className="w-full text-[10px] font-bold bg-transparent hover:bg-orange-500/20 border border-orange-500/30 px-4 py-2 rounded-xl text-orange-400 transition-all active:scale-95">
                                Batalkan Transaksi
                              </button>
                            </>
                          )}

                          {order.status === 'Pesanan Masuk' && (
                            <>
                              <button onClick={() => handleCompleteOrder(order.id)} className="w-full text-xs font-black bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-1 active:scale-95">
                                🚀 Selesaikan Pesanan
                              </button>
                              <button onClick={() => handleRejectOrderClick(order.id)} className="w-full text-[10px] font-bold bg-transparent hover:bg-red-900/60 border border-red-500/40 px-4 py-2 rounded-xl text-red-300 hover:text-white transition-all active:scale-95">
                                🛑 Tolak Pesanan
                              </button>
                            </>
                          )}

                          <div className="w-full h-[1px] bg-white/5 my-1"></div>
                          <button onClick={() => handleDeleteOrderClick(order.id)} className="w-full flex items-center justify-center gap-1.5 text-[10px] font-bold bg-transparent hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 px-4 py-2 rounded-xl text-amber-200 hover:text-red-400 transition-all active:scale-95">
                            🗑️ Hapus Riwayat
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB: DATA MEMBER */}
              {activeTab === 'users' && (
                <div className="bg-black/20 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-black/40 border-b border-white/10 text-gray-300 text-[10px] uppercase font-black tracking-widest">
                        <tr>
                          <th className="px-6 py-5">ID & Gabung</th>
                          <th className="px-6 py-5">Profil</th>
                          <th className="px-6 py-5">Kontak</th>
                          <th className="px-6 py-5">Total Poin</th>
                          <th className="px-6 py-5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {usersDatabase.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-16 text-center text-gray-300 text-sm font-medium">Belum ada member yang mendaftar.</td>
                          </tr>
                        ) : (
                          usersDatabase.map((user, index) => (
                            <tr key={index} className="hover:bg-white/[0.02] transition-colors group">
                              <td className="px-6 py-5">
                                <div className="font-bold text-[#ffeed8] text-xs bg-white/10 inline-block px-2 py-1 rounded-md mb-1">{user.memberId}</div>
                                <div className="text-[10px] text-gray-300 font-medium">{user.joinDate}</div>
                              </td>
                              <td className="px-6 py-5">
                                <div className="font-black text-[#ffeed8] text-base">{user.name}</div>
                                <div className="text-[9px] text-white font-bold bg-gradient-to-r from-[#801414] to-[#4A0D0D] inline-block px-2.5 py-1 rounded-full border border-white/20 mt-1.5 shadow-sm">{user.memberTier}</div>
                              </td>
                              <td className="px-6 py-5">
                                <div className="text-[#ffeed8] text-xs flex items-center gap-2"><span className="text-white">✉️</span> {user.email}</div>
                                <div className="text-[#ffeed8] text-xs mt-1.5 flex items-center gap-2"><span className="text-white">📱</span> {user.phone}</div>
                              </td>
                              <td className="px-6 py-5 font-black text-xl text-amber-200">
                                {user.points.toLocaleString('id-ID')}
                              </td>
                              <td className="px-6 py-5">
                                <span className="px-3 py-1.5 bg-green-500/10 text-green-400 text-[10px] font-black uppercase rounded-lg border border-green-500/20">Aktif</span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: KATALOG MENU */}
              {activeTab === 'products' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {productsDatabase.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-gray-300 text-sm font-medium bg-black/20 rounded-3xl border border-white/5 border-dashed">
                      Belum ada menu di dalam katalog.
                    </div>
                  ) : (
                    productsDatabase.map((product) => (
                      <div key={product.id} className="bg-black/20 border border-white/10 p-5 rounded-3xl flex items-center gap-5 backdrop-blur-xl hover:bg-white/[0.05] transition-all group">
                        <div className="w-20 h-20 bg-black/40 rounded-2xl shrink-0 border border-white/10 overflow-hidden shadow-inner flex items-center justify-center relative group-hover:border-[#D4A373]/50 transition-colors">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <span className="text-white/30 text-[9px] uppercase font-bold text-center p-1">No Image</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-[#ffeed8] text-base leading-tight">{product.name}</h4>
                          <p className="text-sm text-gray-300 font-black mt-2 bg-white/5 inline-block px-3 py-1 rounded-lg">Rp {product.price.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <button onClick={() => handleOpenForm(product)} className="text-[10px] font-bold bg-white/10 hover:bg-[#801414] border border-white/10 hover:border-transparent px-4 py-2 rounded-xl text-[#ffeed8] transition-all active:scale-95">✏️ Edit</button>
                          <button onClick={() => handleDeleteClick(product)} className="text-[10px] font-bold bg-transparent hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 px-4 py-2 rounded-xl text-[#ffeed8] hover:text-red-400 transition-all active:scale-95">🗑️ Hapus</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* 🌟 MODAL POP-UP UNTUK MEMPERBESAR BUKTI PEMBAYARAN */}
      {selectedProofImage && (
        <div 
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-md px-6 animate-in fade-in duration-200"
          onClick={() => setSelectedProofImage(null)}
        >
          <div className="relative max-w-xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedProofImage(null)} 
              className="absolute -top-12 right-0 text-white hover:text-red-400 text-xs font-black bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl border border-white/10 transition-colors"
            >
              ✕ Tutup
            </button>
            <div className="w-full h-[65vh] rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center p-2">
              <img 
                src={selectedProofImage} 
                alt="Bukti Pembayaran Penuh" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
              />
            </div>
          </div>
        </div>
      )}

      {/* 🌟 MODAL KONFIRMASI AKSI PESANAN */}
      {orderActionState.isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
          <div className="bg-[#1F0303] border border-white/10 p-6 rounded-3xl max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Konfirmasi</h3>
            <p className="text-sm text-gray-300 mb-6">
              Apakah Anda yakin ingin {orderActionState.actionType === 'cancel' ? 'membatalkan' : orderActionState.actionType === 'reject' ? 'menolak' : 'menghapus'} pesanan dengan ID <span className="font-mono font-bold text-[#D4A373]">{orderActionState.orderId}</span>?
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setOrderActionState({ isOpen: false, actionType: null, orderId: null })} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all">
                Kembali
              </button>
              <button onClick={executeOrderAction} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black shadow-lg transition-all">
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 MODAL FORM TAMBAH / EDIT PRODUK */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
          <form onSubmit={handleSaveProduct} className="bg-[#1F0303] border border-white/10 p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white uppercase tracking-wider">
              {isEditing ? '✏️ Edit Katalog Menu' : '➕ Tambah Menu Baru'}
            </h3>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-300 uppercase">Nama Menu</label>
              <input type="text" required value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full bg-black/40 border border-white/10 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#801414] text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-300 uppercase">Harga Satuan (Rp)</label>
              <input type="number" required value={currentProduct.price || ''} onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} className="w-full bg-black/40 border border-white/10 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#801414] text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-300 uppercase">File Path / URL Gambar</label>
              <input type="text" required value={currentProduct.image} onChange={e => setCurrentProduct({...currentProduct, image: e.target.value})} placeholder="/menu.png" className="w-full bg-black/40 border border-white/10 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#801414] text-white" />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all">
                Batal
              </button>
              <button type="submit" className="px-4 py-2 bg-gradient-to-r from-[#801414] to-[#4A0D0D] text-[#F5E6D3] rounded-xl text-xs font-black shadow-lg transition-all">
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 🌟 MODAL KONFIRMASI HAPUS PRODUK */}
      {isDeleteModalOpen && productToDelete && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
          <div className="bg-[#1F0303] border border-white/10 p-6 rounded-3xl max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Hapus Menu?</h3>
            <p className="text-sm text-gray-300 mb-6">
              Apakah kamu yakin ingin menghapus produk <span className="text-[#D4A373] font-bold">{productToDelete.name}</span> secara permanen dari daftar menu?
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setIsDeleteModalOpen(false); setProductToDelete(null); }} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all">
                Batal
              </button>
              <button onClick={confirmDeleteProduct} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black shadow-lg transition-all">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}