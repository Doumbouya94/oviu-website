const express = require("express");
const cors = require("cors");
const db = require("./config/firebase");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/test-firebase", async (_req, res) => {
  try {
    await db.collection("test").add({
      message: "Firebase connected!",
      createdAt: new Date(),
    });

    res.json({
      success: true,
      message: "Firebase is working!",
    });
  } catch (error) {
    console.error("Firebase test error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
app.get("/api/firebase-products", async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


const cart = new Map();
const orders = [];
let nextOrderNumber = 1001;



app.get("/api/products", async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to load products.",
    });
  }

});

app.get("/api/firebase-products", async (_req, res) => {
  try {
    const snapshot = await db.collection("products").get();

    const firebaseProducts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      count: firebaseProducts.length,
      products: firebaseProducts,
    });
  } catch (error) {
    console.error("Firebase products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products from Firebase.",
      error: error.message,
    });
  }
});
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

app.get("/api/cart", (_req, res) => {
  const summary = getCartSummary();

  res.json({
    ...summary,
    total: Number((summary.subtotal + summary.shipping + summary.tax).toFixed(2)),
  });
});

app.post("/api/cart/items", (req, res) => {
  const { productId, quantity = 1 } = req.body || {};
  const product = findProduct(productId);

  if (!product) {
    return res.status(404).json({
      message: "Product not found.",
    });
  }

  const nextQuantity = Math.max(1, Number(quantity) || 1);
  const existing = cart.get(product.id);
  const updatedQuantity = existing
    ? existing.quantity + nextQuantity
    : nextQuantity;

  cart.set(product.id, {
    productId: product.id,
    name: product.name,
    subtitle: product.subtitle,
    price: product.price,
    image: product.image,
    quantity: updatedQuantity,
  });

  res.status(201).json({
    message: "Added to cart.",
    cart: getCartSummary(),
  });
});

app.patch("/api/cart/items/:productId", (req, res) => {
  const productId = Number(req.params.productId);
  const current = cart.get(productId);

  if (!current) {
    return res.status(404).json({
      message: "Cart item not found.",
    });
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
    message: "Cart updated.",
    cart: getCartSummary(),
  });
});

app.delete("/api/cart/items/:productId", (req, res) => {
  cart.delete(Number(req.params.productId));

  res.json({
    message: "Cart item removed.",
    cart: getCartSummary(),
  });
});

app.delete("/api/cart", (_req, res) => {
  cart.clear();

  res.json({
    message: "Cart cleared.",
    cart: getCartSummary(),
  });
});
app.post("/api/orders", (req, res) => {
  const summary = getCartSummary();
  const { customerName = "", email = "" } = req.body || {};

  if (summary.itemCount === 0) {
    return res.status(400).json({
      message: "Your cart is empty.",
    });
  }

  const order = {
    id: nextOrderNumber++,
    orderNumber: `OVIU-${String(Date.now()).slice(-6)}-${String(
      nextOrderNumber - 1
    )}`,
    customerName: String(customerName).trim(),
    email: String(email).trim(),
    items: summary.items,
    subtotal: summary.subtotal,
    shipping: summary.shipping,
    tax: summary.tax,
    total: Number(
      (summary.subtotal + summary.shipping + summary.tax).toFixed(2)
    ),
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  cart.clear();

  res.status(201).json({
    message: "Order placed successfully.",
    order,
    cart: getCartSummary(),
  });
});

app.get("/api/orders/:orderNumber", (req, res) => {
  const order = orders.find(
    (entry) => entry.orderNumber === req.params.orderNumber
  );

  if (!order) {
    return res.status(404).json({
      message: "Order not found.",
    });
  }

  res.json({ order });
});

app.listen(port, () => {
  console.log(`OVIU backend listening on http://localhost:${port}`);
});