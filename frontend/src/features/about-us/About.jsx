import "./About.css";
import { useLang } from "../../context/LanguageContext";
import { t } from "../../translations/translations.js";

import aboutHero from "../../assets/about-hero.png";
import aboutProducts from "../../assets/about-products.png";

import {
  FaAward,
  FaPaintBrush,
  FaTruck,
  FaHeart,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";

import { MdEmail } from "react-icons/md";
import { GiMapleLeaf } from "react-icons/gi";
import Footer from "../../components/layouts/Footer";

const icons = [
  <FaAward />,
  <FaPaintBrush />,
  <GiMapleLeaf />,
  <FaTruck />,
  <FaHeart />,
];

const About = () => {
  const { lang } = useLang();
  const a = t.about;

  return (
    <div className="about-page">

      <div className="hero">
        <div className="left">
          <h1>{a.title[lang]}</h1>
          <h3>{a.subtitle[lang]}</h3>
          <p>{a.intro1[lang]}</p>
          <p>{a.intro2[lang]}</p>
          <p>{a.intro3[lang]}</p>
          <p>{a.intro4[lang]}</p>
        </div>

        <div className="right">
          <img src={aboutHero} alt="OVIU workshop" className="hero-photo" />
        </div>
      </div>

      <div className="cards">
        {a.cards[lang].map((card, index) => (
          <div className="card" key={index}>
            <div className="icon">{icons[index]}</div>
            <h4>{card.title}</h4>
            <p>{card.text}</p>
          </div>
        ))}
      </div>

      <div className="mission">
        <div>
          <img src={aboutProducts} alt="OVIU products" className="product-photo" />
        </div>

        <div>
          <h2>{a.missionTitle[lang]}</h2>
          <p>{a.mission[lang]}</p>

          <h2>{a.visionTitle[lang]}</h2>
          <p>{a.vision[lang]}</p>

          <button>{a.button[lang]}</button>

          <div className="social">
            <FaInstagram />
            <FaTiktok />
            <MdEmail />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;