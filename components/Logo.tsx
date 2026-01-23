
import React from 'react';

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dimensions = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-32 h-32'
  };

  return (
    <div className={`flex items-center gap-2 ${size === 'lg' ? 'flex-col' : ''}`}>
      <div className={`${dimensions[size]} bg-green-500 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg border-2 border-green-600`}>
        {/* Simplified SVG representation of the provided logo */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600" />
        <svg 
          viewBox="0 0 100 100" 
          className="w-[80%] h-[80%] z-10 text-emerald-100 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M50 15c-19.3 0-35 15.7-35 35s15.7 35 35 35 35-15.7 35-35-15.7-35-35-35zm0 60c-13.8 0-25-11.2-25-25s11.2-25 25-25 25 11.2 25 25-11.2 25-25 25z" />
          <path d="M50 30l-10 10h5v15h10v-15h5z" transform="rotate(0 50 50)" />
          <path d="M50 30l-10 10h5v15h10v-15h5z" transform="rotate(120 50 50)" />
          <path d="M50 30l-10 10h5v15h10v-15h5z" transform="rotate(240 50 50)" />
          <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
      <div className={`font-bold tracking-tight text-green-900 ${size === 'lg' ? 'text-4xl mt-4' : 'text-xl'}`}>
        Find <span className="text-green-600">Recycler</span><span className="text-green-400 font-light">.com</span>
      </div>
    </div>
  );
};

export default Logo;
