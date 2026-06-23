import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';
import { api, CART_UPDATED_EVENT } from '../../lib/api';
import { useLang } from '../../context/LanguageContext';
import { t } from "../../translations/translations.js";

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

const Cart = () => {
  const [cart, setCart] = useState({ items: [], subtotal: 0, shipping: 0, tax: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  const { lang } = useLang();
  const c = t.cart;

  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await api.getCart();
      setCart(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeCart = async () => {
      await loadCart();
    };

    void initializeCart();

    const handleCartUpdate = () => loadCart();
    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdate);

    return () => window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdate);
  }, []);

  const updateQuantity = async (productId, quantity) => {
    try {
      await api.updateCartItem(productId, quantity);
      window.dispatchEvent(new Event(CART_UPDATED_EVENT));
      loadCart();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.removeCartItem(productId);
      window.dispatchEvent(new Event(CART_UPDATED_EVENT));
      loadCart();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const clearCart = async () => {
    try {
      await api.clearCart();
      window.dispatchEvent(new Event(CART_UPDATED_EVENT));
      loadCart();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    if (cart.items.length === 0) {
      setMessage(lang === 'en' ? 'Add items to the cart before checking out.' : 'Ajoutez des articles au panier avant de passer la commande.');
      return;
    }

    try {
      setPlacingOrder(true);
      const response = await api.placeOrder(customerName, email);
      setOrderConfirmation(response.order);
      setMessage(response.message);
      setCustomerName('');
      setEmail('');
      window.dispatchEvent(new Event(CART_UPDATED_EVENT));
      await loadCart();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <section className="cart-page">
      <div className="cart-page__header">
        <div>
          <p className="cart-page__eyebrow">{c.eyebrow[lang]}</p>
          <h1>{c.heading[lang]}</h1>
          <p>{c.sub[lang]}</p>
        </div>
        <Link to="/products" className="cart-page__back-link">
          {c.continueShopping[lang]}
        </Link>
      </div>

      {message ? <p className="cart-page__message">{message}</p> : null}

      {orderConfirmation ? (
        <div className="cart-page__confirmation">
          <p className="cart-page__eyebrow">{c.orderPlaced[lang]}</p>
          <h2>{c.thankYou[lang]}</h2>
          <p>
            {c.orderNumber[lang]} <strong>{orderConfirmation.orderNumber}</strong>.
          </p>
          <p>
            {c.totalPaid[lang]} <strong>{formatMoney(orderConfirmation.total)}</strong>
          </p>
          <p>{c.followUp[lang]}</p>
        </div>
      ) : null}

      {loading ? (
        <div className="cart-page__panel">{c.loading[lang]}</div>
      ) : cart.items.length === 0 ? (
        <div className="cart-page__empty">
          <h2>{c.emptyTitle[lang]}</h2>
          <p>{c.emptyDesc[lang]}</p>
          <Link to="/products" className="cart-page__primary-link">
            {c.browse[lang]}
          </Link>
        </div>
      ) : (
        <div className="cart-page__grid">
          <div className="cart-page__items">
            {cart.items.map((item) => (
              <article key={item.productId} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item__image" />
                <div className="cart-item__details">
                  <div>
                    <h2>{item.name}</h2>
                    <p>{item.subtitle}</p>
                  </div>
                  <strong>{formatMoney(item.price)}</strong>
                </div>
                <div className="cart-item__controls">
                  <label>
                    {c.qty[lang]}
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                    />
                  </label>
                  <p>{formatMoney(item.lineTotal)}</p>
                  <button type="button" onClick={() => removeItem(item.productId)}>
                    {c.remove[lang]}
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>{c.summary[lang]}</h2>
            <dl>
              <div>
                <dt>{c.items[lang]}</dt>
                <dd>{cart.itemCount}</dd>
              </div>
              <div>
                <dt>{c.subtotal[lang]}</dt>
                <dd>{formatMoney(cart.subtotal)}</dd>
              </div>
              <div>
                <dt>{c.shipping[lang]}</dt>
                <dd>{formatMoney(cart.shipping)}</dd>
              </div>
              <div>
                <dt>{c.tax[lang]}</dt>
                <dd>{formatMoney(cart.tax)}</dd>
              </div>
              <div className="cart-summary__total">
                <dt>{c.total[lang]}</dt>
                <dd>{formatMoney(cart.total)}</dd>
              </div>
            </dl>
            <form className="cart-summary__checkout-form" onSubmit={placeOrder}>
              <label>
                {c.name[lang]}
                <input
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder={c.namePlaceholder[lang]}
                />
              </label>
              <label>
                {c.email[lang]}
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={c.emailPlaceholder[lang]}
                />
              </label>
              <button
                    type="button"
                    className="cart-summary__checkout"
                    disabled={cart.items.length === 0}
                    onClick={() => window.location.href = '/payment'}
                    >
                    {c.placeOrder[lang]}
              </button>
            </form>
            <button type="button" className="cart-summary__clear" onClick={clearCart}>
              {c.clearCart[lang]}
            </button>
          </aside>
        </div>
      )}
    </section>
  );
};

export default Cart;