import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Eye, ShieldCheck } from 'lucide-react';
import { Product } from '../../types/store';
import { formatCurrency } from '../../utils/formatters';
import { useStore } from '../../context/StoreContext';
import { CustomBadge } from '../ui/CustomBadge';
import { RatingStars } from '../ui/RatingStars';
import { StudioLightCanvas } from '../ui/StudioLightCanvas';
import { StoreCartBagIcon, VerticeApexBadgeIcon, VerticeSpecIndicator } from '../ui/CustomBrandIcons';

interface HeroCarouselProps {
  products: Product[];
}

const AUTOPLAY_INTERVAL = 6000;

// Silk smooth cubic bezier for high-end luxury transitions
const silkEase = [0.22, 1, 0.36, 1];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ products }) => {
  const heroItems = products.slice(0, 4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const { addToCart, openQuickView, cart } = useStore();

  const currentItem = heroItems[currentIndex] || heroItems[0];

  // Auto-advance with single interval - zero JS state polling
  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setCurrentIndex((idx) => (idx + 1) % heroItems.length);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, heroItems.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + heroItems.length) % heroItems.length);
  };

  const handleSelect = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
  };

  if (!currentItem) return null;

  const isAlreadyInCart = cart.some((item) => item.product.id === currentItem.id);

  return (
    <div
      className="relative w-full bg-gradient-to-b from-[#FAF7F2] via-[#F8F4ED] to-[#FAF7F2] border-b border-[#EFECE6] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Studio Interactive Light Glow Canvas synced to active item's mood */}
      <StudioLightCanvas
        accentColor={currentItem.accentColor || '#C85A32'}
        intensity={0.4}
        interactive={true}
      />

      {/* Subtle architectural ambient background grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#C85A32 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-16 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Product Narrative with smooth stable crossfade */}
          <div className="lg:col-span-6 relative min-h-[380px] sm:min-h-[400px] flex flex-col justify-center">
            <AnimatePresence initial={false}>
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6, position: 'absolute', top: 0, left: 0, right: 0 }}
                transition={{ duration: 0.32, ease: silkEase }}
                className="space-y-4 sm:space-y-5"
              >
                {/* Badges & Meta Row */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Subtle Luxury Highlight Tag with Custom Geometric Apex */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF3EC] border border-[#EADBCE] text-[#A63C16] shadow-2xs">
                    <VerticeApexBadgeIcon size={13} className="text-[#C85A32] flex-shrink-0" />
                    <span className="text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-[0.16em]">
                      Producto Destacado
                    </span>
                  </div>

                  {currentItem.badgeType && (
                    <CustomBadge
                      type={currentItem.badgeType}
                      discountPercent={currentItem.discountPercent}
                      size="sm"
                    />
                  )}
                  
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#8C8479]">
                    {currentItem.category}
                  </span>
                  <span className="text-[#D0C7BC]">•</span>
                  <RatingStars rating={currentItem.rating} reviewsCount={currentItem.reviewsCount} />
                </div>

                {/* Primary Hero Title */}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] tracking-tight leading-[1.14]">
                  {currentItem.name}
                </h1>

                {/* Subtitle / Description */}
                <p className="text-xs sm:text-sm lg:text-base text-[#666059] leading-relaxed max-w-lg font-normal">
                  {currentItem.description}
                </p>

                {/* Pricing Block */}
                <div className="flex items-baseline gap-3 pt-0.5">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1A1A1A] tracking-tight">
                    {formatCurrency(currentItem.price)}
                  </span>
                  {currentItem.originalPrice && (
                    <span className="text-sm sm:text-base text-[#8C8479] line-through font-normal">
                      {formatCurrency(currentItem.originalPrice)}
                    </span>
                  )}
                  {currentItem.discountPercent && (
                    <span className="text-xs font-bold text-[#C85A32] bg-[#FDF0EB] border border-[#F5D5C6] px-2.5 py-0.5 rounded-full shadow-2xs">
                      Ahorra {currentItem.discountPercent}%
                    </span>
                  )}
                </div>

                {/* Guarantee & Stock Badges */}
                <div className="pt-0.5 flex flex-wrap items-center gap-2.5">
                  <div className="px-3 py-1.5 bg-white/90 backdrop-blur-xs rounded-xl border border-[#E8E2D8] text-xs font-medium text-[#1A1A1A] flex items-center gap-2 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#27784E]" />
                    <span className="font-semibold">{currentItem.inStock ? 'Stock Inmediato Disponible' : 'Bajo pedido'}</span>
                  </div>
                  <div className="px-3 py-1.5 bg-white/90 backdrop-blur-xs rounded-xl border border-[#E8E2D8] text-xs font-medium text-[#666059] flex items-center gap-1.5 shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C85A32]" />
                    <span>Garantía Oficial</span>
                  </div>
                </div>

                {/* CTAs with Luxury Terracotta Gradient */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => addToCart(currentItem)}
                    className="inline-flex items-center justify-center gap-2.5 h-11 sm:h-12 px-6 sm:px-7 rounded-xl bg-gradient-to-r from-[#C85A32] via-[#BF512A] to-[#A8421D] hover:from-[#BF512A] hover:to-[#963715] text-white font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 shadow-[0_4px_16px_rgba(200,90,50,0.25)] hover:shadow-[0_6px_22px_rgba(200,90,50,0.35)] active:scale-[0.98] border border-[#B04520] cursor-pointer"
                  >
                    <StoreCartBagIcon size={18} className="text-white" />
                    <span>{isAlreadyInCart ? 'En Tu Carrito' : `Añadir al Carrito • ${formatCurrency(currentItem.price)}`}</span>
                  </button>

                  <button
                    onClick={() => openQuickView(currentItem)}
                    className="inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-4 sm:px-5 rounded-xl bg-white/90 hover:bg-white text-[#1A1A1A] border border-[#E8E2D8] hover:border-[#C85A32] font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-[0.98] cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#C85A32]" />
                    <span>Vista Rápida</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: High-End Permanent Frame with Silky Smooth Image Crossfade */}
          <div className="lg:col-span-6 flex items-center justify-center relative">
            <div className="relative w-full max-w-md lg:max-w-lg aspect-square rounded-3xl bg-gradient-to-br from-white/90 via-white/75 to-[#FAF5EF] backdrop-blur-md border border-[#EFECE6] p-3 sm:p-5 shadow-[0_20px_50px_rgba(30,20,10,0.06)] flex items-center justify-center">
              
              {/* Radial inner glow */}
              <div 
                className="absolute inset-0 opacity-30 pointer-events-none rounded-3xl transition-all duration-700"
                style={{
                  background: `radial-gradient(circle at center, ${currentItem.accentColor || '#C85A32'}18 0%, transparent 70%)`
                }}
              />

              {/* Seamless Stacked Crossfade Images: No white screen, no flashing, no jumping */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner bg-[#F0EBE3]">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={currentItem.id}
                    src={currentItem.images[0]}
                    alt={currentItem.name}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: silkEase }}
                    className="absolute inset-0 w-full h-full object-cover object-center rounded-2xl"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
              </div>

              {/* Subtle Minimalist Floating Spec Capsule */}
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7 z-10 pointer-events-none">
                <div className="bg-[#FDFBF7]/92 backdrop-blur-md rounded-xl py-2 px-3 sm:px-3.5 border border-white/90 shadow-[0_6px_20px_rgba(26,20,15,0.09)] flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-5 h-5 rounded-md bg-[#FAF4ED] border border-[#EADBCE] flex items-center justify-center text-[#C85A32] flex-shrink-0">
                      <VerticeSpecIndicator size={12} className="text-[#C85A32]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-[#8C8479] block leading-none mb-0.5">
                        Especificación
                      </span>
                      <p className="text-xs font-semibold text-[#1A1A1A] truncate leading-tight">
                        {currentItem.features[0]}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EBF6F0] border border-[#C6E4D0] text-[#1E5638] text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#27784E]" />
                    <span>Stock Listo</span>
                  </div>
                </div>
              </div>

              {/* Carousel Next / Prev Controls - Fully visible and unclipped */}
              <button
                id="hero-carousel-prev-btn"
                onClick={handlePrev}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md border border-[#E8E2D8] text-[#1A1A1A] shadow-[0_4px_18px_rgba(26,26,26,0.18)] flex items-center justify-center hover:bg-white hover:border-[#C85A32] hover:text-[#C85A32] hover:scale-110 active:scale-95 transition-all cursor-pointer z-30 ring-1 ring-black/5"
                aria-label="Producto anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                id="hero-carousel-next-btn"
                onClick={handleNext}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md border border-[#E8E2D8] text-[#1A1A1A] shadow-[0_4px_18px_rgba(26,26,26,0.18)] flex items-center justify-center hover:bg-white hover:border-[#C85A32] hover:text-[#C85A32] hover:scale-110 active:scale-95 transition-all cursor-pointer z-30 ring-1 ring-black/5"
                aria-label="Producto siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

        {/* Carousel Slide Indicators & Progress Bar */}
        <div className="mt-6 sm:mt-10 flex items-center justify-between border-t border-[#EFECE6] pt-4">
          <div className="flex items-center gap-1.5 sm:gap-3">
            {heroItems.map((item, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(idx)}
                  className={`group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white border border-[#E8E2D8] shadow-[0_2px_8px_rgba(200,90,50,0.1)] ring-1 ring-[#C85A32]/20'
                      : 'hover:bg-white/60 text-[#666059]'
                  }`}
                >
                  <span className={`text-[11px] sm:text-xs font-black ${isActive ? 'text-[#C85A32]' : 'text-[#8C8479]'}`}>
                    0{idx + 1}
                  </span>
                  <span className={`hidden sm:inline text-xs font-bold max-w-[120px] truncate ${isActive ? 'text-[#1A1A1A]' : 'text-[#666059]'}`}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Visual Progress Bar (Hardware accelerated CSS animation) */}
          <div className="w-24 sm:w-44 h-1.5 bg-[#E8E2D8] rounded-full overflow-hidden p-0.5">
            <div
              key={currentIndex}
              className="h-full bg-gradient-to-r from-[#E06D44] to-[#C85A32] rounded-full shadow-xs"
              style={{
                animation: `carouselProgress ${AUTOPLAY_INTERVAL}ms linear`,
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

