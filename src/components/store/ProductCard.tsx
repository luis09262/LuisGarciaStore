import React, { useState } from 'react';
import { Heart, Eye, Check, ShoppingBag } from 'lucide-react';
import { Product } from '../../types/store';
import { formatCurrency } from '../../utils/formatters';
import { useStore } from '../../context/StoreContext';
import { CustomBadge } from '../ui/CustomBadge';
import { RatingStars } from '../ui/RatingStars';
import { StoreCartBagIcon } from '../ui/CustomBrandIcons';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
  const { addToCart, openQuickView, toggleWishlist, isInWishlist, cart } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const isAlreadyInCart = cart.some((item) => item.product.id === product.id);

  const activeImage = product.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAlreadyInCart) return;
    setIsAdding(true);
    addToCart(product, product.sizes?.[0], 1);
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickView(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => openQuickView(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-xl border border-[#EFECE6] hover:border-[#D8D2C6] overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col cursor-pointer gpu-accelerated"
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-square bg-[#FAF7F2] overflow-hidden">
        {/* Primary Image */}
        <img
          src={activeImage}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover object-center transition-all duration-500 ease-out ${
            isHovered && product.secondaryImage ? 'scale-105 opacity-0' : 'opacity-100 scale-100'
          }`}
          referrerPolicy="no-referrer"
        />

        {/* Secondary Image for Hover Swap */}
        {product.secondaryImage && (
          <img
            src={product.secondaryImage}
            alt={`${product.name} vista secundaria`}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-out ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            referrerPolicy="no-referrer"
          />
        )}

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 flex flex-col gap-1 z-10">
          {product.badgeType && (
            <CustomBadge
              type={product.badgeType}
              discountPercent={product.discountPercent}
              size="sm"
            />
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 sm:top-3 right-2.5 sm:right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 cursor-pointer ${
            isFavorited
              ? 'bg-[#C85A32] text-white shadow-xs scale-105'
              : 'bg-white/90 backdrop-blur-xs text-[#666059] hover:text-[#C85A32] hover:bg-white shadow-2xs'
          }`}
          aria-label={isFavorited ? 'Eliminar de favoritos' : 'Guardar en favoritos'}
        >
          <Heart
            className="w-4 h-4"
            fill={isFavorited ? 'currentColor' : 'none'}
          />
        </button>

        {/* Desktop Floating Quick Action Bar (Revealed on hover) */}
        <div
          className={`hidden sm:flex absolute inset-x-3 bottom-3 items-center gap-2 transition-all duration-300 z-10 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
          }`}
        >
          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock || isAdding || isAlreadyInCart}
            className={`flex-1 h-9 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer ${
              isAlreadyInCart
                ? 'bg-[#1E5638] text-white'
                : isAdding
                ? 'bg-[#1E5638] text-white'
                : 'bg-gradient-to-r from-[#C85A32] to-[#B04520] hover:from-[#B84E29] hover:to-[#9E3E1C] text-white border border-[#BA4E29]'
            }`}
          >
            {isAlreadyInCart ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>En Tu Carrito</span>
              </>
            ) : isAdding ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>¡Agregado!</span>
              </>
            ) : (
              <>
                <StoreCartBagIcon size={14} className="text-white" />
                <span>Añadir al Carrito</span>
              </>
            )}
          </button>

          <button
            onClick={handleQuickView}
            className="h-9 w-9 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#1A1A1A] hover:text-[#C85A32] border border-[#EFECE6] flex items-center justify-center shadow-md transition-all cursor-pointer"
            title="Vista Rápida"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Quick Action Pill */}
        <div className="sm:hidden absolute right-2.5 bottom-2.5 z-10">
          <button
            onClick={handleQuickAdd}
            disabled={isAlreadyInCart}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform ${
              isAlreadyInCart ? 'bg-[#1E5638] text-white' : 'bg-gradient-to-r from-[#C85A32] to-[#B04520] text-white'
            }`}
            aria-label="Añadir rápido al carrito"
          >
            {isAlreadyInCart || isAdding ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : (
              <StoreCartBagIcon size={14} className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3">
        <div className="space-y-1">
          {/* Category and Rating */}
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#8C8479] uppercase tracking-wider truncate">
              {product.category}
            </span>
            <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} size="sm" />
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-bold text-[#1A1A1A] group-hover:text-[#C85A32] transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>

          {/* Subtitle */}
          <p className="text-[11px] sm:text-xs text-[#666059] line-clamp-1">
            {product.subtitle}
          </p>
        </div>

        {/* Bottom Row: Stock / Tags and Pricing */}
        <div className="pt-2 border-t border-[#F7F5F0] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {product.inStock ? (
              <span className="text-[11px] font-medium text-[#2D4A3E] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D4A3E]" />
                En Stock
              </span>
            ) : (
              <span className="text-[11px] font-medium text-[#8C8479]">
                Agotado
              </span>
            )}
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs sm:text-sm md:text-base font-extrabold text-[#1A1A1A] tabular-nums">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-[#8C8479] line-through tabular-nums">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

