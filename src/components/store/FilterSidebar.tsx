import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, RotateCcw, Check, SlidersHorizontal, Star, Shield, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCategory } from '../../types/store';
import { formatCurrency } from '../../utils/formatters';
import { CATEGORIES_LIST } from '../../data/mockProducts';

export const FilterSidebar: React.FC = () => {
  const {
    filterState,
    toggleCategory,
    setPriceRange,
    setMinRating,
    setInStockOnly,
    resetFilters,
    filteredProducts,
    isMobileFilterOpen,
    setIsMobileFilterOpen,
    categories,
    products,
  } = useStore();

  const maxProductPrice = Math.max(1000, ...products.map((p) => p.price || 0));
  const maxSliderPrice = Math.ceil(maxProductPrice / 500) * 500;

  const ratingOptions = [4.8, 4.5, 4.0];

  const hasActiveFilters =
    filterState.selectedCategories.length > 0 ||
    filterState.priceRange[0] > 0 ||
    filterState.priceRange[1] < maxSliderPrice ||
    filterState.minRating > 0 ||
    filterState.inStockOnly ||
    filterState.searchQuery.trim().length > 0;

  const FilterContent = (
    <div className="space-y-6">
      {/* Header with Results Count & Reset Button */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EFECE6]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#C85A32]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">
            Filtros
          </h3>
          <span className="text-xs font-semibold text-[#8C8479] bg-[#F4F1EA] px-2 py-0.5 rounded-full">
            {filteredProducts.length}
          </span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-[#C85A32] hover:text-[#A84422] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>
        )}
      </div>

      {/* Categories Multi-Select Pills */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] block">
          Categorías
        </label>
        <div className="space-y-1.5">
          {categories.map((cat) => {
            const catName = typeof cat === 'string' ? cat : cat.name;
            const catCount = typeof cat === 'string' ? 0 : cat.count;
            const isSelected = filterState.selectedCategories.includes(catName);

            return (
              <button
                key={catName}
                type="button"
                onClick={() => toggleCategory(catName)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1A1A1A] text-white shadow-xs font-semibold'
                    : 'bg-white hover:bg-[#F4F1EA] text-[#1A1A1A] border border-[#EFECE6]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'border-white bg-[#C85A32] text-white'
                        : 'border-[#D8D2C6] bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="truncate">{catName}</span>
                </div>
                {catCount > 0 && (
                  <span
                    className={`text-[11px] ${
                      isSelected ? 'text-[#EDE8DF]' : 'text-[#8C8479]'
                    }`}
                  >
                    {catCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
            Rango de Precio
          </label>
          <span className="text-xs font-semibold text-[#C85A32] tabular-nums">
            {formatCurrency(filterState.priceRange[0])} – {formatCurrency(filterState.priceRange[1])}
          </span>
        </div>

        <div className="space-y-2 pt-1">
          <input
            type="range"
            min="0"
            max={maxSliderPrice}
            step="50"
            value={Math.min(filterState.priceRange[1], maxSliderPrice)}
            onChange={(e) =>
              setPriceRange([filterState.priceRange[0], Number(e.target.value)])
            }
            className="w-full h-1.5 bg-[#E8E2D8] rounded-lg appearance-none cursor-pointer"
          />

          <div className="flex items-center justify-between text-[11px] text-[#8C8479] font-medium">
            <span>S/ 0</span>
            <span>S/ {Math.round(maxSliderPrice / 2).toLocaleString()}</span>
            <span>S/ {maxSliderPrice.toLocaleString()}+</span>
          </div>
        </div>
      </div>

      {/* Minimum Rating Threshold */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] block">
          Calificación Mínima
        </label>
        <div className="flex flex-wrap gap-2">
          {ratingOptions.map((rating) => {
            const isSelected = filterState.minRating === rating;
            return (
              <button
                key={rating}
                type="button"
                onClick={() => setMinRating(rating)}
                className={`flex-1 min-w-[75px] py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#C85A32] text-white shadow-xs'
                    : 'bg-white hover:bg-[#F4F1EA] text-[#1A1A1A] border border-[#EFECE6]'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{rating}+</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* In-Stock Toggle */}
      <div className="pt-2">
        <label className="flex items-center justify-between p-3 bg-white border border-[#EFECE6] rounded-lg cursor-pointer hover:bg-[#FAF7F2] transition-colors">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-[#1A1A1A] block">
              Solo Productos en Stock
            </span>
            <span className="text-[11px] text-[#8C8479] block">
              Mostrar solo artículos listos para envío
            </span>
          </div>
          <input
            type="checkbox"
            checked={filterState.inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 text-[#C85A32] rounded border-[#D8D2C6] focus:ring-[#C85A32] cursor-pointer"
          />
        </label>
      </div>

      {/* Guarantee & Shipping Info Card */}
      <div className="p-3.5 rounded-lg bg-[#FAF7F2] border border-[#EFECE6] space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D4A3E]">
          <Shield className="w-3.5 h-3.5" />
          <span>Compra Segura y Garantizada</span>
        </div>
        <p className="text-[11px] text-[#666059] leading-relaxed">
          Todos nuestros productos cuentan con garantía oficial, embalaje de alta resistencia y seguimiento en tiempo real.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-28 self-start">
        <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EFECE6] shadow-2xs">
          {FilterContent}
        </div>
      </aside>

      {/* Mobile Drawer Filter Modal */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="absolute inset-0 bg-[#1A1A1A]/40 backdrop-blur-xs"
            />

            {/* Slide-over panel */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-xs bg-[#FDFBF7] shadow-xl flex flex-col"
              >
                {/* Mobile Drawer Header */}
                <div className="p-4 border-b border-[#EFECE6] flex items-center justify-between bg-white">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#C85A32]" />
                    <h2 className="text-base font-bold text-[#1A1A1A]">
                      Filtrar Catálogo
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 rounded-lg text-[#666059] hover:bg-[#F4F1EA] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Content Area */}
                <div className="flex-1 overflow-y-auto p-4">
                  {FilterContent}
                </div>

                {/* Mobile Apply Button Footer */}
                <div className="p-4 border-t border-[#EFECE6] bg-white">
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full py-3 bg-[#1A1A1A] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-black transition-colors cursor-pointer"
                  >
                    Ver {filteredProducts.length} Productos
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
