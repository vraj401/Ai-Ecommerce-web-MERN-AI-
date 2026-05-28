import API from "./axios";

export const createOrder = (shippingAddress, paymentMethod) =>
  API.post("/order/createOrder", { shippingAddress, paymentMethod });

export const getMyOrders = () => API.get("/order/my");
