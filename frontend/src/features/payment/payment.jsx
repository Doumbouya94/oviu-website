import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { api, CART_UPDATED_EVENT } from '../../lib/api';

const stripePromise = loadStripe('pk_test_51TjLEt2KWgWqRAq7iZDZySStNGImo9zBJXThCN3TXaGzhYzMaumd3YFYtbVlUhPEHtV8sCprbY2Bioa4FUigFQ9600pZvtxUtX');

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

const CheckoutForm = ({ cart, customerName, email }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [order, setOrder] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage('');

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (paymentIntent?.status !== 'succeeded') {
      setMessage('Payment did not complete. Please try again.');
      setLoading(false);
      return;
    }

    // Stripe confirmed the charge — now persist it server-side as its own
    // record in the `payments` collection (and clear the cart there too).
    try {
      const response = await api.savePayment({
        customerName,
        email,
        paymentIntentId: paymentIntent.id,
      });
      setOrder(response.order);
      window.dispatchEvent(new Event(CART_UPDATED_EVENT));
      setSuccess(true);
    } catch (saveError) {
      // The charge went through on Stripe's side even though saving failed
      // here, so don't tell the customer it failed — that could lead to a
      // double charge if they retry. Surface it clearly instead.
      setMessage(
        `Your payment succeeded, but we couldn't save your order (${saveError.message}). ` +
          `Please contact us with this payment reference: ${paymentIntent.id}.`,
      );
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div style={styles.success}>
        <div style={styles.successIcon}>✓</div>
        <h2 style={styles.successTitle}>Payment Successful!</h2>
        <p style={styles.successSub}>
          {order ? (
            <>Order <strong>{order.orderNumber}</strong> confirmed. You will receive a confirmation shortly.</>
          ) : (
            'Thank you for your order. You will receive a confirmation shortly.'
          )}
        </p>
        <button style={styles.successBtn} onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>Complete your payment</h2>

      {/* Order Summary */}
      {cart && (
        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>
          {cart.items.map((item) => (
            <div key={item.productId} style={styles.summaryRow}>
              <span>{item.name} x{item.quantity}</span>
              <span>{formatMoney(item.lineTotal)}</span>
            </div>
          ))}
          <div style={styles.divider} />
          <div style={styles.summaryRow}>
            <span>Subtotal</span>
            <span>{formatMoney(cart.subtotal)}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Shipping</span>
            <span>{formatMoney(cart.shipping)}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Tax</span>
            <span>{formatMoney(cart.tax)}</span>
          </div>
          <div style={{ ...styles.summaryRow, fontWeight: 700, fontSize: '1rem' }}>
            <span>Total</span>
            <span>{formatMoney(cart.total)}</span>
          </div>
        </div>
      )}

      <PaymentElement />

      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.buttons}>
        <button type="button" style={styles.backBtn} onClick={() => navigate('/cart')}>
          ← Back to Cart
        </button>
        <button type="submit" disabled={!stripe || loading} style={styles.payBtn}>
          {loading ? 'Processing...' : `Pay ${cart ? formatMoney(cart.total) : ''}`}
        </button>
      </div>
    </form>
  );
};

const Payment = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { customerName = '', email = '' } = location.state || {};

  useEffect(() => {
    const init = async () => {
      try {
        const cartData = await api.getCart();
        setCart(cartData);

        if (!cartData.items || cartData.items.length === 0) {
          setError('Your cart is empty.');
          return;
        }

        const { clientSecret: secret } = await api.createPaymentIntent(cartData.total);
        setClientSecret(secret);
      } catch (err) {
        setError(err.message);
      }
    };

    init();
  }, []);

  return (
    <div style={styles.page}>
      {error ? (
        <div style={styles.success}>
          <p style={styles.message}>{error}</p>
          <button style={styles.successBtn} onClick={() => navigate('/cart')}>
            Back to Cart
          </button>
        </div>
      ) : clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm cart={cart} customerName={customerName} email={email} />
        </Elements>
      ) : (
        <p style={{ color: '#555' }}>Loading payment...</p>
      )}
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '2rem',
  },
  form: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  title: { margin: 0, fontSize: '1.4rem', fontWeight: 700 },
  summary: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  summaryTitle: { margin: '0 0 0.5rem', fontSize: '0.95rem', fontWeight: 600, color: '#333' },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: '#555',
  },
  divider: { borderTop: '1px solid #e0e0e0', margin: '0.25rem 0' },
  buttons: { display: 'flex', gap: '0.75rem', marginTop: '0.5rem' },
  backBtn: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
  payBtn: {
    flex: 2,
    padding: '0.75rem',
    backgroundColor: '#635bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
  message: { color: 'red', fontSize: '0.9rem' },
  success: {
    backgroundColor: '#fff',
    padding: '3rem 2rem',
    borderRadius: '12px',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  successIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#22c55e',
    color: '#fff',
    fontSize: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: { margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#111' },
  successSub: { margin: 0, color: '#555', fontSize: '0.95rem' },
  successBtn: {
    marginTop: '0.5rem',
    padding: '0.75rem 2rem',
    backgroundColor: '#635bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default Payment;