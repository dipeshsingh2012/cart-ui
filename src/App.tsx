import React from 'react';
import { CartFragment } from './components/CartFragment';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
        <span className="font-extrabold text-slate-900">
          Cart UI Fragment Harness
        </span>
        <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-semibold">
          Port 5176
        </span>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        <CartFragment
          onVerifyFitmentClick={(id) => alert(`Navigating to verify fitment for: ${id}`)}
          onProceedToCheckout={(cart) => alert(`Proceeding to checkout with ${cart.total_items_count} items!`)}
        />
      </main>
    </div>
  );
};

export default App;

