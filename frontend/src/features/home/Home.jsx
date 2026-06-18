
import "./Home.css";
import heroImg from "../../assets/photo_acceuil_1.png";
import { Shield, Leaf, Truck } from "lucide-react";
import { useLang } from "../../context/LanguageContext";
import { t } from "../../translations/translations.js";

const Home = () => {
  const { lang } = useLang();
  const h = t.home;

  return (
    <div className="home">

      {/* TOP BANNER */}
      <div className="top-banner">
        {h.banner[lang]}
      </div>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-text">
          <h1>{h.heading1[lang]} <span>{h.heading2[lang]}</span></h1>
          <p>{h.sub1[lang]}</p>
          <p>{h.sub2[lang]}</p>
          <div className="hero-buttons">
            <a href="/order" className="btn-primary">{h.btnOrder[lang]}</a>
            <a href="/products" className="btn-secondary">{h.btnExplore[lang]}</a>
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImg} alt="OVIU Products" className="hero-img" />
        </div>

        {/* TRUST BAR */}
        <div className="trust-bar">
          <div className="trust-item">
            <Shield size={28} strokeWidth={1.5} />
            <div>
              <strong>{h.trustQuality[lang]}</strong>
              <p>{h.trustQualitySub[lang]}</p>
            </div>
          </div>
          <div className="trust-item">
            <Leaf size={28} strokeWidth={1.5} />
            <div>
              <strong>{h.trustCanada[lang]}</strong>
              <p>{h.trustCanadaSub[lang]}</p>
            </div>
          </div>
          <div className="trust-item">
            <Truck size={28} strokeWidth={1.5} />
            <div>
              <strong>{h.trustShipping[lang]}</strong>
              <p>{h.trustShippingSub[lang]}</p>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
};

export default Home;