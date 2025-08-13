import React from 'react';

export default function FerrariLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="w-full h-full bg-red-600 flex items-center justify-center">
        <div className="text-yellow-400 font-bold text-xl">
          FERRARI
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-yellow-400"></div>
    </div>
  );
} 

