import React, { useState } from 'react';
import { X, Edit3, AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { api } from '../api';

export default function EditListingModal({ listing, sellerId, onClose, onListingUpdated, showToast }) {
  if (!listing) return null;

  const [price, setPrice] = useState(listing.price);
  const [stock, setStock] = useState(listing.availableStock);
  const [moq, setMoq] = useState(listing.minOrderQuantity);
  const [status, setStatus] = useState(listing.status);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.updateListing(sellerId, listing.id, {
        price: parseFloat(price),
        availableStock: parseInt(stock, 10),
        minOrderQuantity: parseInt(moq, 10),
        status,
        version: listing.version // Crucial for optimistic locking concurrency control!
      });

      showToast({
        type: 'success',
        title: 'Listing Updated',
        message: `Successfully updated inventory for ${listing.productName}`
      });
      onListingUpdated();
      onClose();
    } catch (err) {
      if (err.status === 409) {
        showToast({
          type: 'conflict',
          title: 'Concurrency Conflict (409)',
          message: 'Another user or session modified this listing simultaneously. Please refresh to load latest values.'
        });
        setError('Conflict detected: This listing was updated by another process. Your view has expired.');
      } else {
        setError(err.data?.message || err.message || 'Failed to update listing');
        showToast({
          type: 'error',
          title: 'Update Error',
          message: err.data?.message || err.message
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Manage Listing</h3>
              <p className="text-xs text-slate-500">Update pricing, inventory levels, and visibility</p>
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

        {/* Product Context Banner */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 block">Product</span>
            <span className="font-bold text-slate-900">{listing.productName}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block">Version (Locking)</span>
            <span className="font-mono bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[11px]">
              v{listing.version}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-900 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <div className="flex-1">
                <span className="font-bold block">Update Conflict Notice</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Price */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Unit Selling Price (₹ per {listing.unitOfMeasure}) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Stock and MOQ */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Available Stock ({listing.unitOfMeasure}s) *
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Minimum Order Quantity (MOQ) *
              </label>
              <input
                type="number"
                min="1"
                value={moq}
                onChange={(e) => setMoq(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Listing Status */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Listing Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden cursor-pointer"
            >
              <option value="ACTIVE">ACTIVE (Visible to buyers)</option>
              <option value="INACTIVE">INACTIVE (Hidden / Paused)</option>
              <option value="OUT_OF_STOCK">OUT_OF_STOCK (Temporarily unavailable)</option>
            </select>
          </div>

          {/* Buttons */}
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
