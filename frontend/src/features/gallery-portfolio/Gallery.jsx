// const Gallery = () => {
//   return <div>Gallery Working ✓</div>;
// };

// export default Gallery;

import { useState } from "react";
import "./Gallery.css";

const categories = [
  "All",
  "T-Shirts",
  "Hoodies",
  "Tote Bags",
  "Mugs",
  "Stickers",
  "Keychains",
  "3D Prints",
  "Phone Cases",
  "Custom T-Shirts",
];

// Placeholder items — swap src for real product photos when client sends them
const galleryItems = [
  { id: 1,  category: "Hoodies",          label: "Hoodies",          src: "https://placehold.co/600x700/1a1a1a/ffffff?text=Hoodie" },
  { id: 2,  category: "T-Shirts",         label: "T-Shirts",         src: "https://placehold.co/600x700/f5f0e8/1a1a1a?text=T-Shirt" },
  { id: 3,  category: "Tote Bags",        label: "Tote Bags",        src: "https://placehold.co/600x700/d4c4a8/1a1a1a?text=Tote+Bag" },
  { id: 4,  category: "Mugs",             label: "Mugs",             src: "https://placehold.co/600x700/1a1a1a/ffffff?text=Mug" },
  { id: 5,  category: "Stickers",         label: "Stickers",         src: "https://placehold.co/600x700/f5f0e8/1a1a1a?text=Stickers" },
  { id: 6,  category: "Keychains",        label: "Keychains",        src: "https://placehold.co/600x700/1a1a1a/ffffff?text=Keychain" },
  { id: 7,  category: "3D Prints",        label: "3D Prints",        src: "https://placehold.co/600x700/d4c4a8/1a1a1a?text=3D+Print" },
  { id: 8,  category: "Phone Cases",      label: "Phone Cases",      src: "https://placehold.co/600x700/f5f0e8/1a1a1a?text=Phone+Case" },
  { id: 9,  category: "Custom T-Shirts",  label: "Custom T-Shirts",  src: "https://placehold.co/600x700/1a1a1a/ffffff?text=Custom+T-Shirt" },
  { id: 10, category: "T-Shirts",         label: "Oversized Tee",    src: "https://placehold.co/600x700/f5f0e8/1a1a1a?text=Oversized+Tee" },
  { id: 11, category: "Hoodies",          label: "Zip Hoodie",       src: "https://placehold.co/600x700/1a1a1a/ffffff?text=Zip+Hoodie" },
  { id: 12, category: "Mugs",             label: "Custom Mug",       src: "https://placehold.co/600x700/d4c4a8/1a1a1a?text=Custom+Mug" },
  { id: 13, category: "Tote Bags",        label: "Canvas Tote",      src: "https://placehold.co/600x700/1a1a1a/ffffff?text=Canvas+Tote" },
  { id: 14, category: "Phone Cases",      label: "Anime Case",       src: "https://placehold.co/600x700/f5f0e8/1a1a1a?text=Anime+Case" },
  { id: 15, category: "3D Prints",        label: "3D Figure",        src: "https://placehold.co/600x700/d4c4a8/1a1a1a?text=3D+Figure" },
];

const bestCustomerDesigns = [
  { id: 1, productName: "Product Name", author: "Autor", src: "https://placehold.co/400x400/e8dfc9/1a1a1a?text=Customer+Design+1" },
  { id: 2, productName: "Product Name", author: "Autor", src: "https://placehold.co/400x400/d4c4a8/1a1a1a?text=Customer+Design+2" },
  { id: 3, productName: "Product Name", author: "Autor", src: "https://placehold.co/400x400/c9a96e/ffffff?text=Customer+Design+3" },
];

const INITIAL_VISIBLE = 10;

const Gallery = () => {
  const [active, setActive]       = useState("All");
  const [visible, setVisible]     = useState(INITIAL_VISIBLE);
  const [hoveredId, setHoveredId] = useState(null);

  const filtered =
    active === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === active);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const handleFilter = (cat) => {
    setActive(cat);
    setVisible(INITIAL_VISIBLE);
  };

  return (
    <section className="gallery">
      {/* ── Header ── */}
      <div className="gallery__header">
        <h1 className="gallery__title">GALLERY / PORTFOLIO</h1>
        <p className="gallery__desc">
          Explore our <em>latest</em> custom creations. Every piece is made with
          passion, quality, and your unique story.
        </p>
      </div>

      {/* ── Category Filter ── */}
      <div className="gallery__filters">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleFilter(cat)}
            className={`gallery__filter-btn${active === cat ? " gallery__filter-btn--active" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      <div className="gallery__grid">
        {shown.map((item) => (
          <div
            key={item.id}
            className="gallery__card"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Category badge */}
            <span className="gallery__badge">{item.label}</span>

            {/* Image */}
            <img
              src={item.src}
              alt={item.label}
              className="gallery__img"
              loading="lazy"
            />

            {/* Hover overlay */}
            <div className={`gallery__overlay${hoveredId === item.id ? " gallery__overlay--visible" : ""}`}>
              <button className="gallery__view-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Load More ── */}
      {hasMore && (
        <div className="gallery__load-more">
          <button
            className="gallery__load-btn"
            onClick={() => setVisible((v) => v + INITIAL_VISIBLE)}
          >
            LOAD MORE
          </button>
        </div>
      )}

      {/* ── Best Customer Designs ── */}
      <div className="gallery__bcd">
        <div className="gallery__bcd-header">
          <h2 className="gallery__bcd-title">BEST CUSTOMER DESIGNS</h2>
          <p className="gallery__bcd-subtitle">Designed by yourselves</p>
        </div>

        <div className="gallery__bcd-grid">
          {bestCustomerDesigns.map((design) => (
            <div key={design.id} className="gallery__bcd-card">
              <div className="gallery__bcd-img-wrap">
                <img
                  src={design.src}
                  alt={design.productName}
                  className="gallery__bcd-img"
                  loading="lazy"
                />
              </div>
              <div className="gallery__bcd-info">
                <span className="gallery__bcd-product">{design.productName}</span>
                <span className="gallery__bcd-author">{design.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Gallery;