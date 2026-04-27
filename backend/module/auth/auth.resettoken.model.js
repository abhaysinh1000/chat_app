import mongoose from "mongoose";

const resetTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },

  token: {
    type: String,
    required: true,
  },
  expiredAt: {
    type: Date,
    required: true,
  },
});

const ResetToken = mongoose.model("ResetToken", resetTokenSchema);

export default ResetToken;
