import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

/**
 * Logotipo Principal VariePlus
 */
export const StoreBrandLogo: React.FC<{ size?: number | string; className?: string }> = ({ size = 26, className = '' }) => (
  <picture>
    <source srcSet="/varieplus.webp" type="image/webp" />
    <source srcSet="/varieplus.png" type="image/png" />
    <img
      src="/varieplus.webp"
      alt="VariePlus"
      style={{ width: size, height: 'auto', maxHeight: size }}
      className={`object-contain ${className}`}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = 'https://i.postimg.cc/zGKV0rdD/varieplus.png';
      }}
    />
  </picture>
);

/**
 * Emblema Geométrico de Vanguardia VÉRTICE (Apex Crest)
 * Doble cúspide arquitectónica con facetas prismáticas de precisión (cero estrellas genéricas).
 */
export const VerticeApexBadgeIcon: React.FC<IconProps> = ({ size = 14, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Vértice Superior */}
    <path
      d="M8 1.5L13.5 8L11 8L8 4.2L5 8L2.5 8L8 1.5Z"
      fill="currentColor"
    />
    {/* Vértice Interior Base */}
    <path
      d="M8 6.5L12 11.5L9.8 11.5L8 9.2L6.2 11.5L4 11.5L8 6.5Z"
      fill="currentColor"
      fillOpacity="0.7"
    />
    {/* Punto Focal Geométrico */}
    <rect
      x="7.2"
      y="13"
      width="1.6"
      height="1.6"
      rx="0.4"
      fill="currentColor"
    />
  </svg>
);

/**
 * Micro Indicador Geométrico de Especificación Técnica
 * Matriz prismática minimalista para detalles de producto.
 */
export const VerticeSpecIndicator: React.FC<IconProps> = ({ size = 14, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M8 2L13 5V11L8 14L3 11V5L8 2Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path
      d="M8 2V14M3 5L13 11M3 11L13 5"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeOpacity="0.4"
    />
    <circle cx="8" cy="8" r="1.8" fill="currentColor" />
  </svg>
);

/**
 * Micro Diamante de Descuento
 */
export const VerticeDiscountDiamondIcon: React.FC<IconProps> = ({ size = 12, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M7 1L13 7L7 13L1 7L7 1Z"
      fill="currentColor"
    />
    <path
      d="M7 3.5L10.5 7L7 10.5L3.5 7L7 3.5Z"
      fill="#FFFFFF"
      fillOpacity="0.35"
    />
  </svg>
);

/**
 * Sello de Garantía y Calidad de Tienda
 */
export const StoreQualitySeal: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M12 2L14.8 7.2L20.5 8.2L16.5 12.4L17.3 18.2L12 15.6L6.7 18.2L7.5 12.4L3.5 8.2L9.2 7.2L12 2Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="11.5" r="2" fill="currentColor" />
  </svg>
);

/**
 * Marcador de Punto Técnico
 */
export const PrecisionBulletIcon: React.FC<IconProps> = ({ size = 14, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <rect x="3" y="3" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.5" />
    <circle cx="9" cy="9" r="2.5" fill="currentColor" />
  </svg>
);

/**
 * Bolsa / Carrito de Tienda de Alta Gama
 */
export const StoreCartBagIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 6H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Ilustración Gráfica de Carrito Vacío
 */
export const EmptyCartGraphic: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FAF5EE] to-[#F2E8DC] border border-[#E8DFD3] flex items-center justify-center text-[#C85A32] shadow-xs">
      <StoreCartBagIcon size={34} />
    </div>
  </div>
);

/**
 * Emblema de Inspección y Garantía
 */
export const CertifiedCheckMark: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <polygon
      points="10,1 12.8,3.7 16.7,3.5 17.5,7.3 20,9.9 18.5,13.6 19.3,17.4 15.5,18.3 13.5,21.5 10,19.8 6.5,21.5 4.5,18.3 0.7,17.4 1.5,13.6 0,9.9 2.5,7.3 3.3,3.5 7.2,3.7"
      fill="currentColor"
      fillOpacity="0.12"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 10.5L8.8 12.8L13.8 7.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
