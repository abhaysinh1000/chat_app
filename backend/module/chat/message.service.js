import Conversation from "../../models/conversation.model.js";
import Message from "../../models/message.model.js";
import { AppError } from "../../utils/AppError.js";

export const sendMessageServices = async ({ senderId, conversationId, text }) => {
  if (!senderId || !conversationId) {
    throw new AppError("Missing required Fields", 400);
  }

  if (!text || text.trim() === "") {
    throw new AppError("Message cannot be empty ", 400);
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new AppError("Conversation is not found ", 404);
  }

  // 3. check sender is part of conversation

  const ismember = conversation.members.some(
    (member) => member.toString() === senderId.toString(),
  );

  if (!ismember) {
    throw new AppError("Unauthorized", 403);
  }

  const message = await Message.create({
    sender: senderId,
    conversation: conversationId,
    text,
    seenBy: [senderId],
  });

  conversation.lastMessage = message._id;
  await conversation.save();

  await message.populate("sender", "firstName lastName email");

  return message;
};

export const getMessageServices = async ({ conversationId, page = 1, limit = 20 }) => {
  if (!conversationId) {
    throw new AppError("conversationId is required", 400);
  }

  const skip = (page - 1) * limit;

  const message = await Message.find({ conversation: conversationId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("sender", "firstName lastName email");

  return message.reverse();
};

export const createOrGetPrivateConversation = async ({ userId, targetUserId }) => {
  if (!userId || !targetUserId) {
    throw new AppError("Both Users are required", 400);
  }

  const existingConverstion = await Conversation.findOne({
    type: "private",
    members: { $all: [userId, targetUserId] },
    $expr: { $eq: [{ $size: "$members" }, 2] },
  });

  if (existingConverstion) {
    return Conversation.findById(existingConverstion._id)
      .populate({
        path: "members",
        select: "firstName lastName email",
        model: "User",
      })
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "firstName lastName email",
          model: "User",
        },
      });
  }

  const newConversation = await Conversation.create({
    type: "private",
    members: [userId, targetUserId],
  });

  return Conversation.findById(newConversation._id)
    .populate({
      path: "members",
      select: "firstName lastName email",
      model: "User",
    })
    .populate({
      path: "lastMessage",
      populate: {
        path: "sender",
        select: "firstName lastName email",
        model: "User",
      },
    });
};


export const getUserConversations = async (userId) => {
  const conversations = await Conversation.find({
    members: userId,
  })
    .populate("members", "firstName lastName email")
    .populate({
      path: "lastMessage",
      populate: {
        path: "sender",
        select: "firstName lastName email",
      },
    })
    .sort({ updatedAt: -1 });

  return conversations;
};



export const createGroupConversation = async ({ creatorId, name, members }) => {
  if (!name || !members || members.length < 2) {
    throw new Error("Group must have name and at least 2 members");
  }

  // include creator
  const allMembers = [...new Set([creatorId, ...members])];

  const group = await Conversation.create({
    type: "group",
    members: allMembers,
    groupName: name,
    admins: [creatorId],
  });

  return group;
};



export const markConversationAsSeen = async ({ conversationId, userId }) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) throw new Error("Conversation not found");

  const existing = conversation.lastSeen.find(
    (item) => item.user.toString() === userId.toString(),
  );

  if (existing) {
    existing.lastSeenAt = new Date();
  } else {
    conversation.lastSeen.push({
      user: userId,
      lastSeenAt: new Date(),
    });
  }

  await conversation.save();
};



export const createChannel = async ({ name }) => {
  if (!name) {
    throw new Error("Channel name is required");
  }

  // prevent duplicate channels
  const existing = await Conversation.findOne({
    type: "channel",
    channelName: name,
  });

  if (existing) return existing;

  const channel = await Conversation.create({
    type: "channel",
    channelName: name,
    members: [], // users join later
  });

  return channel;
};

export const joinChannel = async ({ channelId, userId }) => {
  const channel = await Conversation.findById(channelId);

  if (!channel || channel.type !== "channel") {
    throw new Error("Channel not found");
  }

  if (!channel.members.includes(userId)) {
    channel.members.push(userId);
    await channel.save();
  }

  return channel;
};



export const getUnreadCount = (conversation, userId) => {
  const seen = conversation.lastSeen.find(
    (item) => item.user.toString() === userId.toString(),
  );

  const lastSeenAt = seen?.lastSeenAt;

  if (!lastSeenAt) return true; // all unread initially

  return lastSeenAt;
};
