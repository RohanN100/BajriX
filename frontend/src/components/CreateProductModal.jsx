import React, { useState, useEffect } from 'react';
import { X, Plus, Layers, AlertCircle, Image, Sparkles } from 'lucide-react';
import { api } from '../api';

export default function CreateProductModal({ onClose, onProductCreated, showToast }) {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [sku, setSku] = useState('');
  const [unitOfMeasure, setUnitOfMeasure] = useState('bag');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCategories() {
      setLoadingCategories(true);
      try {
        const data = await api.getCategories();
        setCategories(data || []);
        if (data && data.length > 0) {
          setCategoryId(data[0].id);
        }
      } catch (err) {
        setError('Failed to fetch categories list');
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !brand.trim() || !sku.trim() || !categoryId || !unitOfMeasure.trim()) {
      setError('Please complete all mandatory fields (*)');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      name: name.trim(),
      brand: brand.trim(),
      sku: sku.trim(),
      unitOfMeasure: unitOfMeasure.trim().toLowerCase(),
      description: description.trim(),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
      categoryId: categoryId
    };

    try {
      const createdProduct = await api.createProduct(payload);
      if (showToast) {
        showToast({
          type: 'success',
          title: 'Product Created',
          message: `Successfully created "${createdProduct?.name || name}" in the catalog!`
        });
      }
      if (onProductCreated) {
        onProductCreated(createdProduct);
      }
      onClose();
    } catch (err) {
      const errMsg = err.data?.message || err.message || 'Failed to create product';
      setError(errMsg);
      if (showToast) {
        showToast({
          type: 'error',
          title: 'Creation Failed',
          message: errMsg
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl shadow-xs">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Create Canonical Catalog Product</h3>
              <p className="text-xs text-slate-500">POST /api/v1/products</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {loadingCategories ? (
            <div className="py-8 text-center text-xs text-slate-500">Loading categories dropdown...</div>
          ) : (
            <>
              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Material Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.slug})
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Name & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product Title / Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UltraTech PPC Cement 50 kg"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UltraTech"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* SKU & Unit of Measure */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stock Keeping Unit (SKU) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UTC-PPC-50-NEW"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Unit of Measure (UOM) *
                  </label>
                  <select
                    value={unitOfMeasure}
                    onChange={(e) => setUnitOfMeasure(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden cursor-pointer"
                  >
                    <option value="bag">bag (e.g. Cement, Mortar)</option>
                    <option value="piece">piece (e.g. Bricks, Blocks)</option>
                    <option value="ton">ton (e.g. Steel Rebars, Sand)</option>
                    <option value="kg">kg (e.g. Wire, Nails)</option>
                    <option value="meter">meter (e.g. Pipes, Cables)</option>
                    <option value="sqft">sqft (e.g. Tiles, Sheets)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Description
                </label>
                <textarea
                  rows="2"
                  placeholder="Comprehensive description of material properties, load bearing capacities, ISO certifications..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Image URL
                </label>
                <div className="relative">
                  <Image className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-1504307651254-35680f356dfd"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
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
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Creating Product...' : 'Create Product'}</span>
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
