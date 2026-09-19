import React from 'react';
import { ShoppingBag, Store, ShieldCheck, Clock, AlertTriangle, Building2 } from 'lucide-react';

export default function Navbar({
  activeView,
  setActiveView,
  sellers,
  currentSeller,
  setCurrentSeller
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  Bajri<span className="text-amber-600">X</span>
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  B2B Marketplace
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Construction & Building Materials Exchange
              </p>
            </div>
          </div>

          {/* Persona Switcher & Controls */}
          <div className="flex items-center gap-3">
            {/* View Switcher Pills */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveView('buyer')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeView === 'buyer'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-amber-600" />
                <span>Buyer Catalog</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('seller')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeView === 'seller'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-4 h-4 text-orange-600" />
                <span>Seller Portal</span>
              </button>
            </div>

            {/* Active Seller Switcher (When in Seller Portal mode) */}
            {activeView === 'seller' && sellers && sellers.length > 0 && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="relative">
                  <select
                    value={currentSeller?.id || ''}
                    onChange={(e) => {
                      const selected = sellers.find((s) => s.id === e.target.value);
                      if (selected) setCurrentSeller(selected);
                    }}
                    className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg focus:ring-amber-500 focus:border-amber-500 block py-1.5 pl-2.5 pr-8 font-medium cursor-pointer"
                  >
                    {sellers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.businessName} ({s.status})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Seller Status Badge */}
                {currentSeller && (
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md ${
                      currentSeller.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : currentSeller.status === 'PENDING'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {currentSeller.status === 'APPROVED' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                    {currentSeller.status === 'PENDING' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                    {currentSeller.status === 'REJECTED' && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
                    {currentSeller.status}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
