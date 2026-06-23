import mongoose from "mongoose";

// One document per successful checkout. Stored separately from the
// in-memory `orders` array used by the old (now unused) /api/orders demo
// endpoint, so this is the real, persistent record of what was paid.
const paymentSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },

    customerName: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, default: "" },

    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        lineTotal: { type: Number, required: true },
      },
    ],

    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    currency: { type: String, default: "usd" },

    // Stripe PaymentIntent id. Unique so the same payment can never be
    // recorded twice even if the save request is retried.
    stripePaymentIntentId: { type: String, required: true, unique: true },

    status: {
      type: String,
      enum: ["succeeded", "failed", "pending"],
      default: "succeeded",
    },
  },
  { timestamps: true },
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
