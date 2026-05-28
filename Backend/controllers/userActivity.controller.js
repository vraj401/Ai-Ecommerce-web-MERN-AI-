import Activity from "../models/userActivity.model.js";

export const trackActivity = async (req, res) => {
  const { userId, type, data } = req.body;

  await Activity.create({
    userId,
    type,
    data,
  });

  res.json({ success: true });
};