import { useLang } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import { t } from "../../translations/translations.js";
import "./Footer.css";

const Footer = () => {
  const { lang } = useLang();
  const f = t.footer;

  return (
    <footer className="contact-footer">

      <div className="footer-column">
        <h2>OVIU</h2>
        <p>{f.tagline[lang]}</p>
        <p>{f.desc[lang]}</p>
      </div>

      <div className="footer-column">
        <h3>{f.shop[lang]}</h3>
        <p>{f.allProducts[lang]}</p>
        <p>{f.customOrder[lang]}</p>
        <p>{f.prints3d[lang]}</p>
        <p>{f.giftCards[lang]}</p>
      </div>

      <div className="footer-column">
        <h3>{f.company[lang]}</h3>

        <Link to="/about" style={{ textDecoration: "none", color: "inherit", cursor: "pointer", display: "block", marginBottom: "8px" }}>
          {f.aboutOviu[lang]}
        </Link>

        <Link to="/gallery" style={{ textDecoration: "none", color: "inherit", cursor: "pointer", display: "block", marginBottom: "8px" }}>
          {f.galleryPort[lang]}
        </Link>

        <Link to="/contact" style={{ textDecoration: "none", color: "inherit", cursor: "pointer", display: "block", marginBottom: "8px" }}>
          {f.contactUs[lang]}
        </Link>

        <Link to="/faq" style={{ textDecoration: "none", color: "inherit", cursor: "pointer", display: "block", marginBottom: "8px" }}>
          {f.faqs[lang]}
        </Link>
      </div>

      <div className="footer-column">
        <h3>{f.customOrders[lang]}</h3>
        <p>{f.howItWorks[lang]}</p>
        <p>{f.bulkOrders[lang]}</p>
        <p>{f.designGuide[lang]}</p>
        <p>{f.pricingGuide[lang]}</p>
      </div>

    </footer>
  );
};

export default Footer;