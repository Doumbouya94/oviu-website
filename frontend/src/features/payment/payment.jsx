import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51TjLEt2KWgWqRAq7iZDZySStNGImo9zBJXThCN3TXaGzhYzMaumd3YFYtbVlUhPEHtV8sCprbY2Bioa4FUigFQ9600pZvtxUtX');

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

const CheckoutForm = ({ cart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div style={styles.success}>
        <div style={styles.successIcon}>✓</div>
        <h2 style={styles.successTitle}>Payment Successful!</h2>
        <p style={styles.successSub}>Thank you for your order. You will receive a confirmation shortly.</p>
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

  useEffect(() => {
    // Fetch real cart total first
    fetch('http://localhost:3001/api/cart')
      .then((res) => res.json())
      .then((cartData) => {
        setCart(cartData);
        // Use real cart total for Stripe
        return fetch('http://localhost:3001/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: cartData.total, currency: 'usd' }),
        });
      })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  return (
    <div style={styles.page}>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm cart={cart} />
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