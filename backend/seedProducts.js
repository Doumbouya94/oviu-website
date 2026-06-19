const db = require("./config/firebase");

const products = [
  {
    name: "Anime T-Shirt",
    subtitle: "Premium Cotton",
    price: 30,
    ratingCount: 124,
    type: "T-Shirts",
    colors: ["#111111", "#F2F2F2", "#B41F1F"],
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Wave Hoodie",
    subtitle: "Premium Fleece",
    price: 90,
    ratingCount: 89,
    type: "Hoodies",
    colors: ["#111111", "#A4A4A4", "#0D3F8F"],
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Good Things Tote",
    subtitle: "Premium Canvas",
    price: 25,
    ratingCount: 56,
    type: "Tote Bags",
    colors: ["#8C6A4F", "#F2BC1B", "#2E7A36"],
    image:
      "https://images.unsplash.com/photo-1614179689702-355944cd0918?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "OVIU Mug",
    subtitle: "Ceramic Mug",
    price: 18,
    ratingCount: 72,
    type: "Mugs",
    colors: ["#111111", "#F2F2F2", "#A4A4A4"],
    image:
      "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80",
  }
];

async function seedProducts() {
  try {
    for (const product of products) {
      await db.collection("products").add({
        ...product,
        createdAt: new Date(),
      });
    }

    console.log("Products added to Firebase successfully!");
    process.exit();
  } catch (error) {
    console.error("Error adding products:", error);
    process.exit(1);
  }
}

seedProducts();