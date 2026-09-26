import React, { useState, useEffect } from 'react';
import {
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  Package,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Building,
  Zap,
  Search,
  Users,
  Eye,
  Star,
  MapPin
} from 'lucide-react';
import { api } from '../api';
import AddListingModal from './AddListingModal';
import EditListingModal from './EditListingModal';
import SellerDetailModal from './SellerDetailModal';

export default function SellerPortal({ currentSeller, setCurrentSeller, showToast, sellers = [], onOpenCreateProduct }) {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'directory'
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Directory State
  const [directorySellers, setDirectorySellers] = useState([]);
  const [directoryStatusFilter, setDirectoryStatusFilter] = useState('ALL'); // 'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED'
  const [loadingDirectory, setLoadingDirectory] = useState(false);
  const [viewingSellerId, setViewingSellerId] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);

  const loadListings = async () => {
    if (!currentSeller) return;
    setLoading(true);
    try {
      const data = await api.getSellerListings(currentSeller.id);
      setListings(data || []);
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Error loading inventory',
        message: err.data?.message || err.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, [currentSeller]);

  // Load Sellers Directory by Status Filter
  const loadDirectory = async (status) => {
    setLoadingDirectory(true);
    try {
      const filterParam = status === 'ALL' ? undefined : status;
      const data = await api.getSellers(filterParam);
      setDirectorySellers(data || []);
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Failed to load sellers',
        message: err.data?.message || err.message
      });
    } finally {
      setLoadingDirectory(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'directory') {
      loadDirectory(directoryStatusFilter);
    }
  }, [activeTab, directoryStatusFilter]);

  const handleDeleteListing = async (listing) => {
    if (!window.confirm(`Are you sure you want to delist ${listing.productName}?`)) {
      return;
    }

    try {
      await api.deleteListing(currentSeller.id, listing.id);
      showToast({
        type: 'success',
        title: 'Listing Removed',
        message: `${listing.productName} was removed from your catalog.`
      });
      loadListings();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.data?.message || err.message
      });
    }
  };

  // Feature: Simulate Concurrent Conflict (Optimistic locking HTTP 409)
  const handleSimulateConflict = async (listing) => {
    try {
      await api.updateListing(currentSeller.id, listing.id, {
        price: listing.price + 10,
        availableStock: listing.availableStock,
        minOrderQuantity: listing.minOrderQuantity,
        status: listing.status,
        version: (listing.version || 0) + 99 // Stale version mismatch
      });
    } catch (err) {
      if (err.status === 409) {
        showToast({
          type: 'conflict',
          title: 'Optimistic Lock Conflict (HTTP 409)',
          message:
            'Concurrency conflict detected: Listing has been modified by another process. Database rejected stale write to prevent lost update.'
        });
      } else {
        showToast({
          type: 'error',
          title: 'Request Failed',
          message: err.data?.message || err.message
        });
      }
    }
  };

  // Filter listings
  const filteredListings = listings.filter((l) => {
    const matchesSearch =
      l.productName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.productSku.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (l.productBrand && l.productBrand.toLowerCase().includes(searchFilter.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalListings = listings.length;
  const activeListings = listings.filter((l) => l.status === 'ACTIVE').length;
  const lowStockCount = listings.filter((l) => l.availableStock < 50).length;
  const totalInventoryValue = listings.reduce(
    (acc, cur) => acc + (cur.price || 0) * (cur.availableStock || 0),
    0
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Seller Portal Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0">
              <Building className="w-7 h-7" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl font-black text-slate-900 m-0">
                  {currentSeller?.businessName}
                </h2>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    currentSeller?.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : currentSeller?.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {currentSeller?.status === 'APPROVED' && <ShieldCheck className="w-3.5 h-3.5" />}
                  {currentSeller?.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                  {currentSeller?.status === 'REJECTED' && <AlertTriangle className="w-3.5 h-3.5" />}
                  Status: {currentSeller?.status}
                </span>

                {/* Seller Switcher Dropdown */}
                {sellers && sellers.length > 1 && (
                  <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
                    <span className="text-[11px] font-bold text-amber-800">Switch Seller:</span>
                    <select
                      value={currentSeller?.id || ''}
                      onChange={(e) => {
                        const sel = sellers.find((s) => s.id === e.target.value);
                        if (sel && setCurrentSeller) setCurrentSeller(sel);
                      }}
                      className="bg-white border border-amber-300 text-slate-900 text-xs rounded-md px-2 py-0.5 font-bold cursor-pointer focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                    >
                      {sellers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.businessName} ({s.status})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-1">
                Contact: <strong className="text-slate-700">{currentSeller?.contactPerson}</strong> | Phone:{' '}
                <strong className="text-slate-700">{currentSeller?.phone}</strong> | City:{' '}
                <strong className="text-slate-700">{currentSeller?.city}, {currentSeller?.state}</strong> | GSTIN:{' '}
                <strong className="text-slate-700 font-mono">{currentSeller?.gstNumber || 'N/A'}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={loadListings}
              className="p-2.5 text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
              title="Refresh inventory"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {onOpenCreateProduct && (
              <button
                type="button"
                onClick={onOpenCreateProduct}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                title="Create a new canonical product definition in the system catalog"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Create System Product</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              disabled={currentSeller?.status === 'REJECTED'}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Listing to My Catalog</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation & Status Alert */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start">
            <button
              type="button"
              onClick={() => setActiveTab('inventory')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'inventory'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-amber-600" />
              <span>Catalog Inventory ({totalListings})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('directory')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'directory'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Seller Directory & Verification</span>
            </button>
          </div>

          <div className="text-xs text-slate-500">
            {currentSeller?.status === 'APPROVED' && (
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Supplier — Listings live in buyer marketplace
              </span>
            )}
            {currentSeller?.status === 'PENDING' && (
              <span className="text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                KYC Pending — Listings configured here are hidden from buyers until approved
              </span>
            )}
            {currentSeller?.status === 'REJECTED' && (
              <span className="text-rose-800 font-semibold bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 inline-flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Seller Restricted — Re-submit compliance documentation
              </span>
            )}
          </div>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <>
          {/* Inventory KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Catalog Items
              </span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{totalListings}</span>
              <span className="text-[11px] text-slate-400 mt-1 block">Configured SKUs</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Active Listings
              </span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">{activeListings}</span>
              <span className="text-[11px] text-slate-400 mt-1 block">Live for procurement</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Low Stock SKUs
              </span>
              <span className="text-2xl font-black text-amber-600 mt-1 block">{lowStockCount}</span>
              <span className="text-[11px] text-slate-400 mt-1 block">&lt; 50 units remaining</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Stock Value
              </span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                ₹{totalInventoryValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">At current offer prices</span>
            </div>
          </div>

          {/* Listings Table Section */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            {/* Table Filter Toolbar */}
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-50/50">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search your listings by name, brand, SKU..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Status Filter:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-hidden cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
                </select>
              </div>
            </div>

            {/* Table Content */}
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-500">Loading listings...</div>
            ) : filteredListings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider">
                    <tr>
                      <th scope="col" className="px-4 py-3">Product Name & Category</th>
                      <th scope="col" className="px-4 py-3">Offer Price</th>
                      <th scope="col" className="px-4 py-3">Available Stock</th>
                      <th scope="col" className="px-4 py-3">Min Order (MOQ)</th>
                      <th scope="col" className="px-4 py-3">Status</th>
                      <th scope="col" className="px-4 py-3">Version</th>
                      <th scope="col" className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredListings.map((listing) => (
                      <tr key={listing.id} className="hover:bg-slate-50 transition-colors">
                        {/* Product Specs */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                              <img
                                src={listing.imageUrl}
                                alt={listing.productName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src =
                                    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80';
                                }}
                              />
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block text-xs">
                                {listing.productName}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {listing.productBrand} | SKU:{' '}
                                <span className="font-mono">{listing.productSku}</span>
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Offer Price */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-bold text-slate-900">
                            ₹{listing.price?.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-500">/{listing.unitOfMeasure}</span>
                        </td>

                        {/* Stock */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`font-semibold ${
                              listing.availableStock < 50 ? 'text-amber-600' : 'text-slate-800'
                            }`}
                          >
                            {listing.availableStock?.toLocaleString('en-IN')} {listing.unitOfMeasure}s
                          </span>
                        </td>

                        {/* MOQ */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-medium text-slate-700">
                            {listing.minOrderQuantity} {listing.unitOfMeasure}s
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              listing.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : listing.status === 'INACTIVE'
                                ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {listing.status}
                          </span>
                        </td>

                        {/* Version (Optimistic Lock) */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                            title="Database Version column for optimistic locking"
                          >
                            v{listing.version}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 whitespace-nowrap text-right space-x-1.5">
                          <button
                            type="button"
                            onClick={() => handleSimulateConflict(listing)}
                            title="Simulate Concurrent Update Conflict (Tests HTTP 409)"
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            <Zap className="w-3 h-3 inline mr-1" />
                            Simulate Conflict
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingListing(listing)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit pricing and stock"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteListing(listing)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delist product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <Package className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-800">No listings found</p>
                <p className="text-xs text-slate-500">
                  {searchFilter
                    ? 'No listings matched your search query.'
                    : "You haven't listed any products in your catalog yet."}
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Seller Directory Tab */
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Marketplace Sellers Directory</span>
                <span className="text-xs text-slate-500 font-mono font-normal">
                  (GET /api/v1/sellers?status=...)
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Browse registered sellers, inspect KYC statuses, and view individual seller details via REST API
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {['ALL', 'APPROVED', 'PENDING', 'REJECTED'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setDirectoryStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    directoryStatusFilter === st
                      ? st === 'APPROVED'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : st === 'PENDING'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : st === 'REJECTED'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {loadingDirectory ? (
            <div className="py-12 text-center text-xs text-slate-500">Loading sellers list...</div>
          ) : directorySellers.length > 0 ? (
            <div className="overflow-x-auto p-4 pt-0">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-4 py-3">Business Name & ID</th>
                    <th scope="col" className="px-4 py-3">Contact Person</th>
                    <th scope="col" className="px-4 py-3">Location</th>
                    <th scope="col" className="px-4 py-3">Rating</th>
                    <th scope="col" className="px-4 py-3">Verification Status</th>
                    <th scope="col" className="px-4 py-3 text-right">API Inspection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {directorySellers.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 text-xs">{s.businessName}</div>
                        <div className="text-[11px] font-mono text-slate-400 truncate max-w-xs">{s.id}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-medium text-slate-800 text-xs">{s.contactPerson}</span>
                        <span className="text-[11px] text-slate-400 block">{s.email}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs text-slate-700 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {s.city}, {s.state}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-600 text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {s.rating ? s.rating.toFixed(2) : 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            s.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : s.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {s.status === 'APPROVED' && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                          {s.status === 'PENDING' && <Clock className="w-3 h-3 text-amber-600" />}
                          {s.status === 'REJECTED' && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <button
                          type="button"
                          onClick={() => setViewingSellerId(s.id)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-600" />
                          <span>View Profile</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500">
              No sellers found with status: {directoryStatusFilter}
            </div>
          )}
        </div>
      )}

      {/* Add Listing Modal */}
      {isAddModalOpen && (
        <AddListingModal
          sellerId={currentSeller?.id}
          sellers={sellers}
          onSellerChange={setCurrentSeller}
          onClose={() => setIsAddModalOpen(false)}
          onListingCreated={loadListings}
          showToast={showToast}
        />
      )}

      {/* Edit Listing Modal */}
      {editingListing && (
        <EditListingModal
          listing={editingListing}
          sellerId={currentSeller.id}
          onClose={() => setEditingListing(null)}
          onListingUpdated={loadListings}
          showToast={showToast}
        />
      )}

      {/* View Seller Details Modal */}
      {viewingSellerId && (
        <SellerDetailModal
          sellerId={viewingSellerId}
          onClose={() => setViewingSellerId(null)}
        />
      )}
    </div>
  );
}
