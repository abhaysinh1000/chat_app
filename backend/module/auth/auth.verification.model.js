import mongoose from "mongoose";

const VerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    token: {
      type: String,
      required: true,
    },

    expireAt: {
      type: Date,
      required: true,
    },
  },

  {
    timestamp: true,
  },
);

const verification = mongoose.model("Verification", VerificationSchema);

export default verification;
