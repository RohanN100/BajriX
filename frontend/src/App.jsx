import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BuyerExperience from './components/BuyerExperience';
import SellerPortal from './components/SellerPortal';
import ProductDetailModal from './components/ProductDetailModal';
import Toast from './components/Toast';
import { api } from './api';
import { Building2, CheckCircle2, ShieldCheck, Database, Layers } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('buyer'); // 'buyer' | 'seller'
  const [sellers, setSellers] = useState([]);
  const [currentSeller, setCurrentSeller] = useState(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [toast, setToast] = useState(null);

  // Load sellers list for role switcher
  useEffect(() => {
    async function loadSellers() {
      try {
        const data = await api.getSellers();
        setSellers(data || []);
        if (data && data.length > 0) {
          // Default to the first APPROVED seller
          const approved = data.find((s) => s.status === 'APPROVED') || data[0];
          setCurrentSeller(approved);
        }
      } catch (err) {
        console.error('Failed to load sellers', err);
      }
    }
    loadSellers();
  }, []);

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => {
      setToast(null);
    }, 6000);
  };

  const handleSelectProduct = async (productId) => {
    try {
      const detail = await api.getProductDetails(productId);
      setSelectedProductDetail(detail);
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Failed to load offerings',
        message: err.data?.message || err.message
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      {/* App Header & Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        sellers={sellers}
        currentSeller={currentSeller}
        setCurrentSeller={setCurrentSeller}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeView === 'buyer' ? (
          <BuyerExperience onSelectProduct={handleSelectProduct} />
        ) : (
          <SellerPortal
            currentSeller={currentSeller}
            showToast={showToast}
          />
        )}
      </main>

      {/* Product Comparison & Calculator Modal */}
      {selectedProductDetail && (
        <ProductDetailModal
          productDetail={selectedProductDetail}
          onClose={() => setSelectedProductDetail(null)}
        />
      )}

      {/* Toast Notification Alert */}
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-600" />
            <span className="font-bold text-slate-800">BajriX Marketplace</span>
            <span>• Multi-Seller Construction Supply Architecture</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-600">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Seller Status Isolation
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-600" /> Optimistic Concurrency Control
            </span>
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-purple-600" /> Canonical Product vs Seller Offerings
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
