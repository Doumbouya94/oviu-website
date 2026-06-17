import { useState } from "react";
import { LayoutDashboard, ShoppingBag, Package, BarChart2, LogOut } from "lucide-react";
import "./Admin.css";
import ProductForm from "./Product-Form";

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

// Gestion des produits
const ProductsTab = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([
    { id: 1, name: "Custom T-Shirt", category: "Apparel", price: "$30.00", stock: 45 },
    { id: 2, name: "Hoodie",         category: "Apparel", price: "$90.00", stock: 20 },
    { id: 3, name: "Tote Bag",       category: "Accessories", price: "$25.00", stock: 60 },
    { id: 4, name: "Mug",            category: "Accessories", price: "$18.00", stock: 80 },
    { id: 5, name: "3D Accessory",   category: "3D Prints",   price: "$35.00", stock: 15 },
  ]);

  // Called by ProductForm on successful creation
  const handleProductCreated = (newProduct) => {
    setProducts((prev) => [
      {
        id:       newProduct._id,
        name:     newProduct.name.en,
        category: newProduct.category,
        price:    `$${Number(newProduct.price).toFixed(2)}`,
        stock:    newProduct.variants.reduce((sum, v) => sum + v.stock, 0),
      },
      ...prev,
    ]);
  };

  return (
    <div>
      {/* Modal renders on top of everything when open */}
      {showForm && (
        <ProductForm
          onClose={() => setShowForm(false)}
          onSuccess={(product) => {
            handleProductCreated(product);
            setShowForm(false);
          }}
        />
      )}

      <div className="tab-header">
        <h1>Products</h1>
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
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
              <td className={product.stock < 20 ? "low-stock" : ""}>{product.stock}</td>
              <td>
                <button className="btn-edit">Edit</button>
                <button className="btn-delete">Delete</button>
              </td>
            </tr>
          ))}
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