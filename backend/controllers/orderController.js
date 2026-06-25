import mongoose from "mongoose";
import Order from "../models/Order.js";

// GET ALL ORDERS (with optional ?status= filter)
export const getOrders = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("getOrders error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: error.message });
  }
};

// GET SINGLE ORDER (full detail, used by the "view order" modal)
export const getOrderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    console.error("getOrderById error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch order", error: error.message });
  }
};

// UPDATE ORDER STATUS (pending | completed | cancelled)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["pending", "completed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    const updated = await order.save();

    res.json(updated);
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    res
      .status(500)
      .json({ message: "Failed to update order status", error: error.message });
  }
};

// DELETE ORDER
export const deleteOrder = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.deleteOne();
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("deleteOrder error:", error);
    res
      .status(500)
      .json({ message: "Failed to delete order", error: error.message });
  }
};

// GET TODAY'S STATS (for Dashboard Overview)
// Revenue counts pending + completed (any paid order, regardless of fulfillment status).
// Cancelled orders are excluded since the payment was reversed/voided.
export const getOrderStatsToday = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayFilter = { createdAt: { $gte: startOfDay, $lte: endOfDay } };

    const [
      todayOrders,
      todayPending,
      todayCompleted,
      todayCancelled,
      todayRevenueResult,
    ] = await Promise.all([
      Order.countDocuments(todayFilter),
      Order.countDocuments({ ...todayFilter, status: "pending" }),
      Order.countDocuments({ ...todayFilter, status: "completed" }),
      Order.countDocuments({ ...todayFilter, status: "cancelled" }),
      Order.aggregate([
        {
          $match: {
            ...todayFilter,
            status: { $in: ["pending", "completed"] },
          },
        },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    ]);

    const todayRevenue = todayRevenueResult[0]?.total ?? 0;

    res.json({
      todayOrders,
      todayPending,
      todayCompleted,
      todayCancelled,
      todayRevenue: Number(todayRevenue.toFixed(2)),
    });
  } catch (error) {
    console.error("getOrderStatsToday error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch today's stats", error: error.message });
  }
};

// GET GLOBAL STATS (for Statistics tab)
// Monthly revenue counts pending + completed (any paid order).
// Avg order value is calculated across all non-cancelled orders this month.
// Low stock threshold: variants with stock < 10 (counted per product, not per variant).
export const getOrderStats = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(
      startOfMonth.getFullYear(),
      startOfMonth.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const monthFilter = { createdAt: { $gte: startOfMonth, $lte: endOfMonth } };

    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      monthlyRevenueResult,
      avgOrderValueResult,
    ] = await Promise.all([
      Order.countDocuments({}),
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({ status: "completed" }),
      Order.countDocuments({ status: "cancelled" }),
      // Monthly revenue: pending + completed (any paid order this month)
      Order.aggregate([
        {
          $match: {
            ...monthFilter,
            status: { $in: ["pending", "completed"] },
          },
        },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      // Avg order value: all non-cancelled orders this month
      Order.aggregate([
        {
          $match: {
            ...monthFilter,
            status: { $in: ["pending", "completed"] },
          },
        },
        { $group: { _id: null, avg: { $avg: "$total" } } },
      ]),
    ]);

    const monthlyRevenue = monthlyRevenueResult[0]?.total ?? 0;
    const avgOrderValue = avgOrderValueResult[0]?.avg ?? 0;

    // Low stock: import Product inline to avoid circular deps at the top level.
    // Count distinct products where at least one variant has stock < 10,
    // or (for products without variants) stock < 10 directly on the doc.
    const { default: Product } = await import("../models/Products.js");

    const [lowStockVariants, lowStockFlat, totalProducts] = await Promise.all([
      // Products with variants where any variant stock < 10
      Product.countDocuments({
        "variants.0": { $exists: true },
        variants: { $elemMatch: { stock: { $lt: 10 } } },
      }),
      // Products without variants where root stock < 10
      Product.countDocuments({
        "variants.0": { $exists: false },
        stock: { $lt: 10 },
      }),
      Product.countDocuments({}),
    ]);

    const lowStockItems = lowStockVariants + lowStockFlat;

    res.json({
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      monthlyRevenue: Number(monthlyRevenue.toFixed(2)),
      avgOrderValue: Number(avgOrderValue.toFixed(2)),
      totalProducts,
      lowStockItems,
    });
  } catch (error) {
    console.error("getOrderStats error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch order stats", error: error.message });
  }
};
