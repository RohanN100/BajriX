import React, { useState, useEffect } from 'react';
import { X, Building2, ShieldCheck, Clock, AlertTriangle, Mail, Phone, MapPin, FileText, Star, RefreshCw } from 'lucide-react';
import { api } from '../api';

export default function SellerDetailModal({ sellerId, onClose }) {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSeller() {
      if (!sellerId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await api.getSellerDetails(sellerId);
        setSeller(data);
      } catch (err) {
        setError(err.data?.message || err.message || 'Failed to fetch seller details');
      } finally {
        setLoading(false);
      }
    }
    loadSeller();
  }, [sellerId]);

  if (!sellerId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Seller Profile Details</h3>
              <p className="text-xs font-mono text-slate-500">GET /api/v1/sellers/{sellerId}</p>
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

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-600" />
              <span>Fetching seller profile from server...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : seller ? (
            <div className="space-y-5">
              {/* Business Name & Status */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <h4 className="text-xl font-extrabold text-slate-900">{seller.businessName}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {seller.rating ? seller.rating.toFixed(2) : 'N/A'} Rating
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-mono text-slate-500 text-[11px]">ID: {seller.id}</span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    seller.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : seller.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {seller.status === 'APPROVED' && <ShieldCheck className="w-3.5 h-3.5" />}
                  {seller.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                  {seller.status === 'REJECTED' && <AlertTriangle className="w-3.5 h-3.5" />}
                  {seller.status}
                </span>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-medium block">Contact Person</span>
                  <span className="font-bold text-slate-800 block text-sm">{seller.contactPerson || 'N/A'}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-medium block flex items-center gap-1">
                    <FileText className="w-3 h-3 text-slate-400" /> GSTIN Number
                  </span>
                  <span className="font-mono font-bold text-slate-800 block text-xs">{seller.gstNumber || 'N/A'}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-medium block flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" /> Email Address
                  </span>
                  <span className="font-semibold text-slate-800 block truncate">{seller.email || 'N/A'}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-medium block flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> Phone Number
                  </span>
                  <span className="font-semibold text-slate-800 block">{seller.phone || 'N/A'}</span>
                </div>

                <div className="sm:col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-medium block flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> Operating Region
                  </span>
                  <span className="font-bold text-slate-800 block">
                    {seller.city ? `${seller.city}, ${seller.state}` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
