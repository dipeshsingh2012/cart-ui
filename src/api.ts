import { CartData } from './types';

const CART_API_URL = import.meta.env.VITE_CART_API_URL || 'http://localhost:8003/api/v1/cart';

export async function fetchCart(cartId?: string): Promise<CartData> {
  const url = cartId ? `${CART_API_URL}/${cartId}` : CART_API_URL;
  try {
    const res = await fetch(url, {
      method: cartId ? 'GET' : 'POST',
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Could not reach cart-service, using fallback cart');
  }

  return {
    id: cartId || 'cart_demo_sample',
    version: 1,
    line_items: [
      {
        id: 'li_sample_1',
        product_id: 'prod_breville_barista_touch',
        name: 'Barista Touch Espresso Machine',
        quantity: 1,
        price_cents: 99995,
        total_price_cents: 99995,
        currency_code: 'USD',
        brand: 'Breville',
        image_url: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&auto=format&fit=crop&q=80',
        dimensions_summary: '32.2 × 40.7 × 32.2 cm',
        fitment_verified: true,
      },
      {
        id: 'li_sample_2',
        product_id: 'prod_vitamix_5200',
        name: '5200 Professional Blender',
        quantity: 1,
        price_cents: 49995,
        total_price_cents: 49995,
        currency_code: 'USD',
        brand: 'Vitamix',
        image_url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&auto=format&fit=crop&q=80',
        dimensions_summary: '22.2 × 52.0 × 18.5 cm',
        fitment_verified: false,
      },
    ],
    total_price_cents: 149990,
    currency_code: 'USD',
    total_items_count: 2,
  };
}

export async function updateLineItemQuantity(
  cartId: string,
  lineItemId: string,
  quantity: number
): Promise<CartData | null> {
  try {
    const res = await fetch(`${CART_API_URL}/${cartId}/items/${lineItemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Could not update quantity via cart-service');
  }
  return null;
}

export async function removeLineItem(
  cartId: string,
  lineItemId: string
): Promise<CartData | null> {
  try {
    const res = await fetch(`${CART_API_URL}/${cartId}/items/${lineItemId}`, {
      method: 'DELETE',
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Could not delete line item via cart-service');
  }
  return null;
}
