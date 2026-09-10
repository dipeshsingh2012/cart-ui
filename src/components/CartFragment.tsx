import React, { useEffect, useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { fetchCart, removeLineItem, updateLineItemQuantity } from '../api';
import { CartData } from '../types';

interface CartFragmentProps {
  cartId?: string;
  onVerifyFitmentClick?: (productId: string) => void;
  onProceedToCheckout?: (cart: CartData) => void;
}

export const CartFragment: React.FC<CartFragmentProps> = ({
  cartId,
  onVerifyFitmentClick,
  onProceedToCheckout,
}) => {
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      const data = await fetchCart(cartId);
      setCart(data);
      setIsLoading(false);
    }
    load();
  }, [cartId]);

  const handleUpdateQty = async (lineItemId: string, newQty: number) => {
    if (!cart) return;
    if (newQty <= 0) {
      handleRemove(lineItemId);
      return;
    }
    const updated = await updateLineItemQuantity(cart.id, lineItemId, newQty);
    if (updated) {
      setCart(updated);
    } else {
      // Local optimistic update
      const items = cart.line_items.map((li) =>
        li.id === lineItemId
          ? {
              ...li,
              quantity: newQty,
              total_price_cents: newQty * li.price_cents,
            }
          : li
      );
      setCart({
        ...cart,
        line_items: items,
        total_price_cents: items.reduce((sum, i) => sum + i.total_price_cents, 0),
        total_items_count: items.reduce((sum, i) => sum + i.quantity, 0),
      });
    }
  };

  const handleRemove = async (lineItemId: string) => {
    if (!cart) return;
    const updated = await removeLineItem(cart.id, lineItemId);
    if (updated) {
      setCart(updated);
    } else {
      const items = cart.line_items.filter((li) => li.id !== lineItemId);
      setCart({
        ...cart,
        line_items: items,
        total_price_cents: items.reduce((sum, i) => sum + i.total_price_cents, 0),
        total_items_count: items.reduce((sum, i) => sum + i.quantity, 0),
      });
    }
  };

  if (isLoading || !cart) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const subtotal = cart.total_price_cents / 100.0;
  const estimatedTax = subtotal * 0.08;
  const grandTotal = subtotal + estimatedTax;

  if (cart.line_items.length === 0) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">
          Your commercetools cart session is ready. Add appliances to check kitchen fitment.
        </p>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-8 space-y-4">
          {cart.line_items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-slate-50 p-2 flex items-center justify-center shrink-0 border border-slate-100">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-slate-300" />
                    )}
                  </div>

                  <div>
                    {item.brand && (
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                        {item.brand}
                      </span>
                    )}
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{item.name}</h3>
                    {item.dimensions_summary && (
                      <p className="text-xs font-mono text-slate-500 mt-0.5">
                        {item.dimensions_summary}
                      </p>
                    )}
                    <span className="text-xs font-black text-slate-800 mt-1 block">
                      ${(item.price_cents / 100).toFixed(2)} each
                    </span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                      className="p-1 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                      className="p-1 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-sm font-black text-slate-900 w-20 text-right">
                    ${(item.total_price_cents / 100).toFixed(2)}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Kitchen Fitment Readiness Alert */}
              <div
                className={`p-3 rounded-2xl text-xs flex items-center justify-between gap-3 ${
                  item.fitment_verified
                    ? 'bg-emerald-50/80 border border-emerald-200 text-emerald-800'
                    : 'bg-amber-50/80 border border-amber-200 text-amber-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.fitment_verified ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span>
                    {item.fitment_verified
                      ? 'Countertop Fitment Verified: Cleared for your kitchen clearance.'
                      : 'Countertop clearance not yet confirmed for your cabinets.'}
                  </span>
                </div>

                {!item.fitment_verified && onVerifyFitmentClick && (
                  <button
                    type="button"
                    onClick={() => onVerifyFitmentClick(item.product_id)}
                    className="px-2.5 py-1 rounded-lg bg-amber-200/60 hover:bg-amber-200 text-amber-900 text-[11px] font-bold whitespace-nowrap transition-colors"
                  >
                    Verify Fitment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Order Summary</h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>White-Glove Delivery</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax</span>
                <span className="font-semibold text-slate-800">${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total</span>
                <span className="text-2xl font-black text-slate-900">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onProceedToCheckout?.(cart)}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm shadow-indigo-200 transition-colors"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-[11px] text-slate-500 space-y-1.5 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero-Error Fitment Guarantee Protection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Free returns if verified appliance does not fit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartFragment;
