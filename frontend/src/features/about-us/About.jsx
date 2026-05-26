import "./About.css";
import { useState } from "react";

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

const About = () => {
  const [language, setLanguage] = useState("en");

  const content = {
    en: {
      title: "ABOUT OVIU",
      subtitle: "Your vision. Made real.",

      intro1:
        "OVIU was born from a simple idea: everyone has a story worth wearing.",
      intro2:
        "What started as a small creative project quickly grew into a passion for designing, printing, and bringing custom ideas to life.",
      intro3:
        "We combine high quality apparel with advanced printing techniques to deliver pieces that are unique, durable, and made to stand out.",
      intro4:
        "Whether it's a custom t-shirt for yourself, a brand, an event, or a special gift — we turn your ideas into something real.",

      cards: [
        {
          title: "PREMIUM QUALITY",
          text: "Best materials and long-lasting printing.",
        },
        {
          title: "UNIQUE DESIGNS",
          text: "Custom pieces made for your identity.",
        },
        {
          title: "MADE IN CANADA",
          text: "Designed and printed locally.",
        },
        {
          title: "FAST PRODUCTION",
          text: "Quick turnaround with care.",
        },
        {
          title: "MADE FOR YOU",
          text: "Personalized from start to finish.",
        },
      ],

      missionTitle: "OUR MISSION",
      mission:
        "To empower creativity and give people the freedom to express themselves through custom apparel and unique designs.",

      visionTitle: "OUR VISION",
      vision:
        "To become a leading Canadian brand in custom clothing, known for quality, creativity, and customer satisfaction.",

      button: "JOIN THE MOVEMENT",
    },

    fr: {
      title: "À PROPOS D'OVIU",
      subtitle: "Votre vision. Rendue réelle.",

      intro1:
        "OVIU est née d'une idée simple : chacun possède une histoire qui mérite d'être portée.",
      intro2:
        "Ce qui a commencé comme un petit projet créatif est rapidement devenu une passion pour la conception, l'impression et la création de produits personnalisés.",
      intro3:
        "Nous combinons des vêtements de qualité avec des techniques d'impression avancées pour créer des produits uniques, durables et remarquables.",
      intro4:
        "Que ce soit pour un t-shirt personnalisé, une marque, un événement ou un cadeau spécial — nous transformons vos idées en réalité.",

      cards: [
        {
          title: "QUALITÉ PREMIUM",
          text: "Matériaux solides et impression durable.",
        },
        {
          title: "DESIGNS UNIQUES",
          text: "Créations adaptées à votre identité.",
        },
        {
          title: "FAIT AU CANADA",
          text: "Conçu et imprimé localement.",
        },
        {
          title: "PRODUCTION RAPIDE",
          text: "Délais rapides avec attention.",
        },
        {
          title: "FAIT POUR VOUS",
          text: "Personnalisé du début à la fin.",
        },
      ],

      missionTitle: "NOTRE MISSION",
      mission:
        "Encourager la créativité et donner aux gens la liberté de s'exprimer à travers des vêtements personnalisés et des designs uniques.",

      visionTitle: "NOTRE VISION",
      vision:
        "Devenir une marque canadienne reconnue dans les vêtements personnalisés grâce à la qualité, la créativité et la satisfaction client.",

      button: "REJOIGNEZ LE MOUVEMENT",
    },
  };

  const icons = [
    <FaAward />,
    <FaPaintBrush />,
    <GiMapleLeaf />,
    <FaTruck />,
    <FaHeart />,
  ];

  return (
    <div className="about-page">
      <div className="language-switch">
        <button
          className={language === "en" ? "lang-btn active" : "lang-btn"}
          onClick={() => setLanguage("en")}
        >
          🇨🇦 EN
        </button>

        <button
          className={language === "fr" ? "lang-btn active" : "lang-btn"}
          onClick={() => setLanguage("fr")}
        >
          🇫🇷 FR
        </button>
      </div>

      <div className="hero">
        <div className="left">
          <h1>{content[language].title}</h1>

          <h3>{content[language].subtitle}</h3>

          <p>{content[language].intro1}</p>
          <p>{content[language].intro2}</p>
          <p>{content[language].intro3}</p>
          <p>{content[language].intro4}</p>
        </div>

        <div className="right">
          <img src={aboutHero} alt="OVIU workshop" className="hero-photo" />
        </div>
      </div>

      <div className="cards">
        {content[language].cards.map((card, index) => (
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
          <h2>{content[language].missionTitle}</h2>
          <p>{content[language].mission}</p>

          <h2>{content[language].visionTitle}</h2>
          <p>{content[language].vision}</p>

          <button>{content[language].button}</button>

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