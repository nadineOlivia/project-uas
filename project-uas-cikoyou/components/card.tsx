import React from 'react';

interface CardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode | string;
  footer?: React.ReactNode;
}

export default function Card({ title, description, icon, footer }: CardProps) {
  return (
    <div className="bg-[#E6D5B8] p-6 rounded-lg shadow-xl text-center flex flex-col items-center border-b-4 border-[#c2b092] text-[#4A2511] hover:-translate-y-1 transition-transform duration-300 w-full">
      {icon && (
        <div className="text-5xl mb-4 bg-[#4A2511] w-20 h-20 flex items-center justify-center rounded-full text-white shadow-inner">
          {icon}
        </div>
      )}
      <h3 className="font-black text-xl mb-2 uppercase">{title}</h3>
      {description && (
        <p className="text-[#8B653E] font-medium mb-6 flex-grow">{description}</p>
      )}
      {footer && (
        <div className="w-full mt-auto border-t border-[#c2b092]/30 pt-4">
          {footer}
        </div>
      )}
    </div>
  );
}