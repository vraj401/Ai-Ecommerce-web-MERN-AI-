import express from "express";
const router = express.Router();
import { validationResult } from "express-validator";
import {body} from "express-validator";
import  { addToCart, clearCart, getCart ,removeFromCart,updateCartQuantity} from "../controllers/cart.controller.js";
import { authUser } from "../middleware/auth.middleware.js";


router.post("/addtocart",
    authUser,
    addToCart
)

router.post("/getCart",
    authUser,
    getCart
)

router.delete(
  "/removeFromCart/",
  authUser,
  removeFromCart
);


router.put(
  "/updateCart",
  authUser,
  updateCartQuantity
);

router.delete(
  "/clearCart",
  authUser,
  clearCart);


export default router;