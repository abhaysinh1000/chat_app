import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateConversationMutation,
  useCreateGroupConversationMutation,
  useGetConversationsQuery,
  useLazySearchUsersQuery,
} from "./chat.api";
import { clearNotifications, setSelectedConversation } from "./chatSlice";

const getUserDisplayName = (user) => {
  if (!user) return "Unknown user";
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  return fullName || user.email || "Unknown user";
};

const getConversationTitle = (conversation, currentUserId) => {
  if (conversation.groupName) return conversation.groupName;
  if (conversation.channelName) return `#${conversation.channelName}`;

  const isPrivateConversation =
    conversation.type === "private" ||
    (!conversation.groupName &&
      !conversation.channelName &&
      (conversation.members || []).length === 2);

  const filteredMembers =
    isPrivateConversation
      ? (conversation.members || []).filter(
          (member) => String(member?._id || member) !== String(currentUserId),
        )
      : conversation.members || [];

  const names = filteredMembers.map(getUserDisplayName);
  return names.length ? names.join(", ") : "Untitled conversation";
};

const ConversationList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [startChatError, setStartChatError] = useState("");
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);

  const { data, isLoading, refetch } = useGetConversationsQuery();
  const [searchUsers, { isFetching: isSearching }] = useLazySearchUsersQuery();
  const [createConversation, { isLoading: isCreating }] =
    useCreateConversationMutation();
  const [createGroupConversation, { isLoading: isCreatingGroup }] =
    useCreateGroupConversationMutation();

  const dispatch = useDispatch();
  const { notifications, selectedConversation } = useSelector(
    (state) => state.chat,
  );
  const currentUserId = useSelector(
    (state) => state.auth.user?._id || state.auth.user?.id,
  );

  const conversations = useMemo(() => data?.data || [], [data]);

  const latestNotificationByConversation = useMemo(() => {
    const map = new Map();

    notifications.forEach((notification) => {
      const conversationId = String(notification?.conversationId || "");
      if (!conversationId) return;

      const existing = map.get(conversationId);
      const incomingTime = new Date(
        notification?.message?.createdAt || notification?.message?.updatedAt || 0,
      ).getTime();
      const existingTime = new Date(
        existing?.message?.createdAt || existing?.message?.updatedAt || 0,
      ).getTime();

      if (!existing || incomingTime >= existingTime) {
        map.set(conversationId, notification);
      }
    });

    return map;
  }, [notifications]);

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const aNotification = latestNotificationByConversation.get(String(a._id));
      const bNotification = latestNotificationByConversation.get(String(b._id));

      const aTime = new Date(
        aNotification?.message?.createdAt ||
          a.lastMessage?.createdAt ||
          a.updatedAt ||
          0,
      ).getTime();
      const bTime = new Date(
        bNotification?.message?.createdAt ||
          b.lastMessage?.createdAt ||
          b.updatedAt ||
          0,
      ).getTime();

      return bTime - aTime;
    });
  }, [conversations, latestNotificationByConversation]);

  const handleSelectConversation = (conversation) => {
    dispatch(setSelectedConversation(conversation));
    dispatch(clearNotifications(conversation._id));
  };

  const handleSearch = async (value) => {
    setSearchTerm(value);
    setStartChatError("");

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const result = await searchUsers(value).unwrap();
      setSearchResults(result?.data || []);
    } catch {
      setSearchResults([]);
    }
  };

  const toggleGroupMember = (user) => {
    const userId = user._id || user.id;
    if (!userId) return;

    setGroupMembers((prev) => {
      const exists = prev.find((member) => String(member._id) === String(userId));
      if (exists) {
        return prev.filter((member) => String(member._id) !== String(userId));
      }

      return [...prev, { _id: userId, name: getUserDisplayName(user) }];
    });
  };

  const handleCreateGroup = async () => {
    setStartChatError("");
    if (!groupName.trim()) {
      setStartChatError("Please enter a group name.");
      return;
    }
    if (groupMembers.length < 2) {
      setStartChatError("Please select at least 2 users for a group.");
      return;
    }

    try {
      const result = await createGroupConversation({
        name: groupName.trim(),
        members: groupMembers.map((member) => member._id),
      }).unwrap();

      if (result?.data) {
        handleSelectConversation(result.data);
        setSearchTerm("");
        setSearchResults([]);
        setGroupName("");
        setGroupMembers([]);
        setIsGroupMode(false);
      }
    } catch (error) {
      console.error("Failed to create group:", error);
      setStartChatError("Could not create group. Please try again.");
    }
  };

  const findExistingConversation = (targetUserId) => {
    return conversations.find((conv) => {
      if (conv.type !== "private") return false;
      const members = conv.members || [];
      const hasTarget = members.some(
        (member) => String(member?._id || member) === String(targetUserId),
      );
      const hasCurrentUser = members.some(
        (member) => String(member?._id || member) === String(currentUserId),
      );

      return hasTarget && hasCurrentUser;
    });
  };

  const handleStartChat = async (userId) => {
    setStartChatError("");

    const existingConversation = findExistingConversation(userId);
    if (existingConversation) {
      handleSelectConversation(existingConversation);
      setSearchTerm("");
      setSearchResults([]);
      return;
    }

    try {
      const result = await createConversation({ targetUserId: userId }).unwrap();
      const newConversation = result?.data;

      if (newConversation) {
        handleSelectConversation(newConversation);
        setSearchTerm("");
        setSearchResults([]);
        return;
      }

      await refetch();
      const fallbackConversation = findExistingConversation(userId);
      if (fallbackConversation) {
        handleSelectConversation(fallbackConversation);
        setSearchTerm("");
        setSearchResults([]);
        return;
      }

      setStartChatError("Could not open this chat. Please try again.");
    } catch (error) {
      console.error("Failed to start conversation:", error);
      setStartChatError("Could not open this chat. Please try again.");
    }
  };

  return (
    <div className="h-full bg-[#F5F7FB] border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-100 bg-white/70 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-gray-800">Chats</h2>
          <button
            onClick={() => {
              setIsGroupMode((prev) => !prev);
              setGroupName("");
              setGroupMembers([]);
              setStartChatError("");
            }}
            className="text-xs rounded-full bg-gray-900 text-white px-3 py-1.5"
          >
            {isGroupMode ? "Cancel Group" : "New Group"}
          </button>
        </div>
        <p className="text-xs text-gray-500">Start a new chat or continue existing ones</p>

        {isGroupMode && (
          <div className="mt-3 space-y-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500">
              Pick at least 2 users from search results to create a group.
            </p>

            {groupMembers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {groupMembers.map((member) => (
                  <span key={member._id} className="text-xs rounded-full bg-blue-100 text-blue-700 px-2 py-1">
                    {member.name}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={handleCreateGroup}
              disabled={isCreatingGroup}
              className="w-full rounded-xl bg-blue-600 text-white py-2 text-sm font-medium disabled:opacity-60"
            >
              {isCreatingGroup ? "Creating..." : "Create Group"}
            </button>
          </div>
        )}

        <input
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name or email"
          className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {!!searchTerm && (
          <div className="mt-2 max-h-44 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            {isSearching && (
              <p className="px-3 py-2 text-xs text-gray-500">Searching users...</p>
            )}

            {!isSearching && searchResults.length === 0 && (
              <p className="px-3 py-2 text-xs text-gray-500">No users found.</p>
            )}

            {!isSearching &&
              searchResults.map((user) => (
                <button
                  key={user._id || user.id}
                  onClick={() =>
                    isGroupMode
                      ? toggleGroupMember(user)
                      : handleStartChat(user._id || user.id)
                  }
                  disabled={isCreating || isCreatingGroup}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-gray-800">{getUserDisplayName(user)}</p>
                    {isGroupMode &&
                      groupMembers.some(
                        (member) => String(member._id) === String(user._id || user.id),
                      ) && <span className="text-xs text-blue-600 font-medium">Selected</span>}
                  </div>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </button>
              ))}
          </div>
        )}

        {!!startChatError && (
          <p className="mt-2 text-xs text-red-600">{startChatError}</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && <p className="p-4 text-sm text-gray-500">Loading conversations...</p>}

        {!isLoading && conversations.length === 0 && (
          <p className="p-4 text-sm text-gray-500">
            No conversations yet. Search a user above to start chatting.
          </p>
        )}

        {!isLoading &&
          sortedConversations.map((conv) => {
            const count = notifications.filter(
              (n) => String(n.conversationId) === String(conv._id),
            ).length;

            const isActive = selectedConversation?._id === conv._id;

            const latestNotification = latestNotificationByConversation.get(
              String(conv._id),
            );
            const previewText =
              latestNotification?.message?.text ||
              conv.lastMessage?.text ||
              "No messages yet";

            return (
              <button
                key={conv._id}
                onClick={() => handleSelectConversation(conv)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 transition ${
                  isActive ? "bg-blue-50" : "hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                    {getConversationTitle(conv, currentUserId)}
                  </p>

                  {count > 0 && (
                    <span className="min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 truncate mt-1">
                  {previewText}
                </p>
              </button>
            );
          })}
      </div>
    </div>
  );
};

export default ConversationList;
