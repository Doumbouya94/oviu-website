import "./Contact.css";
import { useLang } from "../../context/LanguageContext";
import { t } from "../../translations/translations.js";
import Footer from "../../components/layouts/Footer";

import {
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";

const Contact = () => {
  const { lang } = useLang();
  const c = t.contact;

  return (
    <div id="contact" className="contact-page">
      <div className="contact-container">

        {/* LEFT SIDE */}
        <div className="contact-left">
          <h1>{c.title[lang]}</h1>

          <p className="contact-description">{c.desc[lang]}</p>

          <div className="contact-info-block">
            <div className="contact-icon">✉</div>
            <div>
              <h3>{c.emailTitle[lang]}</h3>
              <p>hello@oviu.ca</p>
            </div>
          </div>

          <div className="contact-info-block">
            <div className="contact-icon">☎</div>
            <div>
              <h3>{c.phoneTitle[lang]}</h3>
              <p>(514) 123-4567</p>
            </div>
          </div>

          <div className="contact-info-block">
            <div className="contact-icon">⏰</div>
            <div>
              <h3>{c.hoursTitle[lang]}</h3>
              <p>{c.hours1[lang]}</p>
              <p>{c.hours2[lang]}</p>
            </div>
          </div>

          <div className="contact-info-block">
            <div className="contact-icon">📍</div>
            <div>
              <h3>{c.locationTitle[lang]}</h3>
              <p>{c.location1[lang]}</p>
              <p>{c.location2[lang]}</p>
            </div>
          </div>

          <div className="social-section">
            <h3>{c.followTitle[lang]}</h3>
            <p>{c.followDesc[lang]}</p>

            <div className="social-icons">
              <a
                href="https://www.instagram.com/oviu.prints?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=61585829897565&ref=PROFILE_EDIT_xav_ig_profile_page_web#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="contact-right">
          <h2>{c.formTitle[lang]}</h2>

          <p className="form-description">{c.formDesc[lang]}</p>

          <form className="contact-form">

            <div className="row-fields">
              <div className="field-group">
                <label>{c.labelName[lang]}</label>
                <input type="text" placeholder={c.placeholderName[lang]} />
              </div>

              <div className="field-group">
                <label>{c.labelEmail[lang]}</label>
                <input type="email" placeholder={c.placeholderEmail[lang]} />
              </div>
            </div>

            <div className="field-group">
              <label>{c.labelSubject[lang]}</label>
              <input type="text" placeholder={c.placeholderSubject[lang]} />
            </div>

            <div className="field-group">
              <label>{c.labelMessage[lang]}</label>
              <textarea
                rows="8"
                placeholder={c.placeholderMessage[lang]}
              ></textarea>
            </div>

            <div className="submit-row">
              <button type="submit">{c.submit[lang]}</button>
              <p className="reply-text">{c.replyTime[lang]}</p>
            </div>

          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;