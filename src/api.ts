import { CartData } from './types';

const CART_API_URL = import.meta.env.VITE_CART_API_URL || 'https://cart-service-fzdcrf2fxq-uc.a.run.app/api/v1/carts';

export const INITIAL_FALLBACK_CART: CartData = {
  id: 'cart_demo_session',
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
      product_id: 'prod_hiljhil_guji',
      name: 'Ethiopian Guji Single Origin (250g)',
      quantity: 1,
      price_cents: 2200,
      total_price_cents: 2200,
      currency_code: 'USD',
      brand: 'Hiljhil Roasters',
      image_url: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&auto=format&fit=crop&q=80',
      dimensions_summary: 'Whole Bean Roast',
      fitment_verified: true,
    },
  ],
  total_price_cents: 102195,
  currency_code: 'USD',
  total_items_count: 2,
};

function getLocalCart(cartId?: string): CartData {
  if (typeof window === 'undefined') return INITIAL_FALLBACK_CART;
  try {
    const raw = localStorage.getItem(`cart_${cartId || 'default'}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { ...INITIAL_FALLBACK_CART, id: cartId || INITIAL_FALLBACK_CART.id };
}

function saveLocalCart(cart: CartData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`cart_${cart.id}`, JSON.stringify(cart));
  } catch {}
}

export async function fetchCart(cartId?: string): Promise<CartData> {
  if (CART_API_URL) {
    const url = cartId ? `${CART_API_URL}/${cartId}` : CART_API_URL;
    try {
      const res = await fetch(url, {
        method: cartId ? 'GET' : 'POST',
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Could not reach cart-service, using fallback local cart');
    }
  }

  return getLocalCart(cartId);
}

export async function updateLineItemQuantity(
  cartId: string,
  lineItemId: string,
  quantity: number
): Promise<CartData | null> {
  if (CART_API_URL) {
    try {
      const res = await fetch(`${CART_API_URL}/${cartId}/items/${lineItemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Could not update quantity via cart-service, updating locally');
    }
  }

  const local = getLocalCart(cartId);
  const items = local.line_items.map((li) =>
    li.id === lineItemId
      ? { ...li, quantity, total_price_cents: quantity * li.price_cents }
      : li
  );
  const updated: CartData = {
    ...local,
    line_items: items,
    total_price_cents: items.reduce((sum, i) => sum + i.total_price_cents, 0),
    total_items_count: items.reduce((sum, i) => sum + i.quantity, 0),
  };
  saveLocalCart(updated);
  return updated;
}

export async function removeLineItem(
  cartId: string,
  lineItemId: string
): Promise<CartData | null> {
  if (CART_API_URL) {
    try {
      const res = await fetch(`${CART_API_URL}/${cartId}/items/${lineItemId}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Could not delete line item via cart-service, removing locally');
    }
  }

  const local = getLocalCart(cartId);
  const items = local.line_items.filter((li) => li.id !== lineItemId);
  const updated: CartData = {
    ...local,
    line_items: items,
    total_price_cents: items.reduce((sum, i) => sum + i.total_price_cents, 0),
    total_items_count: items.reduce((sum, i) => sum + i.quantity, 0),
  };
  saveLocalCart(updated);
  return updated;
}

