import React from 'react';

interface ClinicLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: string;
}

export default function ClinicLogo({ className = '', size = 44, showText = false, textColor = 'text-gray-900' }: ClinicLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`} id="custom-clinic-logo">
      {/* SVG Icon resembling the user's attached logo */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
        id="logo-svg-element"
      >
        {/* Solid Red/Red-Orange Circle Background */}
        <circle cx="250" cy="250" r="230" fill="#E74C4C" id="logo-bg-circle" />
        
        {/* Elegant White Line Art - Heart + ECG Pulse + Stethoscope */}
        <g stroke="white" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none" id="logo-lines-group">
          {/* Right side of heart and bottom tube loop */}
          <path 
            d="
              M 250,210 
              C 250,210 295,150 335,190 
              C 375,230 335,300 270,355
              C 250,372 232,365, 220,348
              C 214,340 206,325, 198,320
            " 
            id="logo-path-right"
          />
          
          {/* Left side of heart */}
          <path 
            d="
              M 250,210
              C 250,210 205,150 165,190
              C 145,210 145,245, 160,270
            " 
            id="logo-path-left"
          />

          {/* Stethoscope Chest Piece at (180, 320) */}
          <circle cx="180" cy="320" r="16" strokeWidth="18" fill="none" id="logo-stethoscope-head" />

          {/* Pulse line in the middle */}
          <path 
            d="
              M 175,245
              L 210,245
              L 223,215
              L 237,275
              L 252,195
              L 266,285
              L 279,245
              L 325,245
            " 
            strokeWidth="16" 
            id="logo-pulse-line"
          />
        </g>
      </svg>
      
      {showText && (
        <div className="text-left leading-none" id="logo-text-block">
          <span className={`text-2xl font-black font-display tracking-tight block ${textColor}`}>
            A K <span className="text-[#E74C4C]">Clinic</span>
          </span>
          <span className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mt-0.5">
            Karachi, Pakistan
          </span>
        </div>
      )}
    </div>
  );
}
