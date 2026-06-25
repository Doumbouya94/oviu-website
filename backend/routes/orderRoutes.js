import express from "express";
import {
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
  getOrderStatsToday,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/stats", getOrderStats);
router.get("/stats/today", getOrderStatsToday);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);

export default router;
