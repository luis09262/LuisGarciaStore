import React from 'react';
import { VerticeDiscountDiamondIcon } from './CustomBrandIcons';

export type BadgeType = 'offer' | 'hot' | 'new' | 'eco' | 'limited' | 'discount';

interface CustomBadgeProps {
  type?: BadgeType;
  label?: string;
  discountPercent?: number;
  className?: string;
  size?: 'sm' | 'md';
}

export const CustomBadge: React.FC<CustomBadgeProps> = ({
  type = 'offer',
  label,
  discountPercent,
  className = '',
  size = 'md',
}) => {
  const isSmall = size === 'sm';
  const paddingClass = isSmall ? 'px-2.5 py-0.5 text-[10.5px]' : 'px-3 py-1 text-xs';

  if (type === 'discount' || (type === 'offer' && discountPercent)) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 font-bold tracking-wider uppercase text-white bg-gradient-to-r from-[#C85A32] to-[#B04520] shadow-[0_2px_8px_rgba(200,90,50,0.25)] border border-[#D96B43]/50 rounded-full ${paddingClass} ${className}`}
      >
        <VerticeDiscountDiamondIcon size={isSmall ? 11 : 12} className="flex-shrink-0 text-white" />
        <span>{label || (discountPercent ? `-${discountPercent}% DESC` : 'OFERTA DESTACADA')}</span>
      </div>
    );
  }

  if (type === 'hot') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 font-bold tracking-wider uppercase text-[#B84A24] bg-gradient-to-r from-[#FFF4EE] to-[#FBE8DF] border border-[#F4C8B5] shadow-[0_2px_6px_rgba(200,90,50,0.06)] rounded-full ${paddingClass} ${className}`}
      >
        <svg
          className="w-3 h-3 flex-shrink-0 text-[#C85A32]"
          viewBox="0 0 16 16"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 1c.5 1.5.2 2.7-.4 3.7C6.8 6 6.3 6.9 6.7 8.3c.3.9 1 1.6 1.8 2.1-.2-.8-.2-1.7.2-2.5.5-1.1 1.6-1.9 2-3.1.5 1.4.6 2.8.2 4.2-.4 1.2-1.2 2.2-2.3 2.8-.9.5-2 .7-3 .4-1.6-.5-2.8-1.9-3.2-3.5C2 7 3 5.3 4.5 4.3 5.5 3.6 6.6 2.4 7.2 1.3L8 1z" />
        </svg>
        <span>{label || 'MÁS VENDIDO'}</span>
      </div>
    );
  }

  if (type === 'eco') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 font-bold tracking-wider uppercase text-[#1E5638] bg-gradient-to-r from-[#F0F8F3] to-[#E3F2E8] border border-[#BEE3CE] shadow-[0_2px_6px_rgba(30,86,56,0.06)] rounded-full ${paddingClass} ${className}`}
      >
        <svg
          className="w-3 h-3 flex-shrink-0 text-[#27784E]"
          viewBox="0 0 16 16"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14 2c-3.5 0-7.5 2-9.5 5.5-1.5 2.6-1.5 5.5.5 7.5 2 2 4.9 2 7.5.5C16 13.5 18 9.5 18 6v-4h-4zm-1.8 11.2c-1.8 1-3.9 1-5.3-.4-1.4-1.4-1.4-3.5-.4-5.3 1.5-2.6 4.7-4.2 7.5-4.5v1.8c-.3 2.8-1.9 6-4.3 7.5l2.5.9z" />
        </svg>
        <span>{label || 'ALTO RENDIMIENTO'}</span>
      </div>
    );
  }

  if (type === 'limited') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 font-bold tracking-wider uppercase text-[#874A25] bg-gradient-to-r from-[#FFF7EE] to-[#FAECE0] border border-[#ECD1BC] shadow-[0_2px_6px_rgba(135,74,37,0.08)] rounded-full ${paddingClass} ${className}`}
      >
        <svg
          className="w-3 h-3 flex-shrink-0 text-[#B65B27]"
          viewBox="0 0 16 16"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 1L2 5v6l6 4 6-4V5L8 1zm0 2.2l4 2.6v4.4L8 12.8 4 10.2V5.8l4-2.6z" />
        </svg>
        <span>{label || 'EDICIÓN PREMIUM'}</span>
      </div>
    );
  }

  // 'new' default
  return (
    <div
      className={`inline-flex items-center gap-1.5 font-bold tracking-wider uppercase text-[#1A1A1A] bg-white/95 backdrop-blur-xs border border-[#E8E2D8] shadow-[0_2px_6px_rgba(26,26,26,0.04)] rounded-full ${paddingClass} ${className}`}
    >
      <span className="w-2 h-2 rounded-full bg-[#C85A32] flex-shrink-0 shadow-xs" />
      <span>{label || 'NOVEDAD'}</span>
    </div>
  );
};
