import { createClient } from '@supabase/supabase-js';
import { Product, ProductCategory } from '../types/store';

const env = (import.meta as { env?: Record<string, string> }).env || {};

export const SUPABASE_URL = 
  env.VITE_SUPABASE_URL || 'https://nrgxlczcorfwvyytujii.supabase.co';

export const SUPABASE_ANON_KEY = 
  env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yZ3hsY3pjb3Jmd3Z5eXR1amlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxNjU2MDIsImV4cCI6MjEwNDc0MTYwMn0.TBRExMAwU807ChD22aa2bap9eBnpRiuBvTo9VIMF6JM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface DbProductRow {
  id: string;
  name: string;
  subtitle?: string | null;
  description?: string | null;
  price: number;
  original_price?: number | null;
  rating?: number | null;
  reviews_count?: number | null;
  category: string;
  tags?: string[] | null;
  badge_type?: 'offer' | 'hot' | 'new' | 'limited' | 'discount' | null;
  discount_percent?: number | null;
  in_stock?: boolean | null;
  is_featured?: boolean | null;
  accent_color?: string | null;
  images?: string[] | null;
  secondary_image?: string | null;
  sizes?: string[] | null;
  specifications?: Record<string, string> | null;
  features?: string[] | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbCategoryRow {
  id: string;
  name: string;
  count: number;
  description: string;
  badge: string;
  image: string;
}

/**
 * Transforms a Supabase DB row into the application Product interface
 */
export function mapRowToProduct(row: DbProductRow): Product {
  const images = Array.isArray(row.images) ? row.images : [];
  const tags = Array.isArray(row.tags) ? row.tags : [];
  const sizes = Array.isArray(row.sizes) ? row.sizes : [];
  const features = Array.isArray(row.features) ? row.features : [];
  const specifications = (typeof row.specifications === 'object' && row.specifications !== null)
    ? row.specifications
    : {};

  return {
    id: row.id,
    name: row.name,
    subtitle: row.subtitle || '',
    description: row.description || '',
    price: Number(row.price),
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    rating: row.rating != null ? Number(row.rating) : 5.0,
    reviewsCount: row.reviews_count != null ? Number(row.reviews_count) : 0,
    category: row.category as ProductCategory,
    tags: tags,
    badgeType: row.badge_type || undefined,
    discountPercent: row.discount_percent != null ? Number(row.discount_percent) : undefined,
    inStock: row.in_stock ?? true,
    isFeatured: row.is_featured ?? false,
    accentColor: row.accent_color || undefined,
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1550291652-6ea9114a47b1?q=80&w=1000&auto=format&fit=crop'],
    secondaryImage: row.secondary_image || (images[1] ? images[1] : undefined),
    sizes: sizes.length > 0 ? sizes : undefined,
    specifications: specifications,
    features: features,
  };
}

/**
 * Transforms a Product object to a Supabase DB row payload
 */
export function mapProductToRow(product: Product): DbProductRow {
  return {
    id: product.id,
    name: product.name,
    subtitle: product.subtitle || '',
    description: product.description || '',
    price: product.price,
    original_price: product.originalPrice ?? null,
    rating: product.rating,
    reviews_count: product.reviewsCount,
    category: product.category,
    tags: product.tags,
    badge_type: product.badgeType ?? null,
    discount_percent: product.discountPercent ?? null,
    in_stock: product.inStock,
    is_featured: product.isFeatured ?? false,
    accent_color: product.accentColor ?? null,
    images: product.images,
    secondary_image: product.secondaryImage ?? null,
    sizes: product.sizes ?? [],
    specifications: product.specifications,
    features: product.features,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Fetch all products from Supabase
 */
export async function fetchProductsFromSupabase(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching products from Supabase:', error);
    throw error;
  }

  return (data as DbProductRow[]).map(mapRowToProduct);
}

/**
 * Fetch all categories from Supabase
 */
export async function fetchCategoriesFromSupabase(): Promise<DbCategoryRow[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching categories from Supabase:', error);
    throw error;
  }

  return data as DbCategoryRow[];
}

/**
 * Create or update a category in Supabase
 */
export async function upsertCategoryInSupabase(cat: {
  id?: string;
  name: string;
  description?: string;
  badge?: string;
  image?: string;
}): Promise<DbCategoryRow> {
  const id = cat.id || cat.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  const payload = {
    id,
    name: cat.name.trim(),
    description: cat.description || '',
    badge: cat.badge || cat.name,
    image: cat.image || 'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?q=80&w=800&auto=format&fit=crop',
  };

  const { data, error } = await supabase
    .from('categories')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('Error upserting category in Supabase:', error);
    throw error;
  }

  return data as DbCategoryRow;
}

/**
 * Delete a category by ID from Supabase
 */
export async function deleteCategoryFromSupabase(id: string): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category from Supabase:', error);
    throw error;
  }
}

/**
 * Upload an image directly to the Supabase storage bucket 'product-images'
 * Returns the public URL of the uploaded image.
 */
export async function uploadProductImage(file: File | Blob, fileNamePrefix: string = 'product'): Promise<string> {
  const fileExt = file instanceof File ? file.name.split('.').pop() || 'png' : 'png';
  const cleanName = `${fileNamePrefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `uploads/${cleanName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    console.error('Error uploading product image to Supabase Storage:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
