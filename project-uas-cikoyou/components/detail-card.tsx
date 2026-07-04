import React from 'react';

interface DetailCardProps {
  title: string;
  subtitle?: string;
}

export default function DetailCard({ title, subtitle }: DetailCardProps) {
  return (
    <div className="bg-[#3A2618] px-10 py-6 rounded-xl shadow-2xl border-2 border-[#4d3320] text-center w-full max-w-2xl mx-auto flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ornamen Garis Estetika */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F5DEB3] to-transparent opacity-50"></div>
      
      <h2 className="text-3xl md:text-4xl font-black tracking-widest text-[#F5DEB3] uppercase relative z-10">
        {title}
      </h2>
      
      {subtitle && (
        <p className="text-gray-300 mt-2 text-sm font-medium tracking-wide relative z-10">
          {subtitle}
        </p>
      )}
    </div>
  );
}