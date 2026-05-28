import express from "express";

import {
  createOrder,
  verifyPayment,
  getMyOrders,
  createDBorder,
} from "../controllers/order.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/createOrder", authUser, createOrder);
router.post("/createDBorder", authUser, createDBorder);
router.post("/verify-payment", authUser, verifyPayment);

router.get("/my", authUser, getMyOrders);

export default router;