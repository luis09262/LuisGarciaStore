import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Product,
  CartItem,
  FilterState,
  ProductCategory,
  SortOption,
  ToastMessage,
  StoreCategory,
} from '../types/store';
import { MOCK_PRODUCTS, CATEGORIES_LIST } from '../data/mockProducts';
import { supabase, fetchProductsFromSupabase, fetchCategoriesFromSupabase } from '../lib/supabase';

const FREE_SHIPPING_THRESHOLD = 100.0;

interface StoreContextType {
  // Products & Filtering
  products: Product[];
  categories: StoreCategory[];
  categoryNames: string[];
  isLoadingProducts: boolean;
  refreshProducts: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  filteredProducts: Product[];
  filterState: FilterState;
  setSearchQuery: (query: string) => void;
  toggleCategory: (category: ProductCategory) => void;
  setPriceRange: (range: [number, number]) => void;
  setMinRating: (rating: number) => void;
  setSortBy: (sort: SortOption) => void;
  setInStockOnly: (inStock: boolean) => void;
  resetFilters: () => void;
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: (open: boolean) => void;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  freeShippingThreshold: number;
  freeShippingProgress: number; // 0 to 100
  amountNeededForFreeShipping: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (
    product: Product,
    size?: string,
    quantity?: number
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Quick View Modal
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: 'cart' | 'wishlist' | 'info') => void;
  removeToast: (id: string) => void;
}

const initialFilterState: FilterState = {
  searchQuery: '',
  selectedCategories: [],
  priceRange: [0, 10000],
  minRating: 0,
  inStockOnly: false,
  sortBy: 'featured',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [rawCategories, setRawCategories] = useState<StoreCategory[]>(
    CATEGORIES_LIST.map((c) => ({
      id: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: c.name,
      count: c.count,
      description: c.description,
      badge: c.badge,
      image: c.image,
    }))
  );
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch products from Supabase
  const refreshProducts = useCallback(async () => {
    try {
      const fetched = await fetchProductsFromSupabase();
      if (fetched && fetched.length > 0) {
        setProducts(fetched);
      }
    } catch (err) {
      console.warn('Could not load products from Supabase, using local fallback:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  // Fetch categories from Supabase
  const refreshCategories = useCallback(async () => {
    try {
      const fetched = await fetchCategoriesFromSupabase();
      if (fetched && fetched.length > 0) {
        setRawCategories(
          fetched.map((row) => ({
            id: row.id,
            name: row.name,
            count: row.count,
            description: row.description,
            badge: row.badge,
            image: row.image,
          }))
        );
      }
    } catch (err) {
      console.warn('Could not load categories from Supabase:', err);
    }
  }, []);

  // Initial load and Realtime listener
  useEffect(() => {
    refreshProducts();
    refreshCategories();

    // Setup Supabase Realtime channel for BOTH products and categories
    const productsChannel = supabase
      .channel('store-realtime-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('[Supabase Realtime] Product change detected:', payload.eventType);
          refreshProducts();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        (payload) => {
          console.log('[Supabase Realtime] Category change detected:', payload.eventType);
          refreshCategories();
          refreshProducts();
        }
      )
      .subscribe((status) => {
        console.log('[Supabase Realtime] Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(productsChannel);
    };
  }, [refreshProducts, refreshCategories]);

  // Compute live category list with accurate product counts
  const categories: StoreCategory[] = useMemo(() => {
    const map = new Map<string, StoreCategory>();

    // Add known categories from database
    rawCategories.forEach((cat) => {
      map.set(cat.name, {
        ...cat,
        count: products.filter((p) => p.category === cat.name).length,
      });
    });

    // Also auto-discover any categories used in active products that might not be in the table yet
    products.forEach((prod) => {
      if (prod.category && !map.has(prod.category)) {
        map.set(prod.category, {
          id: prod.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: prod.category,
          count: products.filter((p) => p.category === prod.category).length,
          description: `Colección de ${prod.category}`,
          badge: prod.category,
          image: prod.images?.[0] || 'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?q=80&w=800&auto=format&fit=crop',
        });
      }
    });

    return Array.from(map.values());
  }, [rawCategories, products]);

  const categoryNames = useMemo(() => categories.map((c) => c.name), [categories]);

  // Cart State (Initialized clean / empty for real shoppers)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('varieplus_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('varieplus_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Wishlist State (Initialized clean / empty)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('varieplus_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('varieplus_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (title: string, description?: string, type: 'cart' | 'wishlist' | 'info' = 'cart') => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
      const newToast: ToastMessage = { id, title, description, type };
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Filter actions
  const setSearchQuery = useCallback((query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const toggleCategory = useCallback((category: ProductCategory) => {
    setFilterState((prev) => {
      const exists = prev.selectedCategories.includes(category);
      const nextCategories = exists
        ? prev.selectedCategories.filter((c) => c !== category)
        : [...prev.selectedCategories, category];
      return { ...prev, selectedCategories: nextCategories };
    });
  }, []);

  const setPriceRange = useCallback((range: [number, number]) => {
    setFilterState((prev) => ({ ...prev, priceRange: range }));
  }, []);

  const setMinRating = useCallback((rating: number) => {
    setFilterState((prev) => ({
      ...prev,
      minRating: prev.minRating === rating ? 0 : rating,
    }));
  }, []);

  const setSortBy = useCallback((sortBy: SortOption) => {
    setFilterState((prev) => ({ ...prev, sortBy }));
  }, []);

  const setInStockOnly = useCallback((inStockOnly: boolean) => {
    setFilterState((prev) => ({ ...prev, inStockOnly }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilterState(initialFilterState);
  }, []);

  // Filtered Products computation
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search Query
      if (filterState.searchQuery.trim()) {
        const query = filterState.searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesSubtitle = product.subtitle.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesTags = product.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesSubtitle && !matchesCategory && !matchesTags) {
          return false;
        }
      }

      // Category
      if (
        filterState.selectedCategories.length > 0 &&
        !filterState.selectedCategories.includes(product.category)
      ) {
        return false;
      }

      // Price range
      if (
        product.price < filterState.priceRange[0] ||
        product.price > filterState.priceRange[1]
      ) {
        return false;
      }

      // Rating
      if (filterState.minRating > 0 && product.rating < filterState.minRating) {
        return false;
      }

      // In Stock
      if (filterState.inStockOnly && !product.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filterState.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.tags.includes('NUEVO') || b.tags.includes('NEW') ? 1 : -1;
        case 'featured':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [products, filterState]);

  // Cart calculations
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  const freeShippingProgress = useMemo(() => {
    return Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
  }, [cartSubtotal]);

  const amountNeededForFreeShipping = useMemo(() => {
    return Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  }, [cartSubtotal]);

  // Cart actions
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const addToCart = useCallback(
    (
      product: Product,
      size?: string,
      quantity = 1
    ) => {
      const selectedSize = size || product.sizes?.[0];
      const itemId = `${product.id}-${selectedSize || 'std'}`;

      setCart((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === itemId);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        }
        return [
          ...prev,
          {
            id: itemId,
            product,
            selectedSize,
            quantity,
          },
        ];
      });

      addToast(
        `Añadido al Carrito`,
        product.name,
        'cart'
      );
      setIsCartOpen(true);
    },
    [addToast]
  );

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== itemId));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Wishlist actions
  const toggleWishlist = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id === productId);
      setWishlist((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          if (product) addToast('Eliminado de Favoritos', product.name, 'wishlist');
          return prev.filter((id) => id !== productId);
        } else {
          if (product) addToast('Guardado en Favoritos', product.name, 'wishlist');
          return [...prev, productId];
        }
      });
    },
    [products, addToast]
  );

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.includes(productId);
    },
    [wishlist]
  );

  // Quick View actions
  const openQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
  }, []);

  const closeQuickView = useCallback(() => {
    setQuickViewProduct(null);
  }, []);

  const value = {
    products,
    categories,
    categoryNames,
    isLoadingProducts,
    refreshProducts,
    refreshCategories,
    filteredProducts,
    filterState,
    setSearchQuery,
    toggleCategory,
    setPriceRange,
    setMinRating,
    setSortBy,
    setInStockOnly,
    resetFilters,
    isMobileFilterOpen,
    setIsMobileFilterOpen,

    cart,
    cartCount,
    cartSubtotal,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    freeShippingProgress,
    amountNeededForFreeShipping,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,

    wishlist,
    toggleWishlist,
    isInWishlist,

    quickViewProduct,
    openQuickView,
    closeQuickView,

    toasts,
    addToast,
    removeToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

