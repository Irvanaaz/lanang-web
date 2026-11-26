export interface StoreListItem {
  id: string;
  name: string;
  slug: string;
  category_name: string;
  description: string | null;
  price_min: number | null;
  price_max: number | null;
  rt: string | null;
  rw: string | null;
  status: 'open' | 'closed' | 'holiday';
  is_open_now: boolean;
  special_today: string | null;
  content_updated_at: string;
  cover_photo: string | null;
  avg_rating: number;
  review_count: number;
  moods: string[];
}

export interface StoreListItem {
  id: string;
  name: string;
  slug: string;
  category_name: string;
  description: string | null;
  price_min: number | null;
  price_max: number | null;
  rt: string | null;
  rw: string | null;
  status: 'open' | 'closed' | 'holiday';
  is_open_now: boolean;
  special_today: string | null;
  content_updated_at: string;
  cover_photo: string | null;
  avg_rating: number;
  review_count: number;
  moods: string[];
  latitude: number | null;
  longitude: number | null;
}

export interface StoreListItem {
  id: string;
  name: string;
  slug: string;
  category_name: string;
  description: string | null;
  price_min: number | null;
  price_max: number | null;
  rt: string | null;
  rw: string | null;
  status: 'open' | 'closed' | 'holiday';
  is_open_now: boolean;
  special_today: string | null;
  content_updated_at: string;
  cover_photo: string | null;
  avg_rating: number;
  review_count: number;
  moods: string[];
  latitude: number | null;
  longitude: number | null;
}

export interface StoreMenuItem {
  id: string;
  name: string;
  price: number;
  description: string | null;
  photo_path: string | null;
  is_available: boolean;
  sort_order: number;
}

export interface StoreHour {
  id: string;
  day_of_week: number; // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
}

export interface StorePhoto {
  id: string;
  path: string;
  sort_order: number;
}

export interface StoreReview {
  id: string;
  reviewer_name: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface StoreDetail extends Omit<StoreListItem, 'cover_photo'> {
  whatsapp: string;
  address: string | null;
  maps_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  special_today_date: string | null;
  photos: StorePhoto[];
  menus: StoreMenuItem[];
  hours: StoreHour[];
  reviews: StoreReview[];
}