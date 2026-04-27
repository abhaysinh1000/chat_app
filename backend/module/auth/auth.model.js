import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },

  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },

  lastName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 40,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },

  password: {
    type: String,
    requried: true,
    trim: true,
    select: false,
  },
});

const User = mongoose.model("user", userSchema);

export default User;
