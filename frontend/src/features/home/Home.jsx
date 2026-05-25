import "./Home.css";
import heroImg from "../../assets/photo_acceuil_1.png";
import { Shield, Leaf, Truck } from "lucide-react";

const Home = () => {
  return (
    <div className="home">

      {/* TOP BANNER */}
      <div className="top-banner">
        Proudly Canadian 🇨🇦
      </div>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-text">
          <h1>Turn Your Ideas Into <span>Meaningful Products.</span></h1>
          <p>Custom Apparel • 3D Prints • Creative Gifts</p>
          <p>Made in Canada 🇨🇦</p>
          <div className="hero-buttons">
            <a href="/order" className="btn-primary">START YOUR CUSTOM ORDER</a>
            <a href="/products" className="btn-secondary">EXPLORE PRODUCTS</a>
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
              <strong>Premium Quality</strong>
              <p>Made to last.</p>
            </div>
          </div>
          <div className="trust-item">
            <Leaf size={28} strokeWidth={1.5} />
            <div>
              <strong>Made in Canada</strong>
              <p>Proudly local.</p>
            </div>
          </div>
          <div className="trust-item">
            <Truck size={28} strokeWidth={1.5} />
            <div>
              <strong>Fast Shipping</strong>
              <p>On orders $99+</p>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
};

export default Home;