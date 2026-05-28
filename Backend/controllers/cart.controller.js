import Cart from "../models/cart.model.js";
import { validationResult } from "express-validator";

export const addToCart = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }
  try {
    const user = req.user;
   const { prodId } = req.body;
const quantity = Number(req.body.quantity);

    let cart = await Cart.findOne({ user: req.user._id });
const userId = user._id;
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === prodId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: prodId,
        quantity,
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
      console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        item.product.toString() !== req.query.productId
    );

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCartQuantity = async (
  req,
  res
) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    const item = cart.items.find(
      (item) =>
        item.product.toString() ===
        req.query.productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    item.quantity = quantity;

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const clearCart = async (req,res) => {
  try {
    const userId = req.user._id;
   const cart =  await Cart.findOneAndUpdate(
      { user: userId },
      { items: [] }
    );
  }
    catch (error) { 
    console.error("Error clearing cart:", error);
    res.status(500).json({
      message: "Failed to clear cart",
    });
  }
};