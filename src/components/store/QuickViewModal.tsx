import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Check, Truck, Shield, ChevronLeft, ChevronRight, Plus, Minus, AlignLeft, Sparkles, Layers } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import { CustomBadge } from '../ui/CustomBadge';
import { RatingStars } from '../ui/RatingStars';
import { PrecisionBulletIcon, StoreCartBagIcon } from '../ui/CustomBrandIcons';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    closeQuickView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    cart,
    products,
  } = useStore();

  // Always use the live product from state (synced with Supabase Realtime)
  const product = quickViewProduct
    ? products.find((p) => p.id === quickViewProduct.id) || quickViewProduct
    : null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'features' | 'specs'>('desc');

  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
      setSelectedSize(product.sizes?.[0] || null);
      setQuantity(1);
      setActiveTab('desc');
    }
  }, [product?.id]);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const isAlreadyInCart = cart.some((item) => item.product.id === product.id);

  const handleAddToCart = () => {
    if (isAlreadyInCart) return;
    setIsAdding(true);
    addToCart(product, selectedSize || undefined, quantity);
    setTimeout(() => {
      setIsAdding(false);
      closeQuickView();
    }, 500);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeQuickView}
          className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-xs transition-opacity cursor-pointer"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, y: '100%', scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: '100%', scale: 0.98 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative w-full max-w-5xl bg-[#FDFBF7] rounded-t-3xl sm:rounded-2xl shadow-2xl border-t sm:border border-[#EFECE6] max-h-[92vh] sm:max-h-[88vh] flex flex-col z-10 overflow-hidden"
        >
          {/* Mobile Handle Drag Notch */}
          <div className="sm:hidden flex items-center justify-center pt-2 pb-1 bg-white">
            <div className="w-10 h-1 rounded-full bg-[#D8D2C6]" />
          </div>

          {/* Sticky Header with Category & Close Button */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-[#EFECE6] z-20 flex-shrink-0">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C85A32] truncate">
                {product.category}
              </span>
              <span className="text-[#8C8479] hidden xs:inline">•</span>
              <span className="text-xs text-[#666059] hidden xs:inline truncate">
                Detalle del Producto
              </span>
            </div>

            <button
              onClick={closeQuickView}
              className="w-8 h-8 rounded-full bg-[#F4F1EA] hover:bg-[#EFECE6] text-[#1A1A1A] flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
              aria-label="Cerrar ventana"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Modal Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-start">
              
              {/* Left Column: Image Gallery & Carousel */}
              <div className="md:col-span-5 p-4 sm:p-6 bg-white md:border-r border-[#EFECE6] flex flex-col justify-start space-y-4 md:sticky md:top-0">
                <div>
                  {/* Main Image Showcase with Carousel Controls */}
                  <div className="relative w-full aspect-square rounded-xl bg-[#FAF7F2] border border-[#EFECE6] overflow-hidden flex items-center justify-center">
                    <img
                      src={product.images[selectedImageIndex] || product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center transition-all duration-300"
                      referrerPolicy="no-referrer"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                      {product.badgeType && (
                        <CustomBadge
                          type={product.badgeType}
                          discountPercent={product.discountPercent}
                          size="sm"
                        />
                      )}
                    </div>

                    {/* Image Carousel Prev / Next */}
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-[#1A1A1A] border border-[#EFECE6] flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
                          aria-label="Imagen anterior"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-[#1A1A1A] border border-[#EFECE6] flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
                          aria-label="Imagen siguiente"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Row */}
                  {product.images.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto py-2.5 mt-2 no-scrollbar">
                      {product.images.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                            selectedImageIndex === idx
                              ? 'border-[#C85A32] shadow-xs scale-105 ring-1 ring-[#C85A32]/20'
                              : 'border-[#EFECE6] opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Miniatura ${idx + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Trust & Guarantees (Desktop view) */}
                <div className="hidden md:block p-3 bg-[#FAF7F2] rounded-xl border border-[#EFECE6] space-y-2 text-xs text-[#55504A]">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#C85A32] flex-shrink-0" />
                    <span className="font-medium">Envíos rápidos con seguimiento en línea</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#2D4A3E] flex-shrink-0" />
                    <span className="font-medium">Garantía oficial directa y producto 100% original</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Product Details, Description & Contained Actions */}
              <div className="md:col-span-7 p-4 sm:p-6 sm:pl-8 space-y-5">
                
                {/* Rating & Stock Status */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <RatingStars
                    rating={product.rating}
                    reviewsCount={product.reviewsCount}
                    size="sm"
                  />

                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1E5638] bg-gradient-to-r from-[#EAF5EF] to-[#DEF0E4] border border-[#BEE3CE] px-3 py-1 rounded-full shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#27784E] animate-pulse" />
                    <span>{product.inStock ? 'Stock Inmediato Disponible' : 'Agotado'}</span>
                  </div>
                </div>

                {/* Title & Short Subtitle */}
                <div className="space-y-1.5">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight">
                    {product.name}
                  </h2>
                  {product.subtitle && (
                    <p className="text-xs sm:text-sm text-[#736B63] font-normal leading-relaxed">
                      {product.subtitle}
                    </p>
                  )}
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 py-2.5 px-3.5 bg-white rounded-xl border border-[#EFECE6]">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A]">
                    {formatCurrency(product.price * quantity)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-[#8C8479] line-through">
                      {formatCurrency(product.originalPrice * quantity)}
                    </span>
                  )}
                  {product.discountPercent && (
                    <span className="text-xs font-bold text-[#C85A32] bg-[#FDF0EB] px-2.5 py-0.5 rounded-md border border-[#F5B59A]/40">
                      Ahorra {product.discountPercent}%
                    </span>
                  )}
                </div>

                {/* Quantity & Variant Selector */}
                <div className="space-y-4 pt-1">
                  {/* Size / Variant Options */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#1A1A1A] uppercase tracking-wider">Opción / Versión</span>
                        <span className="text-[#666059] font-medium">{selectedSize}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((s, i) => {
                          const isSelected = selectedSize === s;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setSelectedSize(s)}
                              className={`px-3.5 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                                isSelected
                                  ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-2xs font-semibold'
                                  : 'border-[#EFECE6] bg-white text-[#1A1A1A] hover:bg-[#FAF7F2]'
                              }`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quantity and Action Buttons: Optimized for Mobile, Tablet & Desktop */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1A1A1A] text-xs uppercase tracking-wider">Cantidad</span>
                      <span className="text-xs text-[#8C8479]">
                        Entrega inmediata disponible
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                      {/* Stepper */}
                      <div className="flex items-center justify-between sm:justify-center border border-[#E0DBD1] rounded-xl bg-white overflow-hidden h-12 flex-shrink-0 w-full sm:w-auto px-2 sm:px-0 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="p-3 hover:bg-[#F4F1EA] text-[#666059] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 text-sm font-bold text-[#1A1A1A] min-w-[36px] text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => q + 1)}
                          className="p-3 hover:bg-[#F4F1EA] text-[#666059] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Action Buttons: Add to Cart + Wishlist always paired together on the same row */}
                      <div className="flex items-center gap-2 flex-1 w-full min-w-0">
                        {/* Add to Cart CTA Button */}
                        <button
                          disabled={isAdding || isAlreadyInCart}
                          onClick={handleAddToCart}
                          className={`flex-1 min-w-0 h-12 px-4 sm:px-5 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                            isAlreadyInCart
                              ? 'bg-[#1E5638] text-white border-[#17462D]'
                              : isAdding
                              ? 'bg-[#1E5638] text-white border-[#17462D]'
                              : 'bg-gradient-to-r from-[#C85A32] via-[#BF512A] to-[#A8421D] hover:from-[#BF512A] hover:to-[#963715] text-white border-[#B04520] hover:shadow-lg active:scale-[0.99]'
                          }`}
                        >
                          {isAlreadyInCart ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                              <span className="truncate">Ya está en tu carrito</span>
                            </>
                          ) : isAdding ? (
                            <>
                              <Check className="w-4 h-4 text-white flex-shrink-0" />
                              <span className="truncate">¡Agregado al Carrito!</span>
                            </>
                          ) : (
                            <>
                              <StoreCartBagIcon size={18} className="text-white flex-shrink-0" />
                              <span className="truncate">
                                Añadir al Carrito • {formatCurrency(product.price * quantity)}
                              </span>
                            </>
                          )}
                        </button>

                        {/* Wishlist Button */}
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className={`h-12 w-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer flex-shrink-0 shadow-2xs ${
                            isFavorited
                              ? 'bg-[#C85A32] text-white border-[#C85A32]'
                              : 'bg-white text-[#666059] border-[#E0DBD1] hover:text-[#C85A32] hover:bg-[#FAF7F2] hover:border-[#C85A32]'
                          }`}
                          aria-label={isFavorited ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
                        >
                          <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill={isFavorited ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Information Tabs: Description, Features & Specs */}
                <div className="pt-3 border-t border-[#EFECE6] space-y-3">
                  <div className="flex items-center gap-4 text-xs font-semibold border-b border-[#EFECE6] pb-2">
                    <button
                      onClick={() => setActiveTab('desc')}
                      className={`flex items-center gap-1.5 cursor-pointer transition-colors pb-1 -mb-2 border-b-2 ${
                        activeTab === 'desc'
                          ? 'border-[#C85A32] text-[#C85A32]'
                          : 'border-transparent text-[#8C8479] hover:text-[#1A1A1A]'
                      }`}
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                      <span>Descripción</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('features')}
                      className={`flex items-center gap-1.5 cursor-pointer transition-colors pb-1 -mb-2 border-b-2 ${
                        activeTab === 'features'
                          ? 'border-[#C85A32] text-[#C85A32]'
                          : 'border-transparent text-[#8C8479] hover:text-[#1A1A1A]'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Características</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('specs')}
                      className={`flex items-center gap-1.5 cursor-pointer transition-colors pb-1 -mb-2 border-b-2 ${
                        activeTab === 'specs'
                          ? 'border-[#C85A32] text-[#C85A32]'
                          : 'border-transparent text-[#8C8479] hover:text-[#1A1A1A]'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Ficha Técnica</span>
                    </button>
                  </div>

                  {/* Tab 1: Full Detailed Description from Supabase */}
                  {activeTab === 'desc' && (
                    <div className="p-3.5 bg-white rounded-xl border border-[#EFECE6] text-xs sm:text-sm text-[#4A453F] leading-relaxed space-y-2">
                      <p className="whitespace-pre-line">
                        {product.description || product.subtitle || 'Sin descripción detallada disponible actualmente.'}
                      </p>
                    </div>
                  )}

                  {/* Tab 2: Key Bullet Points */}
                  {activeTab === 'features' && (
                    <ul className="space-y-2 text-xs text-[#55504A] bg-white p-3.5 rounded-xl border border-[#EFECE6]">
                      {product.features && product.features.length > 0 ? (
                        product.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <PrecisionBulletIcon size={14} className="text-[#C85A32] flex-shrink-0 mt-0.5" />
                            <span className="leading-snug text-[#33302B]">{feat}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-[#8C8479] italic">No se han especificado características adicionales.</li>
                      )}
                    </ul>
                  )}

                  {/* Tab 3: Technical Specifications */}
                  {activeTab === 'specs' && (
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {product.specifications && Object.keys(product.specifications).length > 0 ? (
                        Object.entries(product.specifications).map(([key, val]) => (
                          <div key={key} className="p-2.5 bg-white rounded-lg border border-[#EFECE6]">
                            <dt className="font-semibold text-[#1A1A1A] text-[11px] uppercase tracking-wider">{key}</dt>
                            <dd className="text-[#55504A] mt-0.5 font-medium">{val}</dd>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 bg-white rounded-lg border border-[#EFECE6] text-[#8C8479] col-span-2 italic">
                          Ficha técnica no disponible.
                        </div>
                      )}
                    </dl>
                  )}
                </div>

                {/* Trust & Guarantees (Mobile view - at the bottom) */}
                <div className="md:hidden p-3 bg-[#FAF7F2] rounded-xl border border-[#EFECE6] space-y-2 text-xs text-[#55504A]">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#C85A32] flex-shrink-0" />
                    <span className="font-medium">Envíos rápidos con seguimiento en línea</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#2D4A3E] flex-shrink-0" />
                    <span className="font-medium">Garantía oficial directa y producto 100% original</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
