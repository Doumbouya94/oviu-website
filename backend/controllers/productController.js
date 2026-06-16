import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const { category, active } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (active !== undefined) filter.isActive = active === "true";

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
};

// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch product", error: error.message });
  }
};

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      sizes,
      colors,
      neckType,
      vNeckDepth,
      vNeckDepthLabels,
      variants,
    } = req.body;

    // Build images array from files uploaded via multer + Cloudinary
    const images =
      req.files?.map((file) => ({
        url: file.path,
        publicId: file.filename,
        altText: { en: "", fr: "" },
      })) || [];

    const product = await Product.create({
      name: JSON.parse(name),
      description: JSON.parse(description),
      price,
      category,
      sizes: JSON.parse(sizes),
      colors: JSON.parse(colors),
      neckType: neckType || null,
      vNeckDepth: vNeckDepth || null,
      vNeckDepthLabels: vNeckDepthLabels
        ? JSON.parse(vNeckDepthLabels)
        : undefined,
      variants: JSON.parse(variants),
      images,
    });

    res.status(201).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create product", error: error.message });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const {
      name,
      description,
      price,
      category,
      sizes,
      colors,
      neckType,
      vNeckDepth,
      vNeckDepthLabels,
      variants,
      isActive,
    } = req.body;

    // Map newly uploaded files to Cloudinary image objects
    const newImages =
      req.files?.map((file) => ({
        url: file.path,
        publicId: file.filename,
        altText: { en: "", fr: "" },
      })) || [];

    // Update only fields that were provided in the request
    if (name) product.name = JSON.parse(name);
    if (description) product.description = JSON.parse(description);
    if (price) product.price = price;
    if (category) product.category = category;
    if (sizes) product.sizes = JSON.parse(sizes);
    if (colors) product.colors = JSON.parse(colors);
    if (neckType) product.neckType = neckType;
    if (vNeckDepth) product.vNeckDepth = vNeckDepth;
    if (vNeckDepthLabels)
      product.vNeckDepthLabels = JSON.parse(vNeckDepthLabels);
    if (variants) product.variants = JSON.parse(variants);
    if (isActive !== undefined) product.isActive = isActive === "true";

    // Append new images to the existing images array
    if (newImages.length > 0) {
      product.images.push(...newImages);
    }

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update product", error: error.message });
  }
};

// DELETE PRODUCT IMAGE
export const deleteProductImage = async (req, res) => {
  try {
    const { id, publicId } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Remove image from Cloudinary using its public ID
    await cloudinary.uploader.destroy(publicId);

    // Remove image entry from the product's images array in the database
    product.images = product.images.filter((img) => img.publicId !== publicId);
    await product.save();

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete image", error: error.message });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete all associated images from Cloudinary before removing the product
    await Promise.all(
      product.images.map((img) => cloudinary.uploader.destroy(img.publicId)),
    );

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete product", error: error.message });
  }
};
