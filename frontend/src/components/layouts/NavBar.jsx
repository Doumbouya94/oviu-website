import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";
import logo from "../../assets/OVIU_Logo.png";
import { api, CART_UPDATED_EVENT } from "../../lib/api";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const loadCartCount = async () => {
      try {
        const cart = await api.getCart();
        setCartCount(cart.itemCount || 0);
      } catch {
        setCartCount(0);
      }
    };

    loadCartCount();

    const handleCartUpdate = () => loadCartCount();
    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdate);

    return () => window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdate);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "About Us", to: "/about" },
    { label: "Products", to: "/products" },
    { label: "Gallery", to: "/gallery" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
      <div className="navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <img src={logo} alt="OVIU logo icon" className="navbar__logo-icon" />
          <span className="navbar__logo-text">OVIU</span>
        </Link>

        {/* Desktop links */}
        <ul className="navbar__links">
          {navLinks.map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                className={`navbar__link${location.pathname === to ? " navbar__link--active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <Link to="/cart" className="navbar__cta navbar__cta--cart">
          <span>Cart</span>
          <span className="navbar__cart-count">{cartCount}</span>
        </Link>

        {/* Hamburger (mobile) */}
        <button
          className={`navbar__hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`navbar__drawer${menuOpen ? " navbar__drawer--open" : ""}`}>
        <ul className="navbar__drawer-links">
          {navLinks.map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                className={`navbar__drawer-link${location.pathname === to ? " navbar__drawer-link--active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/cart"
              className="navbar__cta navbar__cta--mobile navbar__cta--cart"
              onClick={() => setMenuOpen(false)}
            >
              <span>Cart</span>
              <span className="navbar__cart-count">{cartCount}</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;