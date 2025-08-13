import React from 'react';

interface CarbonFiberPatternProps {
  className?: string;
}

export default function CarbonFiberPattern({ className = '' }: CarbonFiberPatternProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 flex flex-wrap">
        {Array.from({ length: 100 }).map((_, index) => {
          const row = Math.floor(index / 10);
          const col = index % 10;
          
          return (
            <div 
              key={index}
              className="w-1/10 h-1/10 bg-black/80"
              style={{ 
                width: '10%', 
                height: '10%',
                boxShadow: 'inset 0 0 10px rgba(50, 50, 50, 0.8)',
                borderRadius: '2px',
                transform: `rotate(${(row + col) % 2 === 0 ? '45deg' : '-45deg'})`,
                margin: '1px'
              }}
            />
          );
        })}
      </div>
    </div>
  );
} 

