import API from "./axios";

export const fetchProducts = () => API.get("/products");



export const fetchProductById = (id) =>
  API.get(`/products/${id}`);

export const fetchProductsByPids = (pids) =>
  API.post("/products/by-pids", { pids });
