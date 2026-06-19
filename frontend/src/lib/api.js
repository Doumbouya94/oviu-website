const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const request = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed.');
  }

  return payload;
};

export const api = {
  getProducts: () => request('/api/products'),
  getCart: () => request('/api/cart'),
  addToCart: (productId, quantity = 1) =>
    request('/api/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),
  updateCartItem: (productId, quantity) =>
    request(`/api/cart/items/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    }),
  removeCartItem: (productId) =>
    request(`/api/cart/items/${productId}`, {
      method: 'DELETE',
    }),
  clearCart: () =>
    request('/api/cart', {
      method: 'DELETE',
    }),
  placeOrder: (customerName, email) =>
    request('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ customerName, email }),
    }),
};

export const CART_UPDATED_EVENT = 'oviu-cart-updated';