import API from "./axios";

export const chatWithAI = (message) =>
  API.post("/ai/aichat", {
    message,
  });
