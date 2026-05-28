import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  userId: String,
  type: String,
  data: Object,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Activity", activitySchema);