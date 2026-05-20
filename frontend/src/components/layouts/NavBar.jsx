import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";
import logo from "../../assets/OVIU_Logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

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
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Link to="/order" className="navbar__cta">
          Order
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
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/order" className="navbar__cta navbar__cta--mobile">
              Order
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;