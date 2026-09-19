const BASE_URL = '/api/v1';

async function handleResponse(response) {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText || 'An unexpected error occurred' };
    }
    const error = new Error(errorData.message || 'Request failed');
    error.status = response.status;
    error.data = errorData;
    throw error;
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

export const api = {
  // Buyer APIs
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.categoryId) query.append('categoryId', params.categoryId);
    if (params.query) query.append('query', params.query);
    if (params.page !== undefined) query.append('page', params.page);
    if (params.size !== undefined) query.append('size', params.size);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortDir) query.append('sortDir', params.sortDir);

    const response = await fetch(`${BASE_URL}/products?${query.toString()}`);
    return handleResponse(response);
  },

  async getProductDetails(productId) {
    const response = await fetch(`${BASE_URL}/products/${productId}`);
    return handleResponse(response);
  },

  async getCategories() {
    const response = await fetch(`${BASE_URL}/products/categories`);
    return handleResponse(response);
  },

  // Seller & System APIs
  async getSellers() {
    const response = await fetch(`${BASE_URL}/sellers`);
    return handleResponse(response);
  },

  async getSellerListings(sellerId) {
    const response = await fetch(`${BASE_URL}/seller/listings`, {
      headers: {
        'X-Seller-Id': sellerId
      }
    });
    return handleResponse(response);
  },

  async getUnlistedProducts(sellerId) {
    const response = await fetch(`${BASE_URL}/seller/listings/unlisted-products`, {
      headers: {
        'X-Seller-Id': sellerId
      }
    });
    return handleResponse(response);
  },

  async createListing(sellerId, listingData) {
    const response = await fetch(`${BASE_URL}/seller/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Seller-Id': sellerId
      },
      body: JSON.stringify(listingData)
    });
    return handleResponse(response);
  },

  async updateListing(sellerId, listingId, listingData) {
    const response = await fetch(`${BASE_URL}/seller/listings/${listingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Seller-Id': sellerId
      },
      body: JSON.stringify(listingData)
    });
    return handleResponse(response);
  },

  async deleteListing(sellerId, listingId) {
    const response = await fetch(`${BASE_URL}/seller/listings/${listingId}`, {
      method: 'DELETE',
      headers: {
        'X-Seller-Id': sellerId
      }
    });
    return handleResponse(response);
  }
};
