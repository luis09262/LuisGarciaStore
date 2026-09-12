import React from 'react';
import { ArrowUpRight, Layers } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCategory } from '../../types/store';

interface CategoryCardInfo {
  title: ProductCategory;
  subtitle: string;
  count: number;
  image: string;
  badge: string;
}

const CATEGORY_CARDS: CategoryCardInfo[] = [
  {
    title: 'Guitarras & Sonido',
    subtitle: 'Guitarras eléctricas y acústicas, amplificadores y pedales',
    count: 4,
    image: 'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?q=80&w=800&auto=format&fit=crop',
    badge: 'Audio & Instrumentos',
  },
  {
    title: 'Gaming & Consolas',
    subtitle: 'PlayStation 5, mandos DualSense y periféricos gamer',
    count: 3,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=800&auto=format&fit=crop',
    badge: 'PlayStation & Gaming',
  },
  {
    title: 'Herramientas & Taller',
    subtitle: 'Taladros percutores brushless, rotomartillos y niveles láser',
    count: 3,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800&auto=format&fit=crop',
    badge: 'Taller & Bricolaje 20V',
  },
  {
    title: 'Gadgets & Tecnología',
    subtitle: 'Drones 4K, smartwatches y micrófonos de estudio',
    count: 4,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800&auto=format&fit=crop',
    badge: 'Tecnología & Gadgets',
  },
];

export const CategoryBento: React.FC = () => {
  const { toggleCategory, filterState } = useStore();

  const handleSelectCategory = (cat: ProductCategory) => {
    if (!filterState.selectedCategories.includes(cat)) {
      toggleCategory(cat);
    }
    const catalogEl = document.getElementById('product-catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-8 sm:pb-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C85A32]">
            <Layers className="w-3.5 h-3.5" />
            <span>Colecciones Principales</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight mt-1">
            Explora por Categoría
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#666059] max-w-md">
          Encuentra productos seleccionados en audio, videojuegos, herramientas y gadgets tecnológicos de alto rendimiento.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {CATEGORY_CARDS.map((item) => {
          const isSelected = filterState.selectedCategories.includes(item.title);

          return (
            <div
              key={item.title}
              onClick={() => handleSelectCategory(item.title)}
              className={`group relative h-76 sm:h-80 rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 shadow-2xs hover:shadow-lg ${
                isSelected ? 'border-[#C85A32] ring-2 ring-[#C85A32]/40' : 'border-[#EFECE6] hover:border-[#D8D2C6]'
              }`}
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                referrerPolicy="no-referrer"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/40 to-transparent transition-opacity" />

              {/* Top Tag */}
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#1A1A1A]/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/20">
                  {item.badge}
                </span>
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                <div className="space-y-1">
                  <h3 className="text-base font-bold tracking-tight text-white group-hover:text-[#E5A88B] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#EDE8DF]/90 line-clamp-2 leading-tight">
                    {item.subtitle}
                  </p>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-[#1A1A1A] bg-white/95 px-2 py-0.5 rounded-sm inline-block shadow-2xs">
                      {item.count} Productos
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-[#C85A32] group-hover:text-white transition-all flex-shrink-0 ml-2">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

