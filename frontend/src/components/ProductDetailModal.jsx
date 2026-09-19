import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Star, MapPin, Calculator, ShieldCheck, Tag, Info } from 'lucide-react';

export default function ProductDetailModal({ productDetail, onClose }) {
  if (!productDetail) return null;

  const { product, offerings } = productDetail;
  const [targetQuantity, setTargetQuantity] = useState(
    offerings && offerings.length > 0 ? offerings[0].minOrderQuantity : 10
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="bg-amber-100 text-amber-900 text-xs font-semibold px-2.5 py-1 rounded-md">
              {product.category?.name || 'General Material'}
            </span>
            <span className="text-xs font-mono text-slate-500">SKU: {product.sku}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Section: Product Specs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80';
                }}
              />
            </div>

            <div className="md:col-span-2 space-y-3">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  {product.brand}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                  {product.name}
                </h2>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block">Unit of Measure</span>
                  <span className="font-semibold text-slate-800 uppercase">{product.unitOfMeasure}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Available Sellers</span>
                  <span className="font-semibold text-slate-800">{offerings ? offerings.length : 0} Verified Sellers</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Total Combined Stock</span>
                  <span className="font-semibold text-slate-800">
                    {product.totalAvailableStock} {product.unitOfMeasure}s
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Interactive Order Calculator */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500 text-white rounded-lg">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Live Quantity & Total Cost Calculator</h4>
                  <p className="text-xs text-slate-600">
                    Enter required order volume to calculate estimated costs and verify MOQ & stock compliance.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-auto">
                <label htmlFor="req-qty" className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                  Quantity ({product.unitOfMeasure}):
                </label>
                <input
                  id="req-qty"
                  type="number"
                  min="1"
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-28 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section: Seller Offerings Side-by-Side Comparison */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Available Seller Offerings</span>
                <span className="text-xs font-normal text-slate-500">
                  (Only verified APPROVED sellers are listed)
                </span>
              </h3>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                Sorted by Lowest Price
              </span>
            </div>

            {offerings && offerings.length > 0 ? (
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                    <tr>
                      <th scope="col" className="px-4 py-3">Seller & Location</th>
                      <th scope="col" className="px-4 py-3">Unit Price</th>
                      <th scope="col" className="px-4 py-3">Min Order (MOQ)</th>
                      <th scope="col" className="px-4 py-3">Available Stock</th>
                      <th scope="col" className="px-4 py-3">Estimated Total ({targetQuantity} {product.unitOfMeasure})</th>
                      <th scope="col" className="px-4 py-3 text-right">Order Feasibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {offerings.map((offering) => {
                      const meetsMOQ = targetQuantity >= offering.minOrderQuantity;
                      const hasEnoughStock = offering.availableStock >= targetQuantity;
                      const isEligible = meetsMOQ && hasEnoughStock;
                      const calculatedTotal = (offering.price * targetQuantity).toLocaleString('en-IN', {
                        maximumFractionDigits: 2
                      });

                      return (
                        <tr
                          key={offering.listingId}
                          className={`transition-colors ${
                            offering.lowestPrice ? 'bg-amber-50/30' : 'hover:bg-slate-50'
                          }`}
                        >
                          {/* Seller Details */}
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              {offering.sellerName}
                              <ShieldCheck className="w-4 h-4 text-emerald-600" title="Approved Seller" />
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {offering.sellerCity}, {offering.sellerState}
                              </span>
                              <span className="flex items-center gap-0.5 font-medium text-amber-600">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                {offering.sellerRating}
                              </span>
                            </div>
                          </td>

                          {/* Unit Price */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="text-base font-bold text-slate-900">
                                ₹{offering.price.toLocaleString('en-IN')}
                              </span>
                              <span className="text-xs text-slate-500">/{product.unitOfMeasure}</span>
                            </div>
                            {offering.lowestPrice && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                <Tag className="w-2.5 h-2.5" /> Best Price
                              </span>
                            )}
                          </td>

                          {/* Minimum Order Quantity */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="font-medium text-slate-700">
                              {offering.minOrderQuantity} {product.unitOfMeasure}s
                            </span>
                          </td>

                          {/* Stock Level */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`inline-block font-semibold ${
                                offering.availableStock < 50
                                  ? 'text-amber-600'
                                  : 'text-slate-700'
                              }`}
                            >
                              {offering.availableStock.toLocaleString('en-IN')} {product.unitOfMeasure}s
                            </span>
                          </td>

                          {/* Calculated Total Cost */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="text-base font-extrabold text-slate-900">
                              ₹{calculatedTotal}
                            </span>
                          </td>

                          {/* Order Feasibility */}
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            {isEligible ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Ready to Supply
                              </span>
                            ) : !meetsMOQ ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                <AlertCircle className="w-3 h-3 text-amber-600" />
                                Min {offering.minOrderQuantity} req.
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                                <AlertCircle className="w-3 h-3 text-rose-600" />
                                Insufficient stock
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
                <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-700 font-medium">No verified sellers are currently offering this product.</p>
                <p className="text-xs text-slate-500 mt-1">Check back later or explore other catalog materials.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            * Prices and availability are directly maintained by registered independent suppliers.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
