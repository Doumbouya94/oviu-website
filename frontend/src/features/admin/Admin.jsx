import { useState } from "react";
import "./Admin.css";
import { LayoutDashboard, ShoppingBag, Package, BarChart2 } from "lucide-react";

// Page principale du dashboard admin
// J'utilise un state pour gérer quel onglet est actif
const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="admin">

      {/* Barre latérale avec la navigation */}
      <div className="admin-sidebar">
        <h2 className="admin-logo">OVIU Admin</h2>
        <nav className="admin-nav">
          {/* Chaque bouton change l'onglet actif */}
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
      </div>

      {/* Contenu principal — change selon l'onglet sélectionné */}
      <div className="admin-content">
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "products" && <ProductsTab />}
        {activeTab === "stats" && <StatsTab />}
      </div>

    </div>
  );
};

// Vue d'ensemble — première chose qu'on voit en arrivant sur le dashboard
const DashboardTab = () => (
  <div>
    <h1>Dashboard Overview</h1>
    {/* 4 cartes de statistiques rapides */}
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Orders</h3>
        <p className="stat-number">142</p>
      </div>
      <div className="stat-card">
        <h3>Pending Orders</h3>
        {/* En orange pour attirer l'attention */}
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

// Liste des commandes avec leur statut
// Pour l'instant les données sont fictives, à connecter au backend plus tard
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
          {/* Je boucle sur les commandes pour afficher chaque ligne */}
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.product}</td>
              {/* La classe CSS change selon le statut pour colorer différemment */}
              <td><span className={`status ${order.status}`}>{order.status}</span></td>
              <td>{order.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Gestion des produits avec les opérations de base (CRUD)
// Le bouton delete et edit ne font rien pour l'instant, à connecter plus tard
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
        {/* Bouton pour ajouter un nouveau produit */}
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
              {/* Si le stock est bas (moins de 20) on le met en rouge */}
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

// Statistiques globales — revenus, nouveaux clients, stock faible
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
        {/* 3 produits en stock faible, à surveiller */}
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