import API from "./axios";

// Add to cart
export const addToCart = (productId, quantity = 1) =>
  API.post("/cart/addtocart", { prodId: productId, quantity });

// Get cart
export const getCart = () => API.post("/cart/getCart");

// Remove item
export const removeFromCart = (productId) =>
  API.delete("/cart/removeFromCart", { params: { productId } });

// Update quantity
export const updateCart = (productId, quantity) =>
  API.put("/cart/updateCart", { quantity }, { params: { productId } });

export const clearCart = (userId) =>
  API.delete("/cart/clearCart", { userId });