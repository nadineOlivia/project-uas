import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}: ButtonProps) {
  
  let baseStyle = "px-6 py-3 rounded-md font-bold transition-all shadow-md flex justify-center items-center gap-2 ";
  
  if (variant === 'primary') {
    // Merah Marun
    baseStyle += "bg-[#5C0A0A] text-white hover:bg-[#801b1b] ";
  } else if (variant === 'secondary') {
    // Cokelat
    baseStyle += "bg-[#8B653E] text-white hover:bg-[#6b4c2e] ";
  } else if (variant === 'outline') {
    // Transparan dengan Garis
    baseStyle += "border-2 border-[#8B653E] text-[#8B653E] hover:bg-[#8B653E] hover:text-white ";
  }

  return (
    <button className={`${baseStyle} ${className}`} {...props}>
      {children}
    </button>
  );
}