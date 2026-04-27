import mongoose from "mongoose";

const convertionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["private", "group", "channel"],
      default: "private",
      required: true,
    },

    groupName: {
      type: String,
      trim: true,
    },

    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    lastSeen: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        lastSeenAt: {
          type: Date,
          default: null,
        },
      },
    ],  
  },
  {
    timestamps: true,
  },
);

const Conversation = mongoose.model("Conversation", convertionSchema);

export default Conversation;
