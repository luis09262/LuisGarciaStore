import React, { useState, useRef, useEffect } from 'react';
import { Search, Heart, X, ArrowRight, SlidersHorizontal, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import { ProductCategory } from '../../types/store';
import { StoreBrandLogo, StoreCartBagIcon } from '../ui/CustomBrandIcons';

export const Header: React.FC = () => {
  const {
    filterState,
    setSearchQuery,
    toggleCategory,
    products,
    cartCount,
    cartSubtotal,
    openCart,
    wishlist,
    openQuickView,
    setIsMobileFilterOpen,
    categoryNames,
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [localSearch, setLocalSearch] = useState(filterState.searchQuery);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync search state
  useEffect(() => {
    setLocalSearch(filterState.searchQuery);
  }, [filterState.searchQuery]);

  // Click outside to close predictive search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    setSearchQuery(val);
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    setSearchQuery('');
  };

  // Predictive search matching products (up to 4 items)
  const matchingProducts = localSearch.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(localSearch.toLowerCase()) ||
            p.category.toLowerCase().includes(localSearch.toLowerCase()) ||
            p.subtitle.toLowerCase().includes(localSearch.toLowerCase())
        )
        .slice(0, 4)
    : [];

  const mainCategories: ProductCategory[] = categoryNames.length > 0
    ? categoryNames
    : [
        'Guitarras & Sonido',
        'Gaming & Consolas',
        'Herramientas & Taller',
        'Gadgets & Tecnología',
      ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#211A16] text-[#EDE8DF] text-xs py-2 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2 border-b border-[#332820]">
        <span className="inline-flex items-center gap-1.5 text-[#F5B59A]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#E07A52]" />
          <span>VariePlus Store • Envíos prioritarios y compras 100% protegidas</span>
        </span>
        <span className="hidden md:inline text-[#65574D]">•</span>
        <span className="hidden md:inline text-[#C4BCB3]">Garantía oficial y atención técnica especializada</span>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#EFECE6] transition-all shadow-[0_4px_20px_rgba(30,20,10,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
            
            {/* Brand Logo & Logotype */}
            <div className="flex items-center gap-6">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group flex items-center gap-3 select-none"
                aria-label="VariePlus Inicio"
              >
                {/* Official VariePlus Logo - High-Speed WebP */}
                <div className="h-10 sm:h-12 flex items-center justify-center">
                  <picture>
                    <source srcSet="/varieplus.webp" type="image/webp" />
                    <source srcSet="/varieplus.png" type="image/png" />
                    <img
                      src="/varieplus.webp"
                      alt="VariePlus Logo"
                      width={180}
                      height={48}
                      fetchPriority="high"
                      decoding="async"
                      onError={(e) => {
                        // Fallback to external mirror if local fails
                        (e.currentTarget as HTMLImageElement).src = 'https://i.postimg.cc/zGKV0rdD/varieplus.png';
                      }}
                      className="h-10 sm:h-12 w-auto max-w-[160px] sm:max-w-[190px] object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-xs"
                    />
                  </picture>
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#1A1A1A] group-hover:text-[#C85A32] transition-colors leading-none">
                    Varie<span className="text-[#E06D44]">Plus</span>
                  </span>
                  <span className="text-[10px] sm:text-[10.5px] font-bold tracking-[0.2em] text-[#E06D44] uppercase mt-1">
                    STORE & TECH
                  </span>
                </div>
              </a>

              {/* Desktop Nav Category Links */}
              <nav className="hidden lg:flex items-center gap-1 pl-4 border-l border-[#EFECE6]">
                {mainCategories.map((cat) => {
                  const isSelected = filterState.selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-normal transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-[#C85A32] text-white shadow-xs font-bold'
                          : 'text-[#666059] hover:text-[#1A1A1A] hover:bg-[#F3EFE8]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Predictive Search Bar with Dropdown */}
            <div
              ref={searchContainerRef}
              className="relative flex-1 max-w-md hidden md:block"
            >
              <div className="relative">
                <Search className="w-4 h-4 text-[#8C8479] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Buscar guitarras, amplificadores, PlayStation 5, taladros..."
                  className="w-full h-10 pl-10 pr-9 bg-[#F4F1EA] border border-[#E8E2D8] focus:border-[#C85A32] focus:bg-white text-xs sm:text-sm text-[#1A1A1A] rounded-xl outline-none placeholder:text-[#8C8479] transition-all shadow-2xs"
                />
                {localSearch && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C8479] hover:text-[#1A1A1A] p-1 rounded-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Predictive Search Dropdown */}
              {isSearchFocused && localSearch.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#EFECE6] rounded-xl shadow-xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#8C8479] border-b border-[#F4F1EA] flex justify-between items-center">
                    <span>Productos Coincidentes ({matchingProducts.length})</span>
                    <span className="text-[10px] text-[#2D4A3E] font-bold">
                      Stock Disponible
                    </span>
                  </div>

                  {matchingProducts.length > 0 ? (
                    <div className="divide-y divide-[#F7F5F0]">
                      {matchingProducts.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => {
                            openQuickView(prod);
                            setIsSearchFocused(false);
                          }}
                          className="flex items-center gap-3 p-2.5 hover:bg-[#FDFBF7] cursor-pointer transition-colors"
                        >
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            loading="lazy"
                            decoding="async"
                            className="w-11 h-11 object-cover rounded-lg border border-[#EFECE6] flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#1A1A1A] truncate">
                              {prod.name}
                            </p>
                            <p className="text-[11px] text-[#8C8479] truncate">
                              {prod.category}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-bold text-[#1A1A1A]">
                              {formatCurrency(prod.price)}
                            </span>
                            {prod.originalPrice && (
                              <span className="block text-[10px] text-[#8C8479] line-through">
                                {formatCurrency(prod.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 px-4 text-center text-xs text-[#8C8479]">
                      No se encontraron productos que coincidan con "<span className="font-semibold text-[#1A1A1A]">{localSearch}</span>"
                    </div>
                  )}

                  <div className="p-2 bg-[#FDFBF7] border-t border-[#F4F1EA] text-center">
                    <button
                      onClick={() => {
                        setIsSearchFocused(false);
                        const el = document.getElementById('product-catalog');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-xs font-semibold text-[#C85A32] hover:text-[#A84422] inline-flex items-center gap-1.5"
                    >
                      <span>Ver todos los resultados</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Icons & Live Cart Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Filter Sheet Trigger */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden p-2 text-[#1A1A1A] hover:bg-[#EFECE6]/50 rounded-lg relative cursor-pointer"
                title="Abrir Filtros"
                aria-label="Filtrar productos"
              >
                <SlidersHorizontal className="w-5 h-5" />
                {(filterState.selectedCategories.length > 0 ||
                  filterState.minRating > 0 ||
                  filterState.inStockOnly) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C85A32]" />
                )}
              </button>

              {/* Wishlist Pill */}
              <button
                onClick={() => {
                  const el = document.getElementById('product-catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="relative p-2 text-[#666059] hover:text-[#C85A32] hover:bg-[#F8EFEA] rounded-xl transition-all cursor-pointer"
                title="Favoritos"
                aria-label="Artículos favoritos"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C85A32] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Live Cart Trigger Button - Luxury Terracotta Gradient */}
              <button
                id="header-cart-button"
                onClick={openCart}
                className="flex items-center gap-2.5 h-10 sm:h-11 px-3.5 sm:px-4 rounded-xl bg-gradient-to-r from-[#C85A32] to-[#B64D28] hover:from-[#B64D28] hover:to-[#9E3E1C] text-white font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 shadow-[0_4px_14px_rgba(200,90,50,0.25)] hover:shadow-[0_6px_18px_rgba(200,90,50,0.35)] active:scale-[0.98] border border-[#B04520]/60 cursor-pointer"
                aria-label="Carrito de compras"
              >
                <div className="relative">
                  <StoreCartBagIcon size={18} className="text-white" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 bg-white text-[#C85A32] text-[10px] font-black rounded-full flex items-center justify-center leading-none shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-bold">
                  {cartSubtotal > 0 ? formatCurrency(cartSubtotal) : 'Carrito'}
                </span>
              </button>
            </div>

          </div>

          {/* Mobile Search input bar */}
          <div className="pb-3 md:hidden">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8C8479] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={localSearch}
                onChange={handleSearchChange}
                placeholder="Buscar guitarras, PS5, taladros, drones..."
                className="w-full h-9 pl-9 pr-8 bg-[#F4F1EA] text-xs text-[#1A1A1A] rounded-lg outline-none placeholder:text-[#8C8479] focus:bg-white focus:ring-1 focus:ring-[#C85A32]"
              />
              {localSearch && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C8479]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

