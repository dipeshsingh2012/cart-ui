export interface CartLineItem {
  id: string;
  product_id: string;
  name: string;
  quantity: number;
  price_cents: number;
  total_price_cents: number;
  currency_code: string;
  image_url?: string;
  brand?: string;
  dimensions_summary?: string;
  fitment_verified: boolean;
}

export interface CartData {
  id: string;
  version: number;
  line_items: CartLineItem[];
  total_price_cents: number;
  currency_code: string;
  total_items_count: number;
}
