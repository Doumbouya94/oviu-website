import "./About.css";
import {
FaAward,
FaPaintBrush,
FaTruck,
FaHeart,
FaInstagram,
FaTiktok
} from "react-icons/fa";

import { MdEmail } from "react-icons/md";

import { GiMapleLeaf } from "react-icons/gi";

import aboutHero from "../../assets/about-hero.png";
import aboutProducts from "../../assets/about-products.png";

const About = () => {
  return (
    <div className="about-page">

      <div className="hero">

        <div className="left">

          <h1>ABOUT OVIU</h1>

          <h3>Your vision. Made real.</h3>

          <p>
            OVIU was born from a simple idea:
            everyone has a story worth wearing.
          </p>

          <p>
            What started as a small creative project
            quickly grew into a passion for designing,
            printing and bringing custom ideas to life.
          </p>

          <p>
            We combine high quality apparel with
            advanced printing techniques to deliver
            unique and durable products.
          </p>

          <p>
            Whether it is a custom t-shirt,
            a brand, an event or a special gift —
            we turn your ideas into something real.
          </p>

        </div>

        <div className="right">

          <img
            src={aboutHero}
            alt="OVIU Hero"
            className="hero-photo"
          />

        </div>

      </div>

      <div className="cards">

<div className="card">
<FaAward className="icon"/>
<h4>PREMIUM QUALITY</h4>
<p>
Best materials and printing.
</p>
</div>

<div className="card">
<FaPaintBrush className="icon"/>
<h4>UNIQUE DESIGNS</h4>
<p>
Designed for your identity.
</p>
</div>

<div className="card">
<GiMapleLeaf className="icon"/>
<h4>MADE IN CANADA</h4>
<p>
Local premium production.
</p>
</div>

<div className="card">
<FaTruck className="icon"/>
<h4>FAST PRODUCTION</h4>
<p>
Quick delivery.
</p>
</div>

<div className="card">
<FaHeart className="icon"/>
<h4>MADE FOR YOU</h4>
<p>
Created specially for you.
</p>
</div>

</div>

      <div className="mission">

        <div className="product">

          <img
            src={aboutProducts}
            alt="Products"
            className="product-photo"
          />

        </div>

        <div>

          <h2>OUR MISSION</h2>

          <p>
            To empower creativity and give people
            the freedom to express themselves
            through custom apparel.
          </p>

          <h2>OUR VISION</h2>

          <p>
            Become a leading Canadian custom
            clothing brand.
          </p>

          <button>

            JOIN THE MOVEMENT

          </button>
          <div className="social">

<FaInstagram />

<FaTiktok />

<MdEmail />

</div>

        </div>

      </div>

    </div>
  );
};

export default About;