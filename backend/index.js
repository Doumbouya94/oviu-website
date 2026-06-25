import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "./config/db.js";
import { login } from "./controllers/authController.js";
import ProductRoutes from "./routes/productRoutes.js";
import OrderRoutes from "./routes/orderRoutes.js";
import Product from "./models/Products.js";
import Payment from "./models/Payment.js";
import Order from "./models/Order.js";

connectDB();

const app = express();
const port = process.env.PORT || 3001;

// NOTE: the old hardcoded mock `products` array (8 demo items with numeric
// ids 1-8) was removed. The cart now looks products up directly in MongoDB
// via the Product model, so it works with whatever you create in the Admin
// panel (real products have a Mongo _id string, not a numeric id).

const cart = new Map();

app.use(cors());
app.use(express.json());

// Authentication routes
app.post("/api/auth/login", login);

// Product routes
app.use("/api/products", ProductRoutes);

// Order routes (admin: list/view/update status/delete + stats)
app.use("/api/orders", OrderRoutes);

// Looks up a real product in MongoDB by its _id. Returns null (instead of
// throwing) when the id isn't a valid ObjectId, e.g. "1", "abc", etc.
const findProduct = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) return null;
  return Product.findById(productId);
};

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

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// app.get("/api/products", (_req, res) => {
//   res.json({ products });
// });

app.get("/api/cart", (_req, res) => {
  const summary = getCartSummary();
  res.json({
    ...summary,
    total: Number(
      (summary.subtotal + summary.shipping + summary.tax).toFixed(2),
    ),
  });
});

app.post("/api/cart/items", async (req, res) => {
  const { productId, quantity = 1 } = req.body || {};

  const product = await findProduct(productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }

  const nextQuantity = Math.max(1, Number(quantity) || 1);
  const existing = cart.get(productId);
  const updatedQuantity = existing
    ? existing.quantity + nextQuantity
    : nextQuantity;

  cart.set(productId, {
    productId,
    name: product.name?.en ?? product.name,
    subtitle: product.category,
    price: product.price,
    image: product.images?.[0]?.url ?? "",
    quantity: updatedQuantity,
  });

  res.status(201).json({
    message: "Added to cart.",
    cart: getCartSummary(),
  });
});

app.patch("/api/cart/items/:productId", (req, res) => {
  const { productId } = req.params;
  const current = cart.get(productId);

  if (!current) {
    return res.status(404).json({ message: "Cart item not found." });
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
  cart.delete(req.params.productId);

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

// NOTE: the old in-memory `/api/orders` demo endpoints (POST to create an
// order, GET by orderNumber) were removed. Orders are now created in
// MongoDB automatically once a payment succeeds (see POST /api/payments
// below), and managed via the Order model through `OrderRoutes`
// (GET/PATCH/DELETE at /api/orders, mounted above).

// Stripe Payment Intent
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "usd" } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Called from the frontend right after Stripe confirms the payment.
// We don't trust the client's word that "it succeeded" — we re-check the
// PaymentIntent status with Stripe directly before writing anything to
// the database, then snapshot the current cart into its own document in
// the `payments` collection.
app.post("/api/payments", async (req, res) => {
  const { customerName = "", email = "", paymentIntentId } = req.body || {};

  if (!paymentIntentId) {
    return res.status(400).json({ message: "Missing paymentIntentId." });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res
        .status(400)
        .json({ message: "Payment has not succeeded yet." });
    }

    // If this gets called twice for the same PaymentIntent (e.g. a retry
    // after a flaky network response) don't create a duplicate record.
    const existing = await Payment.findOne({
      stripePaymentIntentId: paymentIntentId,
    });
    if (existing) {
      const existingOrder = await Order.findOne({
        stripePaymentIntentId: paymentIntentId,
      });
      return res.json({
        message: "Payment already recorded.",
        order: existingOrder || existing,
      });
    }

    const summary = getCartSummary();

    if (summary.itemCount === 0) {
      return res
        .status(400)
        .json({ message: "Cart is empty, nothing to record." });
    }

    const total = Number(
      (summary.subtotal + summary.shipping + summary.tax).toFixed(2),
    );

    const orderNumber = `OVIU-${String(Date.now()).slice(-6)}-${Math.floor(
      100 + Math.random() * 900,
    )}`;

    const payment = await Payment.create({
      orderNumber,
      customerName: String(customerName).trim(),
      email: String(email).trim(),
      items: summary.items.map((item) => ({
        productId: String(item.productId),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      })),
      subtotal: summary.subtotal,
      shipping: summary.shipping,
      tax: summary.tax,
      total,
      currency: paymentIntent.currency,
      stripePaymentIntentId: paymentIntentId,
      status: "succeeded",
    });

    // Mirror the same data into the `orders` collection. This is the
    // record the Admin dashboard actually manages (status changes,
    // delete, stats) — it starts as "pending" so an admin can mark it
    // "completed" once it's been fulfilled/shipped.
    const order = await Order.create({
      orderNumber,
      customerName: String(customerName).trim(),
      email: String(email).trim(),
      items: summary.items.map((item) => ({
        productId: String(item.productId),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      })),
      subtotal: summary.subtotal,
      shipping: summary.shipping,
      tax: summary.tax,
      total,
      currency: paymentIntent.currency,
      paymentId: payment._id,
      stripePaymentIntentId: paymentIntentId,
      status: "pending",
    });

    cart.clear();

    res.status(201).json({
      message: "Payment recorded successfully.",
      order,
    });
  } catch (error) {
    console.error("savePayment error:", error);
    res
      .status(500)
      .json({ message: "Failed to record payment.", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`OVIU backend listening on http://localhost:${port}`);
});
