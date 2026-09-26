import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, ShieldCheck, Check, PackageOpen, Layers, Sparkles, Plus } from 'lucide-react';
import { api } from '../api';

export default function BuyerExperience({ onSelectProduct, onOpenCreateProduct, refreshKey }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await api.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    loadCategories();
  }, []);

  // Load products whenever filters change
  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await api.getProducts({
          categoryId: selectedCategory,
          query: searchQuery,
          page: currentPage,
          size: 12,
          sortBy,
          sortDir
        });
        if (isMounted) {
          setProducts(data.content || []);
          setTotalPages(data.totalPages || 0);
          setTotalElements(data.totalElements || 0);
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadProducts();
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, searchQuery, sortBy, sortDir, currentPage, refreshKey]);

  return (
    <div className="space-y-6 pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Direct Multi-Seller Construction Exchange
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white m-0">
            Compare Local Suppliers. <br />
            <span className="text-amber-400">Save on Building Materials.</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            One standard product, multiple local suppliers. Compare live wholesale rates, check available stock, and order directly with MOQ transparency.
          </p>
        </div>
      </div>

      {/* Discovery Filters & Search Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search cement, steel rebars, sand, bricks, brand, SKU..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden transition-all text-slate-900"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selection & Create Product Button */}
          <div className="flex items-center gap-2">
            {onOpenCreateProduct && (
              <button
                type="button"
                onClick={onOpenCreateProduct}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                title="Create Product (POST /api/v1/products)"
              >
                <Plus className="w-4 h-4" />
                <span>Create Product</span>
              </button>
            )}

            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-4 h-4 text-slate-500 shrink-0" />
              <select
                value={`${sortBy}-${sortDir}`}
                onChange={(e) => {
                  const [field, dir] = e.target.value.split('-');
                  setSortBy(field);
                  setSortDir(dir);
                }}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-hidden cursor-pointer"
              >
                <option value="name-asc">Product Name: A to Z</option>
                <option value="name-desc">Product Name: Z to A</option>
                <option value="brand-asc">Brand: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory(null);
              setCurrentPage(0);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === null
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentPage(0);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1">
        <span>
          Showing <span className="font-bold text-slate-900">{products.length}</span> of{' '}
          <span className="font-bold text-slate-900">{totalElements}</span> products
          {selectedCategory && ' in selected category'}
        </span>
        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
          ✓ Only Approved Sellers Included
        </span>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-3">
              <div className="h-44 bg-slate-200 rounded-xl" />
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-5 bg-slate-200 rounded w-3/4" />
              <div className="h-8 bg-slate-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => {
            const hasOfferings = p.activeSellersCount > 0;
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-amber-300 transition-all duration-200 flex flex-col group"
              >
                {/* Product Image */}
                <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {p.category?.name}
                    </span>
                  </div>

                  {hasOfferings && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        {p.activeSellersCount} {p.activeSellersCount === 1 ? 'Seller' : 'Sellers'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                      {p.brand}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mt-0.5 leading-snug">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {p.description}
                    </p>
                  </div>

                  {/* Price & Offer Breakdown */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    {hasOfferings ? (
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                            Available from
                          </span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-slate-900">
                              ₹{p.minPrice?.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-slate-500">/{p.unitOfMeasure}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-medium">
                            Combined Stock
                          </span>
                          <span className="text-xs font-bold text-slate-700">
                            {p.totalAvailableStock?.toLocaleString('en-IN')} {p.unitOfMeasure}s
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2 text-center bg-slate-50 rounded-lg text-xs text-slate-500 font-medium">
                        Temporarily Out of Stock
                      </div>
                    )}

                    {/* Compare Button */}
                    <button
                      type="button"
                      onClick={() => onSelectProduct(p.id)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        hasOfferings
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs hover:shadow-md'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span>Compare Seller Offerings</span>
                      <span className="text-xs opacity-75">→</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-3">
          <PackageOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h4 className="text-base font-bold text-slate-900">No matching products found</h4>
          <p className="text-xs text-slate-500">
            We couldn't find any products matching your search criteria. Try removing filters or searching for another term like "Cement", "Sand", or "TMT".
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory(null);
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            type="button"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer"
          >
            Previous
          </button>
          <span className="text-xs text-slate-600 px-2 font-medium">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
