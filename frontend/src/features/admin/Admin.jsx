import { useState } from "react";
import "./Admin.css";
import { LayoutDashboard, ShoppingBag, Package, BarChart2, LogOut } from "lucide-react";

// Identifiants admin codés en dur pour l'instant
// À remplacer par une vraie authentification plus tard
const ADMIN_EMAIL = "admin@oviu.ca";
const ADMIN_PASSWORD = "oviu2025";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Si pas connecté, on affiche la page de login
  if (!isLoggedIn) {
    return <LoginPage onLogin={setIsLoggedIn} />;
  }

  return (
    <div className="admin">

      {/* Barre latérale avec la navigation */}
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

        {/* Bouton de déconnexion en bas de la sidebar */}
        <button className="btn-logout" onClick={() => setIsLoggedIn(false)}>
          <LogOut size={16} /> Log Out
        </button>
      </div>

      {/* Contenu principal */}
      <div className="admin-content">
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "products" && <ProductsTab />}
        {activeTab === "stats" && <StatsTab />}
      </div>

    </div>
  );
};

// Page de connexion simple
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    // On vérifie si les identifiants correspondent
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      onLogin(true);
      setError("");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">OVIU Admin</h1>
        <p className="login-subtitle">Sign in to access the dashboard</p>

        {/* Message d'erreur si mauvais identifiants */}
        {error && <p className="login-error">{error}</p>}

        <div className="login-form">
          <div className="login-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@oviu.ca"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn-login" onClick={handleLogin}>
            Sign In
          </button>
        </div>
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
  const products = [
    { id: 1, name: "Custom T-Shirt", category: "Apparel", price: "$30.00", stock: 45 },
    { id: 2, name: "Hoodie", category: "Apparel", price: "$90.00", stock: 20 },
    { id: 3, name: "Tote Bag", category: "Accessories", price: "$25.00", stock: 60 },
    { id: 4, name: "Mug", category: "Accessories", price: "$18.00", stock: 80 },
    { id: 5, name: "3D Accessory", category: "3D Prints", price: "$35.00", stock: 15 },
  ];

  return (
    <div>
      <div className="tab-header">
        <h1>Products</h1>
        <button className="btn-add">+ Add Product</button>
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
          {products.map(product => (
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