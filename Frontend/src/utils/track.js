export const trackEvent = (type, data) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return;

  fetch("http://localhost:5000/api/track", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: user._id,
      type,
      data,
    }),
  });
};