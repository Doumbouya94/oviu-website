import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
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

    // Link back to the Payment record / Stripe PaymentIntent that created
    // this order, so the two can be cross-referenced if needed.
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    stripePaymentIntentId: { type: String },

    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
