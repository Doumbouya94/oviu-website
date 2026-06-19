const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const request = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload;
};

export const api = {
  getProducts: () => request("/api/products"),
  getCart: () => request("/api/cart"),
  addToCart: (productId, quantity = 1) =>
    request("/api/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    }),
  updateCartItem: (productId, quantity) =>
    request(`/api/cart/items/${productId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    }),
  removeCartItem: (productId) =>
    request(`/api/cart/items/${productId}`, {
      method: "DELETE",
    }),
  clearCart: () =>
    request("/api/cart", {
      method: "DELETE",
    }),
  placeOrder: (customerName, email) =>
    request("/api/orders", {
      method: "POST",
      body: JSON.stringify({ customerName, email }),
    }),
};

export const CART_UPDATED_EVENT = "oviu-cart-updated";

// ---------------------------------------------------------------------------
// Products sync: lets the admin panel tell any open catalog page to refetch
// after a create/update/delete, without a full page reload.
//
// - window CustomEvent covers the case where Admin and the catalog are
//   rendered in the same browser tab (same SPA instance).
// - BroadcastChannel covers the case where the admin panel is open in one
//   browser tab and the storefront is open in another tab/window of the
//   same browser (BroadcastChannel only works same-origin, same-browser).
// Together they cover same-tab and same-browser-different-tab scenarios.
// Cross-device sync (e.g. admin on one computer, customer on another) isn't
// possible without a server push (WebSocket/SSE), so the catalog page also
// re-fetches quietly on window focus as a fallback.
// ---------------------------------------------------------------------------
export const PRODUCTS_UPDATED_EVENT = "oviu-products-updated";

const productsChannel =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? new BroadcastChannel("oviu-products")
    : null;

export const notifyProductsUpdated = () => {
  window.dispatchEvent(new Event(PRODUCTS_UPDATED_EVENT));
  productsChannel?.postMessage("updated");
};

// Subscribe to product-updated notifications. Returns an unsubscribe function.
export const onProductsUpdated = (callback) => {
  const handler = () => callback();

  window.addEventListener(PRODUCTS_UPDATED_EVENT, handler);
  productsChannel?.addEventListener("message", handler);

  return () => {
    window.removeEventListener(PRODUCTS_UPDATED_EVENT, handler);
    productsChannel?.removeEventListener("message", handler);
  };
};
