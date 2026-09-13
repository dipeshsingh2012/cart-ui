import React, { useState } from 'react';
import { CartFragment } from './components/CartFragment';
import { CheckCircle2, RotateCcw, X } from 'lucide-react';

export const App: React.FC = () => {
  const [toast, setToast] = useState<string | null>(null);
  const [cartKey, setCartKey] = useState(0);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast((prev) => (prev === msg ? null : prev)), 3500);
  };

  const handleResetCart = () => {
    try {
      localStorage.removeItem('cart_cart_demo_session');
      localStorage.removeItem('cart_default');
    } catch {}
    setCartKey((k) => k + 1);
    showToast('Reset cart to initial demo items.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-slate-900 tracking-tight">
            Cart UI Fragment Harness
          </span>
          <span className="text-xs bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-semibold">
            Standalone Mode (Port 5176)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetCart}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Cart</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6">
        <CartFragment
          key={cartKey}
          cartId="cart_demo_session"
          onVerifyFitmentClick={(id) => showToast(`Navigating to verify fitment for: ${id}`)}
          onProceedToCheckout={(cart) => showToast(`Proceeding to checkout with ${cart.total_items_count} items (Total: $${(cart.total_price_cents / 100).toFixed(2)})`)}
        />
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-2xl shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;

