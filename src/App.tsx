import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { DrawerCart } from './components/layout/DrawerCart';
import { HeroCarousel } from './components/store/HeroCarousel';
import { CategoryBento } from './components/store/CategoryBento';
import { FilterSidebar } from './components/store/FilterSidebar';
import { ProductGrid } from './components/store/ProductGrid';
import { QuickViewModal } from './components/store/QuickViewModal';
import { ToastContainer } from './components/ui/ToastContainer';
import { ShoppingBag } from 'lucide-react';

const StorefrontContent: React.FC = () => {
  const { products, setPriceRange, setSortBy, resetFilters } = useStore();
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'new' | 'bestseller' | 'under100'>('all');

  const handleQuickTab = (tab: 'all' | 'new' | 'bestseller' | 'under100') => {
    setActiveTabFilter(tab);
    resetFilters();
    if (tab === 'new') {
      setSortBy('newest');
    } else if (tab === 'under100') {
      setPriceRange([0, 100]);
    }
  };

  // Control section visibility (kept intact in code for quick re-activation)
  const SHOW_HERO = false;
  const SHOW_CATEGORIES = false;

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1A1A]">
      {/* Top Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Hero Carousel (Preserved in code) */}
        {SHOW_HERO && <HeroCarousel products={products} />}

        {/* 2. Category Bento Highlights (Preserved in code) */}
        {SHOW_CATEGORIES && <CategoryBento />}

        {/* 3. Catalog Section - Primary Landing View */}
        <section id="product-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-12 sm:pb-16">
          
          {/* Section Header with Quick Preset Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#EFECE6] gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C85A32]">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Catálogo de Productos</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight mt-1">
                Catálogo General y Destacados
              </h1>
            </div>

            {/* Quick Filter Pill Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              <button
                onClick={() => handleQuickTab('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTabFilter === 'all'
                    ? 'bg-[#1A1A1A] text-white shadow-xs'
                    : 'bg-white text-[#666059] border border-[#EFECE6] hover:bg-[#FAF7F2]'
                }`}
              >
                Todos los Productos ({products.length})
              </button>
              <button
                onClick={() => handleQuickTab('new')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTabFilter === 'new'
                    ? 'bg-[#1A1A1A] text-white shadow-xs'
                    : 'bg-white text-[#666059] border border-[#EFECE6] hover:bg-[#FAF7F2]'
                }`}
              >
                Novedades
              </button>
              <button
                onClick={() => handleQuickTab('bestseller')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTabFilter === 'bestseller'
                    ? 'bg-[#1A1A1A] text-white shadow-xs'
                    : 'bg-white text-[#666059] border border-[#EFECE6] hover:bg-[#FAF7F2]'
                }`}
              >
                Más Vendidos
              </button>
              <button
                onClick={() => handleQuickTab('under100')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTabFilter === 'under100'
                    ? 'bg-[#1A1A1A] text-white shadow-xs'
                    : 'bg-white text-[#666059] border border-[#EFECE6] hover:bg-[#FAF7F2]'
                }`}
              >
                Menos de S/ 100
              </button>
            </div>
          </div>

          {/* Main Content Layout: Sidebar + Product Grid */}
          <div className="flex flex-col lg:flex-row gap-8 pt-8 items-start">
            {/* Filter Sidebar */}
            <FilterSidebar />

            {/* Product Grid */}
            <ProductGrid />
          </div>
        </section>
      </main>

      {/* Global Interactive Modals & Drawers */}
      <DrawerCart />
      <QuickViewModal />
      <ToastContainer />

      {/* Retail Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StorefrontContent />
    </StoreProvider>
  );
}

