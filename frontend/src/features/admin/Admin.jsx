import { useEffect, useState } from "react";
import { LayoutDashboard, ShoppingBag, Package, BarChart2, LogOut } from "lucide-react";
import "./Admin.css";
import ProductForm from "./Product-Form";
import { notifyProductsUpdated } from "../../lib/api";

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

// Vue d'ensemble
const DashboardTab = () => (
  <div>
    <h1>Dashboard Overview</h1>
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Orders</h3>
        <p className="stat-number">142</p>
      </div>
      <div className="stat-card">
        <h3>Pending Orders</h3>
        <p className="stat-number pending">23</p>
      </div>
      <div className="stat-card">
        <h3>Completed Orders</h3>
        <p className="stat-number completed">110</p>
      </div>
      <div className="stat-card">
        <h3>Total Revenue</h3>
        <p className="stat-number revenue">$8,540</p>
      </div>
    </div>
  </div>
);

// Liste des commandes
const OrdersTab = () => {
  const orders = [
    { id: "#001", customer: "Jean Tremblay", product: "Custom T-Shirt", status: "pending", total: "$45.00" },
    { id: "#002", customer: "Marie Côté", product: "Hoodie", status: "completed", total: "$90.00" },
    { id: "#003", customer: "Alex Martin", product: "Tote Bag", status: "pending", total: "$25.00" },
    { id: "#004", customer: "Sophie Leblanc", product: "Mug", status: "cancelled", total: "$18.00" },
    { id: "#005", customer: "Lucas Roy", product: "3D Accessory", status: "completed", total: "$35.00" },
  ];

  return (
    <div>
      <h1>Orders</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.product}</td>
              <td><span className={`status ${order.status}`}>{order.status}</span></td>
              <td>{order.total}</td>
            </tr>
          ))}
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
const StatsTab = () => (
  <div>
    <h1>Statistics</h1>
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Monthly Revenue</h3>
        <p className="stat-number revenue">$2,340</p>
      </div>
      <div className="stat-card">
        <h3>New Customers</h3>
        <p className="stat-number">18</p>
      </div>
      <div className="stat-card">
        <h3>Low Stock Items</h3>
        <p className="stat-number pending">3</p>
      </div>
      <div className="stat-card">
        <h3>Total Products</h3>
        <p className="stat-number">24</p>
      </div>
    </div>
  </div>
);

export default Admin;