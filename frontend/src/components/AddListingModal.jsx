import React, { useState, useEffect } from 'react';
import { X, Plus, Package, AlertCircle, Building2, Store } from 'lucide-react';
import { api } from '../api';

export default function AddListingModal({
  sellerId: initialSellerId,
  sellers = [],
  onSellerChange,
  onClose,
  onListingCreated,
  showToast
}) {
  const [activeSellerId, setActiveSellerId] = useState(initialSellerId || (sellers[0]?.id || ''));
  const [unlistedProducts, setUnlistedProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [moq, setMoq] = useState('1');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUnlisted() {
      if (!activeSellerId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await api.getUnlistedProducts(activeSellerId);
        setUnlistedProducts(data || []);
        if (data && data.length > 0) {
          setSelectedProductId(data[0].id);
        } else {
          setSelectedProductId('');
        }
      } catch (err) {
        setError('Failed to load unlisted products for the selected seller catalog');
      } finally {
        setLoading(false);
      }
    }
    loadUnlisted();
  }, [activeSellerId]);

  const handleSellerSelect = (newSellerId) => {
    setActiveSellerId(newSellerId);
    if (onSellerChange) {
      const selected = sellers.find((s) => s.id === newSellerId);
      if (selected) onSellerChange(selected);
    }
  };

  const selectedProduct = unlistedProducts.find((p) => p.id === selectedProductId);
  const currentSellerObj = sellers.find((s) => s.id === activeSellerId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeSellerId) {
      setError('Please select a seller account');
      return;
    }
    if (!selectedProductId || !price || stock === '') {
      setError('Please provide all mandatory fields');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.createListing(activeSellerId, {
        productId: selectedProductId,
        price: parseFloat(price),
        availableStock: parseInt(stock, 10),
        minOrderQuantity: parseInt(moq, 10) || 1,
        status: 'ACTIVE'
      });

      if (showToast) {
        showToast({
          type: 'success',
          title: 'Listing Created',
          message: `Product successfully listed for ${currentSellerObj?.businessName || 'Seller'}!`
        });
      }
      onListingCreated();
      onClose();
    } catch (err) {
      setError(err.data?.message || err.message || 'Failed to create listing');
      if (showToast) {
        showToast({
          type: 'error',
          title: 'Listing Failed',
          message: err.data?.message || err.message
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-white rounded-lg">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add Product Listing to Seller</h3>
              <p className="text-xs text-slate-500">Pick a seller account, select a product, and set price/stock</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Seller Selection Dropdown */}
          {sellers && sellers.length > 0 && (
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1.5">
              <label className="block text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-amber-600" />
                Target Seller Account *
              </label>
              <select
                value={activeSellerId}
                onChange={(e) => handleSellerSelect(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden cursor-pointer"
              >
                {sellers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.businessName} ({s.city}, {s.state}) — Status: {s.status}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-amber-800/80">
                You can switch between sellers to publish listings under different seller accounts.
              </p>
            </div>
          )}

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-500">Loading unlisted catalog products for this seller...</div>
          ) : unlistedProducts.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <Package className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-600 font-medium">This seller has already listed all available catalog products!</p>
            </div>
          ) : (
            <>
              {/* Product Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Catalog Product *
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden cursor-pointer font-medium"
                >
                  {unlistedProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.brand}) - SKU: {p.sku}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProduct && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Category: <strong>{selectedProduct.category?.name}</strong></span>
                    <span>Unit: <strong>{selectedProduct.unitOfMeasure}</strong></span>
                  </div>
                  <p className="text-slate-500 text-[11px] line-clamp-2">{selectedProduct.description}</p>
                </div>
              )}

              {/* Price Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Selling Price (₹ per {selectedProduct?.unitOfMeasure || 'unit'}) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="e.g. 385.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Stock and MOQ Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Available Stock ({selectedProduct?.unitOfMeasure || 'units'}) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 500"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Minimum Order (MOQ) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 10"
                    value={moq}
                    onChange={(e) => setMoq(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Creating Listing...' : 'Publish Listing'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
