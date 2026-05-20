import "./Home.css";

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
          {/* Remplace ce div par <img src={heroImg} alt="OVIU Products" /> quand tu as l'image */}
          <div className="placeholder-image">Hero Image Coming Soon</div>
        </div>
      </section>

    </div>
    );
    }
export default Home;