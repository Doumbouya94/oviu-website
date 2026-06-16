import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
} from "../controllers/productController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public routes — accessible by any visitor
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin routes — add auth middleware here once it's ready
// e.g. router.post('/', requireAuth, upload.array('images', 10), createProduct);
router.post("/", upload.array("images", 10), createProduct);
router.put("/:id", upload.array("images", 10), updateProduct);
router.delete("/:id/images/:publicId", deleteProductImage);
router.delete("/:id", deleteProduct);

export default router;
