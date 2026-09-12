import React from 'react';

interface StudioLightCanvasProps {
  accentColor?: string; // Hex color e.g. '#C85A32' or '#4A6B82'
  intensity?: number; // 0.1 to 1.0
  className?: string;
  interactive?: boolean;
}

export const StudioLightCanvas: React.FC<StudioLightCanvasProps> = ({
  accentColor = '#C85A32',
  intensity = 0.45,
  className = '',
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none transition-colors duration-700 ${className}`}
      style={{
        transform: 'translateZ(0)',
        willChange: 'opacity',
      }}
    >
      {/* Primary hardware-accelerated ambient glow */}
      <div
        className="absolute -top-[15%] -right-[10%] w-[75vw] h-[75vw] max-w-[850px] max-h-[850px] rounded-full blur-3xl opacity-40 transition-all duration-1000 ease-out pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, rgba(253, 251, 247, 0) 70%)`,
          opacity: 0.35 * intensity,
        }}
      />

      {/* Secondary warm studio floor light */}
      <div
        className="absolute -bottom-[20%] left-[10%] w-[60vw] h-[60vw] max-w-[650px] max-h-[650px] rounded-full blur-3xl opacity-30 transition-all duration-1000 ease-out pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(235, 215, 195, 0.7) 0%, rgba(253, 251, 247, 0) 70%)`,
          opacity: 0.3 * intensity,
        }}
      />
    </div>
  );
};

