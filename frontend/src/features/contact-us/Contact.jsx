import "./Contact.css";

import {
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";

const Contact = () => {
  return (
    <div id="contact" className="contact-page">
      <div className="contact-container">

        {/* LEFT SIDE */}
        <div className="contact-left">
          <h1>CONTACT US</h1>

          <p className="contact-description">
            Have a question, idea, or custom project in mind?
            <br />
            We'd love to hear from you.
          </p>

          <div className="contact-info-block">
            <div className="contact-icon">✉</div>
            <div>
              <h3>EMAIL US</h3>
              <p>hello@oviu.ca</p>
            </div>
          </div>

          <div className="contact-info-block">
            <div className="contact-icon">☎</div>
            <div>
              <h3>CALL US</h3>
              <p>(514) 123-4567</p>
            </div>
          </div>

          <div className="contact-info-block">
            <div className="contact-icon">⏰</div>
            <div>
              <h3>HOURS</h3>
              <p>Monday – Friday: 9AM – 6PM EST</p>
              <p>Saturday – Sunday: Closed</p>
            </div>
          </div>

          <div className="contact-info-block">
            <div className="contact-icon">📍</div>
            <div>
              <h3>LOCATION</h3>
              <p>Montreal, Quebec, Canada</p>
              <p>Proudly made in Canada</p>
            </div>
          </div>

          <div className="social-section">
            <h3>FOLLOW US</h3>
            <p>
              Stay updated on new drops, custom projects,
              and behind the scenes.
            </p>

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
          <h2>SEND US A MESSAGE</h2>

          <p className="form-description">
            Fill out the form below and we'll get back to you as soon as possible.
          </p>

          <form className="contact-form">

            <div className="row-fields">
              <div className="field-group">
                <label>Your Name</label>
                <input type="text" placeholder="Enter your name" />
              </div>

              <div className="field-group">
                <label>Email</label>
                <input type="email" placeholder="Enter your email" />
              </div>
            </div>

            <div className="field-group">
              <label>Subject</label>
              <input type="text" placeholder="How can we help?" />
            </div>

            <div className="field-group">
              <label>Message</label>
              <textarea
                rows="8"
                placeholder="Tell us more about your idea or project..."
              ></textarea>
            </div>

            <div className="submit-row">
              <button type="submit">SEND MESSAGE</button>

              <p className="reply-text">
                ✓ We typically reply within 24 hours.
              </p>
            </div>

          </form>
        </div>
      </div>


      {/* FOOTER */}
      <footer className="contact-footer">

        <div className="footer-column">
          <h2>oviu</h2>
          <p>Your vision. Made real.</p>
          <p>
            Custom apparel and 3D prints made with passion,
            precision, and creativity.
          </p>
        </div>

        <div className="footer-column">
          <h3>SHOP</h3>
          <p>All Products</p>
          <p>Custom Order</p>
          <p>3D Prints</p>
          <p>Gift Cards</p>
        </div>

        <div className="footer-column">
  <h3>COMPANY</h3>

  <p onClick={() => document
        .getElementById("about")
        ?.scrollIntoView({ behavior: "smooth" })}
    style={{ cursor: "pointer" }}>
    About Oviu </p>

  <p onClick={() => document
        .getElementById("gallery")
        ?.scrollIntoView({ behavior: "smooth" })}
    style={{ cursor: "pointer" }}>
    Gallery / Portfolio
  </p>

  <p onClick={() => document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "smooth" })}
    style={{ cursor: "pointer" }}
  >
    Contact Us
  </p>

  <p>FAQs</p>
</div>



        <div className="footer-column">
          <h3>CUSTOM ORDERS</h3>
          <p>How it works</p>
          <p>Bulk Orders</p>
          <p>Design Guidelines</p>
          <p>Pricing Guide</p>
        </div>

      </footer>
    </div>
  );
};

export default Contact;