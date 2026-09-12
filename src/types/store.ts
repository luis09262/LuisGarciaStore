export type ProductCategory = string;

export interface StoreCategory {
  id: string;
  name: string;
  count: number;
  description?: string;
  badge?: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  category: ProductCategory;
  tags: string[]; // e.g. "OFERTA", "NUEVO", "MÁS VENDIDO", "DESTACADO"
  badgeType?: 'offer' | 'hot' | 'new' | 'limited' | 'discount';
  discountPercent?: number;
  inStock: boolean;
  images: string[];
  secondaryImage?: string;
  sizes?: string[];
  specifications: { [key: string]: string };
  features: string[];
  isFeatured?: boolean;
  accentColor?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize?: string;
  quantity: number;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

export interface FilterState {
  searchQuery: string;
  selectedCategories: ProductCategory[];
  priceRange: [number, number];
  minRating: number;
  inStockOnly: boolean;
  sortBy: SortOption;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'cart' | 'wishlist' | 'info';
}

