
import React, { useMemo } from 'react';

const PixelBackground: React.FC = () => {
  const pixels = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
      {pixels.map((p) => (
        <div
          key={p.id}
          className="absolute w-1 h-1 bg-white"
          style={{
            top: p.top,
            left: p.left,
            width: '4px',
            height: '4px',
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
};

export default PixelBackground;
