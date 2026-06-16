import { useState } from "react";
import "./FAQ.css";
import printingChart from "../../assets/3D-Printing-Chart.png";
import { useLang } from "../../context/LanguageContext";
import { t } from "../../translations/translations.js";
import Footer from "../../components/layouts/Footer";

const categoryKeys = ["General", "Products", "Orders", "Shipping", "Custom"];

const getFaqData = (lang) => ({
  General: [
    {
      id: "g1",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
      question: {
        en: "What is OVIU?",
        fr: "Qu'est-ce qu'OVIU ?",
      },
      answer: {
        en: "OVIU is a custom merchandise studio specializing in personalized products — from t-shirts and hoodies to mugs, stickers, keychains, and 3D prints. We turn your vision into real, tangible items made with care.",
        fr: "OVIU est un studio de marchandises personnalisées spécialisé dans les produits personnalisés — des t-shirts et sweats aux mugs, autocollants, porte-clés et impressions 3D. Nous transformons votre vision en objets réels et tangibles réalisés avec soin.",
      },
    },
    {
      id: "g2",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      question: {
        en: "Do I need an account to place an order?",
        fr: "Ai-je besoin d'un compte pour passer une commande ?",
      },
      answer: {
        en: "No account needed! You can contact us directly through the Contact page or our social media channels. However, creating an account lets you track orders and save your designs for future purchases.",
        fr: "Aucun compte nécessaire ! Vous pouvez nous contacter directement via la page Contact ou nos réseaux sociaux. Cependant, créer un compte vous permet de suivre vos commandes et de sauvegarder vos designs.",
      },
    },
    {
      id: "g3",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      ),
      question: {
        en: "How do I contact OVIU?",
        fr: "Comment contacter OVIU ?",
      },
      answer: {
        en: "You can reach us through our Contact page, by email, or via our Instagram and WhatsApp. We typically respond within 24 hours on business days.",
        fr: "Vous pouvez nous joindre via notre page Contact, par courriel, ou via Instagram et WhatsApp. Nous répondons généralement dans les 24 heures les jours ouvrables.",
      },
    },
  ],
  Products: [
    {
      id: "p1",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
        </svg>
      ),
      question: {
        en: "What products can I customize?",
        fr: "Quels produits puis-je personnaliser ?",
      },
      answer: {
        en: "We offer customization on t-shirts, hoodies, tote bags, mugs, stickers, keychains, and 3D printed items. Check the Gallery to see examples of each category.",
        fr: "Nous proposons la personnalisation de t-shirts, sweats, tote bags, mugs, autocollants, porte-clés et articles imprimés 3D. Consultez la Galerie pour voir des exemples de chaque catégorie.",
      },
    },
    {
      id: "p2",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
        </svg>
      ),
      question: {
        en: "What printing methods do you use?",
        fr: "Quelles méthodes d'impression utilisez-vous ?",
      },
      answer: {
        en: "We use DTF (Direct to Film), sublimation, and vinyl depending on the product and design. Each method is chosen to maximize durability and color fidelity for your specific item.",
        fr: "Nous utilisons le DTF (Direct to Film), la sublimation et le vinyle selon le produit et le design. Chaque méthode est choisie pour maximiser la durabilité et la fidélité des couleurs.",
      },
    },
    {
      id: "p3",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      question: {
        en: "Are your products durable and wash-safe?",
        fr: "Vos produits sont-ils durables et lavables ?",
      },
      answer: {
        en: "Yes! All our printed products are made to last. We recommend washing inside-out in cold water to extend the life of the print. Full care instructions are included with every order.",
        fr: "Oui ! Tous nos produits imprimés sont conçus pour durer. Nous recommandons de laver à l'envers en eau froide pour prolonger la durée de vie de l'impression. Les instructions d'entretien complètes sont incluses avec chaque commande.",
      },
    },
  ],
  Orders: [
    {
      id: "o1",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      ),
      question: {
        en: "What is the minimum order quantity?",
        fr: "Quelle est la quantité minimale de commande ?",
      },
      answer: {
        en: "For most products, you can order as little as 1 piece. Bulk orders of 10+ units get a discount. Contact us for specific minimums on 3D prints or special items.",
        fr: "Pour la plupart des produits, vous pouvez commander à partir d'1 pièce. Les commandes en gros de 10+ unités bénéficient d'une réduction. Contactez-nous pour les minimums spécifiques aux impressions 3D ou articles spéciaux.",
      },
    },
    {
      id: "o2",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      ),
      question: {
        en: "Can I change or cancel my order?",
        fr: "Puis-je modifier ou annuler ma commande ?",
      },
      answer: {
        en: "Changes and cancellations are accepted within 24 hours of placing the order, before production begins. Once your item is in production, changes are no longer possible.",
        fr: "Les modifications et annulations sont acceptées dans les 24 heures suivant la commande, avant le début de la production. Une fois l'article en production, les modifications ne sont plus possibles.",
      },
    },
    {
      id: "o3",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        </svg>
      ),
      question: {
        en: "Will I receive a proof before production?",
        fr: "Vais-je recevoir une maquette avant la production ?",
      },
      answer: {
        en: "Absolutely. For every custom order, we send a digital mockup for your approval before we start printing. Production only begins once you give the green light.",
        fr: "Absolument. Pour chaque commande personnalisée, nous envoyons une maquette numérique pour votre approbation avant de commencer l'impression. La production ne commence qu'une fois votre accord reçu.",
      },
    },
  ],
  Shipping: [
    {
      id: "s1",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      ),
      question: {
        en: "How long does shipping take?",
        fr: "Combien de temps prend la livraison ?",
      },
      answer: {
        en: "Standard production takes 3–5 business days, plus 2–5 days for shipping depending on your location. Express options are available at checkout for faster turnaround.",
        fr: "La production standard prend 3 à 5 jours ouvrables, plus 2 à 5 jours pour la livraison selon votre emplacement. Des options express sont disponibles au moment du paiement.",
      },
    },
    {
      id: "s2",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      question: {
        en: "Do you ship internationally?",
        fr: "Livrez-vous à l'international ?",
      },
      answer: {
        en: "Yes! We ship worldwide. International shipping times vary by destination (typically 7–15 business days). Customs and import fees are the responsibility of the recipient.",
        fr: "Oui ! Nous livrons partout dans le monde. Les délais de livraison internationale varient selon la destination (généralement 7 à 15 jours ouvrables). Les frais de douane et d'importation sont à la charge du destinataire.",
      },
    },
  ],
  Custom: [
    {
      id: "c1",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      ),
      question: {
        en: "Can I submit my own design?",
        fr: "Puis-je soumettre mon propre design ?",
      },
      answer: {
        en: "Yes! We accept designs in PNG, PDF, SVG, or AI formats. For best results, provide files at 300 DPI or higher. Our team will review your design and advise on any adjustments needed.",
        fr: "Oui ! Nous acceptons les designs en formats PNG, PDF, SVG ou AI. Pour de meilleurs résultats, fournissez des fichiers à 300 DPI ou plus. Notre équipe examinera votre design et vous conseillera sur les ajustements nécessaires.",
      },
    },
    {
      id: "c2",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      ),
      question: {
        en: "What if I don't have a design?",
        fr: "Et si je n'ai pas de design ?",
      },
      answer: {
        en: "No problem! Our in-house design team can create something from scratch based on your brief. Just describe your idea, share references, and we'll handle the rest. Design fees apply.",
        fr: "Pas de problème ! Notre équipe de design interne peut créer quelque chose à partir de zéro selon vos instructions. Décrivez simplement votre idée, partagez des références, et nous nous occupons du reste. Des frais de design s'appliquent.",
      },
    },
    {
      id: "c3",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      question: {
        en: "Do you work with businesses and events?",
        fr: "Travaillez-vous avec des entreprises et des événements ?",
      },
      answer: {
        en: "Absolutely. We handle corporate merch, event giveaways, team uniforms, and brand kits. Reach out via the Contact page for bulk pricing and dedicated project support.",
        fr: "Absolument. Nous gérons les articles promotionnels d'entreprise, les cadeaux événementiels, les uniformes d'équipe et les kits de marque. Contactez-nous via la page Contact pour les tarifs en gros et un support projet dédié.",
      },
    },
    {
      id: "c4",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
      question: {
        en: "How is the price of a 3D print calculated?",
        fr: "Comment est calculé le prix d'une impression 3D ?",
      },
      answerNode: (
        <div className="faq__answer faq__answer--rich">
          <p className="faq__answer-text">
            {lang === "en"
              ? <>3D print pricing is based on <strong>filament used (grams)</strong>, <strong>print time (hours)</strong>, and the <strong>number of colors</strong> — calculated using standard Hydro-Québec power consumption rates.</>
              : <>Le calcul est basé sur le <strong>filament utilisé (grammes)</strong>, le <strong>temps d'impression (heures)</strong> et le <strong>nombre de couleurs</strong> — calculé selon les tarifs standard de consommation électrique d'Hydro-Québec.</>
            }
          </p>
          <div className="faq__formula-box">
            <p className="faq__formula-label">
              {lang === "en" ? "Quick Formula" : "Formule rapide"}
            </p>
            <p className="faq__formula">Price ≈ (grams × 0.03) + (hours × 8) + 5</p>
            <p className="faq__formula-note">
              {lang === "en"
                ? <>Includes: filament, machine wear, power &amp; labor. Add <strong>$5–$20</strong> if design work is required.</>
                : <>Inclut : filament, usure machine, électricité et main-d'œuvre. Ajouter <strong>5–20 $</strong> si du travail de design est requis.</>
              }
            </p>
          </div>
          <p className="faq__chart-label">
            {lang === "en" ? "Reference pricing chart:" : "Tableau de référence des prix :"}
          </p>
          <img
            src={printingChart}
            alt="3D Printing Price Chart — filament vs print time"
            className="faq__chart-img"
          />
        </div>
      ),
    },
  ],
});

const FAQ = () => {
  const { lang } = useLang();
  const [activeTab, setActiveTab] = useState("General");
  const [openId, setOpenId] = useState("g1");

  const faqData = getFaqData(lang);
  const items = faqData[activeTab] || [];
  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));
  const f = t.faq;

  return (
    <section className="faq">
      {/* Header */}
      <div className="faq__header">
        <h1 className="faq__title">{f.title[lang]}</h1>
        <p className="faq__subtitle">
          {f.subtitle[lang]}{" "}
          <br />
          {f.cant[lang]}{" "}
          <a href="/contact" className="faq__link">{f.chat[lang]}</a>!
        </p>
      </div>

      {/* Tabs */}
      <div className="faq__tabs">
        {categoryKeys.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveTab(cat); setOpenId(null); }}
            className={`faq__tab${activeTab === cat ? " faq__tab--active" : ""}`}
          >
            {f.tabs[cat][lang]}
          </button>
        ))}
      </div>

      {/* Accordion */}
      <div className="faq__list">
        {items.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className={`faq__item${isOpen ? " faq__item--open" : ""}`}>
              <button
                className="faq__question"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
              >
                <span className="faq__icon">{item.icon}</span>
                <span className="faq__question-text">{item.question[lang]}</span>
                <span className={`faq__chevron${isOpen ? " faq__chevron--up" : ""}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </span>
              </button>

              <div
                className="faq__answer-wrapper"
                style={{ maxHeight: isOpen ? "800px" : "0" }}
              >
                {item.answerNode
                  ? item.answerNode
                  : <p className="faq__answer">{item.answer[lang]}</p>
                }
              </div>
            </div>
          );
        })}
      </div>

      <Footer />
    </section>
  );
};

export default FAQ;