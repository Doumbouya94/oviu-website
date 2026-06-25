import { useEffect, useState, useCallback, useRef } from "react";
import { LayoutDashboard, ShoppingBag, Package, BarChart2, LogOut } from "lucide-react";
import "./Admin.css";
import ProductForm from "./Product-Form";
import { api, notifyProductsUpdated, onOrdersUpdated, notifyOrdersUpdated } from "../../lib/api";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  // If the user is already logged in (token exists), we set isLoggedIn to true, otherwise false
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("adminToken"));

  if (!isLoggedIn) {
    return <LoginPage onLogin={setIsLoggedIn} />;
  }

  return (
    <div className="admin">
      <div className="admin-sidebar">
        <h2 className="admin-logo">OVIU Admin</h2>
        <nav className="admin-nav">
          <button onClick={() => setActiveTab("dashboard")} className={activeTab === "dashboard" ? "active" : ""}>
            <LayoutDashboard size={16} /> Dashboard
          </button>
          <button onClick={() => setActiveTab("orders")} className={activeTab === "orders" ? "active" : ""}>
            <ShoppingBag size={16} /> Orders
          </button>
          <button onClick={() => setActiveTab("products")} className={activeTab === "products" ? "active" : ""}>
            <Package size={16} /> Products
          </button>
          <button onClick={() => setActiveTab("stats")} className={activeTab === "stats" ? "active" : ""}>
            <BarChart2 size={16} /> Statistics
          </button>
        </nav>

        {/* Close the session and eliminate the token */}
        <button className="btn-logout" onClick={() => {
          localStorage.removeItem("adminToken");
          setIsLoggedIn(false);
        }}>
          <LogOut size={16} /> Log Out
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "products" && <ProductsTab />}
        {activeTab === "stats" && <StatsTab />}
      </div>
    </div>
  );
};

const LoginPage = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials.");
      }

      // Save the token in localStorage
      localStorage.setItem("adminToken", data.data.token);
      onLogin(true);
    } catch (err) {
      setError(err.message || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">OVIU Admin</h1>
        <p className="login-subtitle">Sign in to access the dashboard</p>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="login-field">
            <label>Email or Username</label>
            <input
              type="text"
              placeholder="admin@oviu.ca"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button type="submit" className="btn-login" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

const POLL_INTERVAL_MS = 5000;

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

// Vue d'ensemble — shows today's activity only
const DashboardTab = () => {
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayPending: 0,
    todayCompleted: 0,
    todayCancelled: 0,
    todayRevenue: 0,
  });
  const [loadError, setLoadError] = useState("");

  const loadStats = useCallback(async () => {
    try {
      const data = await api.getOrderStatsToday();
      setStats(data);
      setLoadError("");
    } catch (err) {
      setLoadError(err.message);
    }
  }, []);

  useEffect(() => {
    loadStats();

    // Poll periodically so new orders (placed from the storefront) and
    // status changes (made by another admin) show up without a refresh.
    const interval = setInterval(loadStats, POLL_INTERVAL_MS);
    const unsubscribe = onOrdersUpdated(loadStats);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [loadStats]);

  const today = new Date().toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <h1>Dashboard Overview</h1>
      <p style={{ color: "#888", marginBottom: "1.5rem", fontSize: "0.9rem" }}>{today}</p>
      {loadError && <p className="delete-error">{loadError}</p>}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Today's Orders</h3>
          <p className="stat-number">{stats.todayOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Today's Revenue</h3>
          <p className="stat-number revenue">{formatMoney(stats.todayRevenue)}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Today</h3>
          <p className="stat-number pending">{stats.todayPending}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Today</h3>
          <p className="stat-number completed">{stats.todayCompleted}</p>
        </div>
      </div>
    </div>
  );
};

// Modal: View order detail
const ViewOrderModal = ({ order, onClose }) => {
  if (!order) return null;
  return (
    <div className="pf-overlay" onClick={onClose}>
      <div className="view-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pf-header">
          <div>
            <h2 className="pf-title">{order.orderNumber}</h2>
            <p className="pf-subtitle">
              {order.customerName || "—"} · {order.email || "—"}
            </p>
          </div>
          <button className="pf-close" onClick={onClose}>✕</button>
        </div>
        <div className="view-modal-body">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={`${item.productId}-${i}`}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{formatMoney(item.price)}</td>
                  <td>{formatMoney(item.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <dl style={{ marginTop: "1rem" }}>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatMoney(order.subtotal)}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd>{formatMoney(order.shipping)}</dd>
            </div>
            <div>
              <dt>Tax</dt>
              <dd>{formatMoney(order.tax)}</dd>
            </div>
            <div className="cart-summary__total">
              <dt>Total</dt>
              <dd>{formatMoney(order.total)}</dd>
            </div>
          </dl>

          <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#888" }}>
            Status: <span className={`status ${order.status}`}>{order.status}</span>
            {" · "}
            Placed: {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

// Modal: Confirm delete order
const DeleteOrderModal = ({ order, onConfirm, onCancel, isDeleting }) => {
  if (!order) return null;
  return (
    <div className="pf-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="pf-title">Delete Order</h2>
        <p className="confirm-msg">
          Are you sure you want to delete order <strong>{order.orderNumber}</strong>?
          This action cannot be undone.
        </p>
        <div className="confirm-actions">
          <button className="pf-btn-cancel" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </button>
          <button className="btn-delete-confirm" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Liste des commandes
const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [viewingOrder, setViewingOrder] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState("");
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  // Keep track of whether this is the very first load, so polling refreshes
  // don't flash a "Loading orders..." row over the existing table.
  const hasLoadedOnce = useRef(false);

  const loadOrders = useCallback(async () => {
    if (!hasLoadedOnce.current) setIsLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
      setLoadError("");
    } catch (err) {
      setLoadError(err.message);
    } finally {
      hasLoadedOnce.current = true;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();

    const interval = setInterval(loadOrders, POLL_INTERVAL_MS);
    const unsubscribe = onOrdersUpdated(loadOrders);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [loadOrders]);

  const handleStatusChange = async (order, newStatus) => {
    if (newStatus === order.status) return;
    setUpdatingStatusId(order._id);
    setActionError("");
    try {
      const updated = await api.updateOrderStatus(order._id, newStatus);
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      notifyOrdersUpdated();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingOrder) return;
    setIsDeleting(true);
    setActionError("");
    try {
      await api.deleteOrder(deletingOrder._id);
      setOrders((prev) => prev.filter((o) => o._id !== deletingOrder._id));
      setDeletingOrder(null);
      notifyOrdersUpdated();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {viewingOrder && (
        <ViewOrderModal order={viewingOrder} onClose={() => setViewingOrder(null)} />
      )}

      {deletingOrder && (
        <DeleteOrderModal
          order={deletingOrder}
          onConfirm={handleDeleteConfirm}
          onCancel={() => { setDeletingOrder(null); setActionError(""); }}
          isDeleting={isDeleting}
        />
      )}

      <div className="tab-header">
        <h1>Orders</h1>
        {actionError && <p className="delete-error">{actionError}</p>}
        {loadError && <p className="delete-error">{loadError}</p>}
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Status</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "1.5rem" }}>
                Loading orders...
              </td>
            </tr>
          ) : orders.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "1.5rem" }}>
                No orders yet. They'll show up here as soon as a payment goes through.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderNumber}</td>
                <td>{order.customerName || "—"}</td>
                <td>
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} item
                  {order.items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "" : "s"}
                </td>
                <td>
                  <select
                    className={`status-select status ${order.status}`}
                    value={order.status}
                    disabled={updatingStatusId === order._id}
                    onChange={(e) => handleStatusChange(order, e.target.value)}
                  >
                    <option value="pending">pending</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </td>
                <td>{formatMoney(order.total)}</td>
                <td>
                  <button
                    className="btn-view"
                    onClick={() => setViewingOrder(order)}
                    title="View order details"
                  >
                    View
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => setDeletingOrder(order)}
                    title="Delete order"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Modal: View product images
const ViewProductModal = ({ product, onClose }) => {
  if (!product) return null;
  return (
    <div className="pf-overlay" onClick={onClose}>
      <div className="view-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pf-header">
          <div>
            <h2 className="pf-title">{product.name}</h2>
            <p className="pf-subtitle">{product.category} · {product.price}</p>
          </div>
          <button className="pf-close" onClick={onClose}>✕</button>
        </div>
        <div className="view-modal-body">
          {product.images && product.images.length > 0 ? (
            <div className="view-images-grid">
              {product.images.map((img, i) => (
                <div key={i} className="view-image-wrap">
                  <img
                    src={img.url}
                    alt={img.altText?.en || product.name}
                    className="view-image"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="view-no-images">
              <p>No images uploaded for this product.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Modal: Confirm delete
const DeleteConfirmModal = ({ product, onConfirm, onCancel, isDeleting }) => {
  if (!product) return null;
  return (
    <div className="pf-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="pf-title">Delete Product</h2>
        <p className="confirm-msg">
          Are you sure you want to delete <strong>{product.name}</strong>?
          This will also remove all associated images from Cloudinary. This action cannot be undone.
        </p>
        <div className="confirm-actions">
          <button className="pf-btn-cancel" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </button>
          <button className="btn-delete-confirm" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Gestion des produits
const ProductsTab = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // product raw data for edit
  const [viewingProduct, setViewingProduct] = useState(null); // product for image viewer
  const [deletingProduct, setDeletingProduct] = useState(null); // product pending delete
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Map raw API product → table row
  const toRow = (p) => ({
    id:       p._id,
    name:     p.name?.en ?? p.name,
    category: p.category,
    price:    `$${Number(p.price).toFixed(2)}`,
    stock:    p.variants?.reduce((sum, v) => sum + v.stock, 0) ?? p.stock,
    images:   p.images ?? [],
    _raw:     p, // keep raw data for editing
  });

  // Load existing products from the database when the tab mounts
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      setLoadError("");
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch("http://localhost:5000/api/products", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to load products.");
        }

        const data = await res.json();
        setProducts(data.map(toRow));
      } catch (err) {
        setLoadError(err.message);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const handleProductCreated = (newProduct) => {
    setProducts((prev) => [toRow(newProduct), ...prev]);
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === (updatedProduct._id ?? updatedProduct.id) ? toRow(updatedProduct) : p
      )
    );
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    setDeleteError("");
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`http://localhost:5000/api/products/${deletingProduct.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete product.");
      }
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      setDeletingProduct(null);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* ── Modals ── */}
      {viewingProduct && (
        <ViewProductModal product={viewingProduct} onClose={() => setViewingProduct(null)} />
      )}

      {deletingProduct && (
        <DeleteConfirmModal
          product={deletingProduct}
          onConfirm={handleDeleteConfirm}
          onCancel={() => { setDeletingProduct(null); setDeleteError(""); }}
          isDeleting={isDeleting}
        />
      )}

      {(showForm || editingProduct) && (
        <ProductForm
          product={editingProduct?._raw ?? null}
          onClose={() => { setShowForm(false); setEditingProduct(null); }}
          onSuccess={(product) => {
            if (editingProduct) handleProductUpdated(product);
            else handleProductCreated(product);
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      <div className="tab-header">
        <h1>Products</h1>
        {deleteError && <p className="delete-error">{deleteError}</p>}
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Add Product
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
            {isLoadingProducts ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "1.5rem" }}>
                Loading products...
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "1.5rem" }}>
                No products yet. Click "+ Add Product" to create your first one.
              </td>
            </tr>
          ) : (
            products.map((product) => (
            <tr key={product.id}>
              <td style={{ fontSize: "11px", color: "#aaa" }}>
                {String(product.id).length > 10 ? `…${String(product.id).slice(-6)}` : product.id}
              </td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
              <td className={product.stock < 20 ? "low-stock" : ""}>{product.stock}</td>
              <td>
                <button
                  className="btn-view"
                  onClick={() => setViewingProduct(product)}
                  title="View images"
                >
                  View
                </button>
                <button
                  className="btn-edit"
                  onClick={() => setEditingProduct(product)}
                  title="Edit product"
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => setDeletingProduct(product)}
                  title="Delete product"
                >
                  Delete
                </button>
              </td>
            </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Statistiques globales
const StatsTab = () => {
  const [stats, setStats] = useState({
    monthlyRevenue: 0,
    avgOrderValue: 0,
    totalProducts: 0,
    lowStockItems: 0,
  });
  const [loadError, setLoadError] = useState("");

  const loadStats = useCallback(async () => {
    try {
      const data = await api.getOrderStats();
      setStats(data);
      setLoadError("");
    } catch (err) {
      setLoadError(err.message);
    }
  }, []);

  useEffect(() => {
    loadStats();

    const interval = setInterval(loadStats, POLL_INTERVAL_MS);
    const unsubscribe = onOrdersUpdated(loadStats);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [loadStats]);

  const currentMonth = new Date().toLocaleDateString("en-CA", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <h1>Statistics</h1>
      <p style={{ color: "#888", marginBottom: "1.5rem", fontSize: "0.9rem" }}>{currentMonth}</p>
      {loadError && <p className="delete-error">{loadError}</p>}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Monthly Revenue</h3>
          <p className="stat-number revenue">{formatMoney(stats.monthlyRevenue)}</p>
        </div>
        <div className="stat-card">
          <h3>Avg Order Value</h3>
          <p className="stat-number">{formatMoney(stats.avgOrderValue)}</p>
        </div>
        <div className="stat-card">
          <h3>Low Stock Items</h3>
          <p className="stat-number pending">{stats.lowStockItems}</p>
        </div>
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-number">{stats.totalProducts}</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;