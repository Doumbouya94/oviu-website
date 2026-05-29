import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';
import { api, CART_UPDATED_EVENT } from '../../lib/api';

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

const Cart = () => {
  const [cart, setCart] = useState({ items: [], subtotal: 0, shipping: 0, tax: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [orderConfirmation, setOrderConfirmation] = useState(null);

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
      setMessage('Cart updated.');
      window.dispatchEvent(new Event(CART_UPDATED_EVENT));
      loadCart();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.removeCartItem(productId);
      setMessage('Item removed.');
      window.dispatchEvent(new Event(CART_UPDATED_EVENT));
      loadCart();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const clearCart = async () => {
    try {
      await api.clearCart();
      setMessage('Cart cleared.');
      window.dispatchEvent(new Event(CART_UPDATED_EVENT));
      loadCart();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    if (cart.items.length === 0) {
      setMessage('Add items to the cart before checking out.');
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
          <p className="cart-page__eyebrow">Cart</p>
          <h1>Your order summary</h1>
          <p>Review items, update quantities, and prepare for checkout.</p>
        </div>
        <Link to="/products" className="cart-page__back-link">
          Continue shopping
        </Link>
      </div>

      {message ? <p className="cart-page__message">{message}</p> : null}

      {orderConfirmation ? (
        <div className="cart-page__confirmation">
          <p className="cart-page__eyebrow">Order placed</p>
          <h2>Thank you for your order</h2>
          <p>
            Your order number is <strong>{orderConfirmation.orderNumber}</strong>.
          </p>
          <p>
            Total paid: <strong>{formatMoney(orderConfirmation.total)}</strong>
          </p>
          <p>We’ll prepare the items and follow up using the email on file.</p>
        </div>
      ) : null}

      {loading ? (
        <div className="cart-page__panel">Loading cart...</div>
      ) : cart.items.length === 0 ? (
        <div className="cart-page__empty">
          <h2>Your cart is empty</h2>
          <p>Add a product from the catalog to start building your order.</p>
          <Link to="/products" className="cart-page__primary-link">
            Browse products
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
                    Qty
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                    />
                  </label>
                  <p>{formatMoney(item.lineTotal)}</p>
                  <button type="button" onClick={() => removeItem(item.productId)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Summary</h2>
            <dl>
              <div>
                <dt>Items</dt>
                <dd>{cart.itemCount}</dd>
              </div>
              <div>
                <dt>Subtotal</dt>
                <dd>{formatMoney(cart.subtotal)}</dd>
              </div>
              <div>
                <dt>Shipping</dt>
                <dd>{formatMoney(cart.shipping)}</dd>
              </div>
              <div>
                <dt>Tax</dt>
                <dd>{formatMoney(cart.tax)}</dd>
              </div>
              <div className="cart-summary__total">
                <dt>Total</dt>
                <dd>{formatMoney(cart.total)}</dd>
              </div>
            </dl>
            <form className="cart-summary__checkout-form" onSubmit={placeOrder}>
              <label>
                Name
                <input
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Your name"
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <button type="submit" className="cart-summary__checkout" disabled={placingOrder || cart.items.length === 0}>
                {placingOrder ? 'Placing order...' : 'Place order'}
              </button>
            </form>
            <button type="button" className="cart-summary__clear" onClick={clearCart}>
              Clear cart
            </button>
          </aside>
        </div>
      )}
    </section>
  );
};

export default Cart;