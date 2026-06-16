import mongoose from "mongoose";

// Sub-schema reusable for bilingual fields (name, description, altText, etc.)
const bilingualField = {
  en: { type: String, required: true, trim: true },
  fr: { type: String, required: true, trim: true },
};

const productSchema = new mongoose.Schema(
  {
    name: bilingualField,

    description: bilingualField,

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      enum: ["tshirt", "hoodie", "other"],
      required: true,
    },

    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        altText: bilingualField,
      },
    ],

    sizes: [
      {
        type: String,
        enum: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
      },
    ],

    colors: [
      {
        name: bilingualField, // ej. { en: "Navy Blue", fr: "Bleu marine" }
        hex: { type: String, required: true },
      },
    ],

    neckType: {
      type: String,
      enum: ["round", "v-neck"],
      default: null,
    },

    vNeckDepth: {
      type: String,
      enum: ["shallow", "classic", "medium", "deep", "plunging"],
      default: null,
    },

    // Bilingual fields for neckType and vNeckDepth labels (ej. "Round Neck" / "Col rond", "Shallow V-Neck" / "Col en V peu profond")
    vNeckDepthLabels: {
      shallow: { ...bilingualField, default: undefined },
      classic: { ...bilingualField, default: undefined },
      medium: { ...bilingualField, default: undefined },
      deep: { ...bilingualField, default: undefined },
      plunging: { ...bilingualField, default: undefined },
    },

    variants: [
      {
        size: { type: String, required: true },
        colorName: { type: String, required: true }, // reference to the color (in English as key)
        stock: { type: Number, required: true, min: 0, default: 0 },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
