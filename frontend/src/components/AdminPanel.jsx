import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  Building2,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Package,
  Layers,
  Star,
  MapPin,
  Mail,
  Phone,
  FileText,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Database,
  CheckCircle2
} from 'lucide-react';
import { api } from '../api';

export default function AdminPanel({ showToast }) {
  const [sellers, setSellers] = useState([]);
  const [loadingSellers, setLoadingSellers] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [sellerDetails, setSellerDetails] = useState(null);
  const [sellerListings, setSellerListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Load sellers list
  const loadSellersList = async (status) => {
    setLoadingSellers(true);
    try {
      const filterParam = status === 'ALL' ? undefined : status;
      const data = await api.getSellers(filterParam);
      setSellers(data || []);
      // Default to first seller if none selected
      if (data && data.length > 0 && !selectedSeller) {
        handleSelectSeller(data[0]);
      }
    } catch (err) {
      if (showToast) {
        showToast({
          type: 'error',
          title: 'Admin Error',
          message: err.data?.message || err.message || 'Failed to load sellers'
        });
      }
    } finally {
      setLoadingSellers(false);
    }
  };

  useEffect(() => {
    loadSellersList(statusFilter);
  }, [statusFilter]);

  // Handle selecting a seller & calling GET /api/v1/admin/sellers/{sellerId}/listings
  const handleSelectSeller = async (sellerObj) => {
    setSelectedSeller(sellerObj);
    setLoadingListings(true);
    setSellerListings([]);
    setSellerDetails(sellerObj);

    try {
      // Fetch full seller profile details
      const detail = await api.getSellerDetails(sellerObj.id).catch(() => sellerObj);
      setSellerDetails(detail || sellerObj);

      // Fetch admin seller listings: GET /api/v1/admin/sellers/{sellerId}/listings
      const listings = await api.getAdminSellerListings(sellerObj.id);
      setSellerListings(listings || []);
    } catch (err) {
      console.error('Failed to load seller listings via Admin API', err);
      if (showToast) {
        showToast({
          type: 'error',
          title: 'Listings Fetch Failed',
          message: err.data?.message || err.message || 'Could not fetch admin listings for seller'
        });
      }
    } finally {
      setLoadingListings(false);
    }
  };

  // Filter sellers for search bar
  const filteredSellers = sellers.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.businessName?.toLowerCase().includes(q) ||
      s.city?.toLowerCase().includes(q) ||
      s.contactPerson?.toLowerCase().includes(q) ||
      s.gstNumber?.toLowerCase().includes(q)
    );
  });

  // Calculate admin statistics
  const approvedCount = sellers.filter((s) => s.status === 'APPROVED').length;
  const pendingCount = sellers.filter((s) => s.status === 'PENDING').length;
  const rejectedCount = sellers.filter((s) => s.status === 'REJECTED').length;

  // Selected seller stats
  const totalListings = sellerListings.length;
  const activeListings = sellerListings.filter((l) => l.status === 'ACTIVE').length;
  const totalStock = sellerListings.reduce((sum, item) => sum + (item.availableStock || 0), 0);
  const totalValuation = sellerListings.reduce(
    (sum, item) => sum + (item.price || 0) * (item.availableStock || 0),
    0
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Admin Panel Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
              BajriX Marketplace Administration Portal
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white m-0">
              Seller & Inventory Oversight Panel
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Inspect registered marketplace sellers, review KYC compliance statuses, and query individual seller listings directly via the backend Admin REST endpoint:
              <code className="ml-1 bg-slate-800 text-amber-300 px-2 py-0.5 rounded font-mono text-xs">
                GET /api/v1/admin/sellers/&#123;sellerId&#125;/listings
              </code>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                loadSellersList(statusFilter);
                if (selectedSeller) handleSelectSeller(selectedSeller);
              }}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Admin Data</span>
            </button>
          </div>
        </div>

        {/* Global Admin KPI Summary Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/60 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Registered Sellers
            </span>
            <span className="text-2xl font-black text-white mt-0.5 block">{sellers.length}</span>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xs p-3.5 rounded-2xl border border-emerald-500/30">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Approved
            </span>
            <span className="text-2xl font-black text-emerald-300 mt-0.5 block">{approvedCount}</span>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xs p-3.5 rounded-2xl border border-amber-500/30">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Pending KYC
            </span>
            <span className="text-2xl font-black text-amber-300 mt-0.5 block">{pendingCount}</span>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xs p-3.5 rounded-2xl border border-rose-500/30">
            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Rejected
            </span>
            <span className="text-2xl font-black text-rose-300 mt-0.5 block">{rejectedCount}</span>
          </div>
        </div>
      </div>

      {/* Main Master-Detail Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Sellers List Master Panel (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden flex flex-col">
          {/* Header & Filters */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Select Seller</span>
              </h3>
              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                {filteredSellers.length} Sellers
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by seller, city, GST..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
              {['ALL', 'APPROVED', 'PENDING', 'REJECTED'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Sellers List Items */}
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {loadingSellers ? (
              <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
                <span>Loading marketplace sellers...</span>
              </div>
            ) : filteredSellers.length > 0 ? (
              filteredSellers.map((seller) => {
                const isSelected = selectedSeller?.id === seller.id;
                return (
                  <button
                    key={seller.id}
                    type="button"
                    onClick={() => handleSelectSeller(seller)}
                    className={`w-full text-left p-4 transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/80 border-l-4 border-indigo-600 font-medium'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                          {seller.businessName}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                            seller.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : seller.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {seller.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {seller.city}, {seller.state}
                        </span>
                        <span className="flex items-center gap-0.5 font-bold text-amber-600">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {seller.rating ? seller.rating.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'text-indigo-600 translate-x-0.5' : 'text-slate-300'
                      }`}
                    />
                  </button>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs text-slate-500">
                No sellers found matching criteria.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Products Added by Selected Seller (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedSeller ? (
            <>
              {/* Selected Seller Profile Header Card */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                      {selectedSeller.businessName?.charAt(0) || 'S'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-extrabold text-slate-900">
                          {selectedSeller.businessName}
                        </h2>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${
                            selectedSeller.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : selectedSeller.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {selectedSeller.status === 'APPROVED' && <ShieldCheck className="w-3.5 h-3.5" />}
                          {selectedSeller.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                          {selectedSeller.status === 'REJECTED' && <AlertTriangle className="w-3.5 h-3.5" />}
                          {selectedSeller.status}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">
                        Seller UUID: {selectedSeller.id}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="block text-[11px] text-slate-400 font-semibold uppercase">API Endpoint Called</span>
                    <code className="text-indigo-700 font-mono font-bold text-[11px] block mt-0.5">
                      GET /api/v1/admin/sellers/{selectedSeller.id}/listings
                    </code>
                  </div>
                </div>

                {/* Seller Detail Information Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-medium block">Contact Person</span>
                    <span className="font-bold text-slate-900 mt-0.5 block truncate">
                      {sellerDetails?.contactPerson || selectedSeller.contactPerson || 'N/A'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-medium block">Phone Number</span>
                    <span className="font-bold text-slate-900 mt-0.5 block truncate">
                      {sellerDetails?.phone || selectedSeller.phone || 'N/A'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-medium block">City & State</span>
                    <span className="font-bold text-slate-900 mt-0.5 block truncate">
                      {selectedSeller.city}, {selectedSeller.state}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-medium block">GSTIN Number</span>
                    <span className="font-mono font-bold text-slate-900 mt-0.5 block truncate">
                      {sellerDetails?.gstNumber || selectedSeller.gstNumber || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seller Inventory KPI Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Products Added</span>
                  <span className="text-xl font-black text-slate-900 mt-0.5 block">{totalListings}</span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Active Listings</span>
                  <span className="text-xl font-black text-emerald-600 mt-0.5 block">{activeListings}</span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Stock Volume</span>
                  <span className="text-xl font-black text-slate-900 mt-0.5 block">
                    {totalStock.toLocaleString('en-IN')} units
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Stock Valuation</span>
                  <span className="text-xl font-black text-indigo-700 mt-0.5 block">
                    ₹{totalValuation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>

              {/* Products Added By Seller Table */}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Package className="w-4 h-4 text-indigo-600" />
                      <span>Products Added by {selectedSeller.businessName}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Fetched via GET /api/v1/admin/sellers/{selectedSeller.id}/listings
                    </p>
                  </div>

                  <span className="text-xs bg-indigo-50 text-indigo-800 font-bold px-3 py-1 rounded-full border border-indigo-200">
                    {sellerListings.length} {sellerListings.length === 1 ? 'Product' : 'Products'} Listed
                  </span>
                </div>

                {loadingListings ? (
                  <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
                    <span>Fetching seller's products via Admin API...</span>
                  </div>
                ) : sellerListings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                        <tr>
                          <th scope="col" className="px-4 py-3">Product Name & Brand</th>
                          <th scope="col" className="px-4 py-3">Offer Price</th>
                          <th scope="col" className="px-4 py-3">Stock Level</th>
                          <th scope="col" className="px-4 py-3">Min Order (MOQ)</th>
                          <th scope="col" className="px-4 py-3">Status</th>
                          <th scope="col" className="px-4 py-3">Listing ID / Version</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {sellerListings.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                            {/* Product Name & Brand */}
                            <td className="px-4 py-3">
                              <span className="font-extrabold text-slate-900 block text-xs">
                                {item.productName}
                              </span>
                              <span className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <span className="font-semibold text-amber-700">{item.productBrand}</span>
                                <span className="text-slate-300">•</span>
                                <span className="font-mono text-slate-400">Prod ID: {item.productId}</span>
                              </span>
                            </td>

                            {/* Price */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="font-bold text-slate-900 text-sm">
                                ₹{item.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </span>
                            </td>

                            {/* Available Stock */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`font-semibold ${
                                  item.availableStock < 50 ? 'text-amber-600 font-bold' : 'text-slate-800'
                                }`}
                              >
                                {item.availableStock?.toLocaleString('en-IN')} units
                              </span>
                            </td>

                            {/* Min Order Quantity */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="font-medium text-slate-700">
                                {item.minOrderQuantity} units
                              </span>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  item.status === 'ACTIVE'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : item.status === 'INACTIVE'
                                    ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>

                            {/* Listing ID & Version */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="font-mono text-[10px] text-slate-400 truncate max-w-[140px]" title={item.id}>
                                {item.id}
                              </div>
                              <span className="inline-block text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 rounded mt-0.5">
                                v{item.version}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-2">
                    <Package className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700">No products added by this seller yet.</p>
                    <p className="text-[11px] text-slate-500">
                      This seller hasn't published any listings to the marketplace.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">Select a Seller to Inspect Products</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Choose any seller from the list on the left to view their profile details and load their added products via the backend Admin API endpoint.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
