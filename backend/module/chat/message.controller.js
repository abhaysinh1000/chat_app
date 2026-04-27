import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  createChannel,
  createGroupConversation,
  getMessageServices,
  joinChannel,
  sendMessageServices,
  createOrGetPrivateConversation,
  getUserConversations,
} from "./message.service.js";
import { searchUsersService } from "./user.service.js";

export const sendMessage = asyncHandler(async (req, res, next) => {
  try {
    const senderId = req.user._id;

    const { conversationId, text } = req.body;

    const message = await sendMessageServices({
      senderId,
      conversationId,
      text,
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
});

export const getmessage = asyncHandler(async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { page, limit } = req.query;

    const message = await getMessageServices({
      conversationId,
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    });

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
});

export const createConversation = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { targetUserId } = req.body;

    const conversation = await createOrGetPrivateConversation({
      userId: userId,
      targetUserId: targetUserId,
    });

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
});


export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const conversations = await getUserConversations(userId);

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};



export const createGroup = async (req, res, next) => {
  try {
    const creatorId = req.user._id;
    const { name, members } = req.body;

    const group = await createGroupConversation({
      creatorId,
      name,
      members,
    });

    res.status(201).json({
      success: true,
      data: group,
    });
  } catch (error) {
    next(error);
  }
};



export const searchUsers = async (req, res, next) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user._id;

    const users = await searchUsersService(query, currentUserId);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};



export const createChannelController = async (req, res, next) => {
  try {
    const { name } = req.body;

    const channel = await createChannel({ name });

    res.status(201).json({
      success: true,
      data: channel,
    });
  } catch (error) {
    next(error);
  }
};



export const joinChannelController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { channelId } = req.body;

    const channel = await joinChannel({ channelId, userId });

    res.status(200).json({
      success: true,
      data: channel,
    });
  } catch (error) {
    next(error);
  }
};
