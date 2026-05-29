const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

const products = [
  {
    id: 1,
    name: 'Anime T-Shirt',
    subtitle: 'Premium Cotton',
    price: 30,
    ratingCount: 124,
    type: 'T-Shirts',
    colors: ['#111111', '#F2F2F2', '#B41F1F'],
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Wave Hoodie',
    subtitle: 'Premium Fleece',
    price: 90,
    ratingCount: 89,
    type: 'Hoodies',
    colors: ['#111111', '#A4A4A4', '#0D3F8F'],
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Good Things Tote',
    subtitle: 'Premium Canvas',
    price: 25,
    ratingCount: 56,
    type: 'Tote Bags',
    colors: ['#8C6A4F', '#F2BC1B', '#2E7A36'],
    image:
      'https://images.unsplash.com/photo-1614179689702-355944cd0918?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'OVIU Mug',
    subtitle: 'Ceramic Mug',
    price: 18,
    ratingCount: 72,
    type: 'Mugs',
    colors: ['#111111', '#F2F2F2', '#A4A4A4'],
    image:
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    name: 'Vinyl Stickers',
    subtitle: 'Waterproof • Durable',
    price: 4,
    ratingCount: 96,
    type: 'Accessories',
    colors: ['#111111', '#F2BC1B', '#B41F1F'],
    image:
      'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    name: 'OVIU Keychain',
    subtitle: 'Custom Keychain',
    price: 8,
    ratingCount: 38,
    type: 'Accessories',
    colors: ['#111111', '#A4A4A4', '#0D3F8F'],
    image:
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 7,
    name: '3D Printed Owl',
    subtitle: 'PLA Material',
    price: 15,
    ratingCount: 41,
    type: '3D Printed Accessories',
    colors: ['#111111', '#2E7A36', '#F2BC1B'],
    image:
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 8,
    name: 'Vintage Tee',
    subtitle: 'Premium Cotton',
    price: 35,
    ratingCount: 67,
    type: 'T-Shirts',
    colors: ['#8C6A4F', '#B41F1F', '#F2F2F2'],
    image:
      'https://images.unsplash.com/photo-1503341338985-95ca53d5d45c?auto=format&fit=crop&w=800&q=80',
  },
];

const cart = new Map();
const orders = [];
let nextOrderNumber = 1001;

app.use(cors());
app.use(express.json());

const findProduct = (productId) => products.find((product) => product.id === Number(productId));

const getCartItems = () =>
  Array.from(cart.values()).map((entry) => ({
    ...entry,
    lineTotal: Number((entry.quantity * entry.price).toFixed(2)),
  }));

const getCartSummary = () => {
  const items = getCartItems();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    items,
    itemCount,
    subtotal: Number(subtotal.toFixed(2)),
    shipping: itemCount > 0 ? 6 : 0,
    tax: Number((subtotal * 0.08).toFixed(2)),
  };
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/products', (_req, res) => {
  res.json({ products });
});

app.get('/api/cart', (_req, res) => {
  const summary = getCartSummary();
  res.json({
    ...summary,
    total: Number((summary.subtotal + summary.shipping + summary.tax).toFixed(2)),
  });
});

app.post('/api/cart/items', (req, res) => {
  const { productId, quantity = 1 } = req.body || {};
  const product = findProduct(productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  const nextQuantity = Math.max(1, Number(quantity) || 1);
  const existing = cart.get(product.id);
  const updatedQuantity = existing ? existing.quantity + nextQuantity : nextQuantity;

  cart.set(product.id, {
    productId: product.id,
    name: product.name,
    subtitle: product.subtitle,
    price: product.price,
    image: product.image,
    quantity: updatedQuantity,
  });

  res.status(201).json({
    message: 'Added to cart.',
    cart: getCartSummary(),
  });
});

app.patch('/api/cart/items/:productId', (req, res) => {
  const productId = Number(req.params.productId);
  const current = cart.get(productId);

  if (!current) {
    return res.status(404).json({ message: 'Cart item not found.' });
  }

  const quantity = Number(req.body?.quantity);

  if (!Number.isFinite(quantity) || quantity < 1) {
    cart.delete(productId);
  } else {
    cart.set(productId, {
      ...current,
      quantity,
    });
  }

  res.json({
    message: 'Cart updated.',
    cart: getCartSummary(),
  });
});

app.delete('/api/cart/items/:productId', (req, res) => {
  cart.delete(Number(req.params.productId));

  res.json({
    message: 'Cart item removed.',
    cart: getCartSummary(),
  });
});

app.delete('/api/cart', (_req, res) => {
  cart.clear();

  res.json({
    message: 'Cart cleared.',
    cart: getCartSummary(),
  });
});

app.post('/api/orders', (req, res) => {
  const summary = getCartSummary();
  const { customerName = '', email = '' } = req.body || {};

  if (summary.itemCount === 0) {
    return res.status(400).json({ message: 'Your cart is empty.' });
  }

  const order = {
    id: nextOrderNumber++,
    orderNumber: `OVIU-${String(Date.now()).slice(-6)}-${String(nextOrderNumber - 1)}`,
    customerName: String(customerName).trim(),
    email: String(email).trim(),
    items: summary.items,
    subtotal: summary.subtotal,
    shipping: summary.shipping,
    tax: summary.tax,
    total: Number((summary.subtotal + summary.shipping + summary.tax).toFixed(2)),
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  cart.clear();

  res.status(201).json({
    message: 'Order placed successfully.',
    order,
    cart: getCartSummary(),
  });
});

app.get('/api/orders/:orderNumber', (req, res) => {
  const order = orders.find((entry) => entry.orderNumber === req.params.orderNumber);

  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  res.json({ order });
});

app.listen(port, () => {
  console.log(`OVIU backend listening on http://localhost:${port}`);
});