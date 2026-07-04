import React from 'react';

export default function Badge() {
  return (
    <div className="w-64 h-64 bg-[#8B0000] rounded-full border-4 border-[#F5DEB3] flex flex-col items-center justify-center p-4 shadow-2xl relative overflow-hidden">
      <h3 className="text-3xl font-black tracking-widest text-[#F5DEB3] mb-2 shadow-sm z-10">
        CIKOYOU
      </h3>
      <div className="text-5xl my-2 z-10">🥟</div>
      <p className="text-[10px] text-center font-bold tracking-widest mt-2 uppercase z-10 text-white">
        Dari Gurihnya Cireng<br/>Untuk Kamu
      </p>
      {/* Efek Lingkaran Latar Belakang */}
      <div className="absolute inset-0 border-[16px] border-white/5 rounded-full scale-110"></div>
    </div>
  );
}