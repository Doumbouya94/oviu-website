import "./ProductCatalogPage.css";

const categories = [
  { label: "All Products", icon: "all" },
  { label: "T-Shirts", icon: "shirt" },
  { label: "Hoodies", icon: "hoodie" },
  { label: "Tote Bags", icon: "tote" },
  { label: "Mugs", icon: "mug" },
  { label: "Stickers", icon: "sticker" },
  { label: "Keychains", icon: "keychain" },
  { label: "3D Printed Accessories", icon: "print3d" },
  { label: "Event Designs", icon: "event" },
];

const productTypes = ["T-Shirts", "Hoodies", "Tote Bags", "Mugs", "Accessories"];

const colorDots = [
  "#111111",
  "#F2F2F2",
  "#8C6A4F",
  "#A4A4A4",
  "#B41F1F",
  "#0D3F8F",
  "#2E7A36",
  "#F2BC1B",
];

const products = [
  {
    id: 1,
    name: "Anime T-Shirt",
    subtitle: "Premium Cotton",
    price: "$30.00",
    ratingCount: 124,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Wave Hoodie",
    subtitle: "Premium Fleece",
    price: "$90.00",
    ratingCount: 89,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Good Things Tote",
    subtitle: "Premium Canvas",
    price: "$25.00",
    ratingCount: 56,
    image:
      "https://images.unsplash.com/photo-1614179689702-355944cd0918?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "OVIU Mug",
    subtitle: "Ceramic Mug",
    price: "$18.00",
    ratingCount: 72,
    image:
      "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Vinyl Stickers",
    subtitle: "Waterproof • Durable",
    price: "$4.00",
    ratingCount: 96,
    image:
      "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "OVIU Keychain",
    subtitle: "Custom Keychain",
    price: "$8.00",
    ratingCount: 38,
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    name: "3D Printed Owl",
    subtitle: "PLA Material",
    price: "$15.00",
    ratingCount: 41,
    image:
      "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 8,
    name: "Vintage Tee",
    subtitle: "Premium Cotton",
    price: "$35.00",
    ratingCount: 67,
    image:
      "https://images.unsplash.com/photo-1503341338985-95ca53d5d45c?auto=format&fit=crop&w=800&q=80",
  },
];

const CategoryIcon = ({ type }) => {
  const baseProps = {
    className: "caodu-category-icon-svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (type) {
    case "all":
      return (
        <svg {...baseProps}>
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </svg>
      );
    case "shirt":
      return (
        <svg {...baseProps}>
          <path d="M8 6 12 4l4 2 3 3-2 3-2-1v9H9v-9l-2 1-2-3 3-3Z" />
        </svg>
      );
    case "hoodie":
      return (
        <svg {...baseProps}>
          <path d="M8 9a4 4 0 1 1 8 0" />
          <path d="M6 20v-6l2-4h8l2 4v6" />
          <path d="M10 13h4" />
        </svg>
      );
    case "tote":
      return (
        <svg {...baseProps}>
          <rect x="6" y="8" width="12" height="12" rx="1" />
          <path d="M9 8V7a3 3 0 0 1 6 0v1" />
        </svg>
      );
    case "mug":
      return (
        <svg {...baseProps}>
          <path d="M6 8h10v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8Z" />
          <path d="M16 10h1a2 2 0 1 1 0 4h-1" />
        </svg>
      );
    case "sticker":
      return (
        <svg {...baseProps}>
          <path d="m12 4 2.1 4.3L19 9l-3.5 3.4.8 4.8-4.3-2.3-4.3 2.3.8-4.8L5 9l4.9-.7L12 4Z" />
        </svg>
      );
    case "keychain":
      return (
        <svg {...baseProps}>
          <circle cx="8" cy="8" r="3" />
          <path d="M10.5 10.5 18 18" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      );
    case "print3d":
      return (
        <svg {...baseProps}>
          <path d="M12 3 5 7v10l7 4 7-4V7l-7-4Z" />
          <path d="M5 7l7 4 7-4" />
          <path d="M12 11v10" />
        </svg>
      );
    case "event":
      return (
        <svg {...baseProps}>
          <rect x="5" y="6" width="14" height="13" rx="2" />
          <path d="M8 4v4M16 4v4M5 10h14" />
        </svg>
      );
    default:
      return (
        <svg {...baseProps}>
          <circle cx="12" cy="12" r="7" />
        </svg>
      );
  }
};

const ProductCatalogPage = () => {
  return (
    <section className="caodu-products-page">
      <aside className="caodu-products-sidebar">
        <h3>Categories</h3>
        <ul className="caodu-categories-list">
          {categories.map((category, index) => (
            <li key={category.label} className={index === 0 ? "active" : ""}>
              <button type="button">
                <span className="caodu-category-icon" aria-hidden="true">
                  <CategoryIcon type={category.icon} />
                </span>
                <span>{category.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="caodu-filter-block">
          <h4>Filter By</h4>
          <p>Product Type</p>
          <div className="caodu-checkbox-group">
            {productTypes.map((type) => (
              <label key={type}>
                <input type="checkbox" />
                <span>{type}</span>
              </label>
            ))}
          </div>

          <p>Price Range</p>
          <input type="range" min="0" max="200" defaultValue="190" aria-label="Price range" />
          <div className="caodu-price-range">
            <span>$0</span>
            <span>$200+</span>
          </div>

          <p>Colors</p>
          <div className="caodu-color-dots">
            {colorDots.map((color) => (
              <button
                type="button"
                key={color}
                className="caodu-color-dot"
                style={{ backgroundColor: color }}
                aria-label={`Color ${color}`}
              />
            ))}
          </div>
        </div>
      </aside>

      <div className="caodu-products-content">
        <header className="caodu-products-header">
          <div>
            <h1>All Products</h1>
            <p>High quality custom products made for you.</p>
            <p>Express your identity, memories, and creativity.</p>
          </div>

          <label className="caodu-sort-control">
            <span>Sort by:</span>
            <select defaultValue="Featured">
              <option>Featured</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </label>
        </header>

        <div className="caodu-products-grid">
          {products.map((product) => (
            <article key={product.id} className="caodu-product-card">
              <div className="caodu-product-image-wrap">
                <img src={product.image} alt={product.name} className="caodu-product-image" />
                <button type="button" className="caodu-favorite-btn" aria-label="Add to favorites">
                  ♡
                </button>
              </div>
              <div className="caodu-product-info">
                <h2>{product.name}</h2>
                <p>{product.subtitle}</p>
                <strong>From {product.price}</strong>
                <div className="caodu-rating">
                  <span>★★★★☆</span>
                  <small>({product.ratingCount})</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCatalogPage;
