import React, { useState } from 'react';
import { LayoutGrid, Grid3X3, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SortOption } from '../../types/store';
import { ProductCard } from './ProductCard';
import { Button } from '../ui/Button';

export const ProductGrid: React.FC = () => {
  const {
    filteredProducts,
    filterState,
    setSortBy,
    toggleCategory,
    resetFilters,
    setIsMobileFilterOpen,
  } = useStore();

  const [gridDensity, setGridDensity] = useState<'spacious' | 'compact'>('spacious');

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Destacados', value: 'featured' },
    { label: 'Precio: Menor a Mayor', value: 'price-asc' },
    { label: 'Precio: Mayor a Menor', value: 'price-desc' },
    { label: 'Mejor Calificados', value: 'rating' },
    { label: 'Novedades', value: 'newest' },
  ];

  return (
    <div id="product-catalog" className="flex-1 space-y-6">
      
      {/* Top Controls Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#EFECE6] flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        
        {/* Left: Results Count & Active Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs sm:text-sm font-semibold text-[#1A1A1A]">
            Mostrando <span className="font-bold text-[#C85A32]">{filteredProducts.length}</span> productos
          </span>

          {filterState.selectedCategories.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#FAF7F2] text-[#1A1A1A] border border-[#EFECE6]"
            >
              <span>{cat}</span>
              <button
                onClick={() => toggleCategory(cat)}
                className="text-[#8C8479] hover:text-[#C85A32] cursor-pointer"
                aria-label={`Eliminar filtro ${cat}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filterState.searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#FAF7F2] text-[#1A1A1A] border border-[#EFECE6]">
              <span>"{filterState.searchQuery}"</span>
            </span>
          )}
        </div>

        {/* Right: Sort Dropdown & Density Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Mobile Filter Sheet Trigger Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden h-9 px-3 rounded-lg border border-[#EFECE6] bg-[#FAF7F2] text-xs font-semibold text-[#1A1A1A] flex items-center gap-1.5 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>Filtros</span>
          </button>

          {/* Sort Selector */}
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#8C8479] absolute left-3 pointer-events-none" />
            <select
              value={filterState.sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-9 pl-8 pr-7 bg-[#FAF7F2] hover:bg-[#F4F1EA] text-xs font-semibold text-[#1A1A1A] rounded-lg border border-[#EFECE6] outline-none cursor-pointer transition-colors"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Grid Layout Density Switcher */}
          <div className="hidden sm:flex items-center border border-[#EFECE6] rounded-lg bg-[#FAF7F2] p-0.5">
            <button
              onClick={() => setGridDensity('spacious')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                gridDensity === 'spacious'
                  ? 'bg-white text-[#C85A32] shadow-2xs'
                  : 'text-[#8C8479] hover:text-[#1A1A1A]'
              }`}
              title="Vista de 3 columnas"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridDensity('compact')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                gridDensity === 'compact'
                  ? 'bg-white text-[#C85A32] shadow-2xs'
                  : 'text-[#8C8479] hover:text-[#1A1A1A]'
              }`}
              title="Vista compacta de 4 columnas"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Grid Content */}
      {filteredProducts.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-xl border border-[#EFECE6] p-12 text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-[#8C8479] flex items-center justify-center mx-auto">
            <SlidersHorizontal className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#1A1A1A]">
              No se encontraron productos con tus filtros actuales
            </h3>
            <p className="text-xs sm:text-sm text-[#666059] max-w-sm mx-auto">
              Intenta ajustar el rango de precio, deseleccionar categorías o explorar todos nuestros artículos disponibles.
            </p>
          </div>
          <Button variant="primary" pill onClick={resetFilters}>
            Limpiar Filtros
          </Button>
        </div>
      ) : (
        /* Products Grid */
        <div
          className={`grid gap-4 sm:gap-6 ${
            gridDensity === 'spacious'
              ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
          }`}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};

