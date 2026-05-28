import express from "express";

import {
  getProducts,
  getProductsByPids,
  getSingleProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);

router.post("/by-pids", getProductsByPids);

router.get("/:id", getSingleProduct);

export default router;
