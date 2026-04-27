import mongoose from "mongoose";

const refreshTokenScehma = new mongoose.Schema({
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
});

const   RefreshToken = mongoose.model("refreshtoken", refreshTokenScehma);

export default RefreshToken;
