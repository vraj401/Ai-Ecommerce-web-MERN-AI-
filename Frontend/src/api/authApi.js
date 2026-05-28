import API from "./axios";

// Register
export const registerUser = (data) =>
  API.post("/user/register", data);

// Login
export const loginUser = (data) =>
  API.post("/user/login", data);