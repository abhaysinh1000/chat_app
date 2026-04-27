import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateConversationMutation,
  useGetConversationsQuery,
  useLazySearchUsersQuery,
} from "./chat.api";
import { clearNotifications, setSelectedConversation } from "./chatSlice";

const getUserDisplayName = (user) => {
  if (!user) return "Unknown user";
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  return fullName || user.email || "Unknown user";
};

const getConversationTitle = (conversation) => {
  if (conversation.groupName) return conversation.groupName;
  if (conversation.channelName) return `#${conversation.channelName}`;

  const names = (conversation.members || []).map(getUserDisplayName);
  return names.length ? names.join(", ") : "Untitled conversation";
};

const ConversationList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const { data, isLoading } = useGetConversationsQuery();
  const [searchUsers, { isFetching: isSearching }] = useLazySearchUsersQuery();
  const [createConversation, { isLoading: isCreating }] =
    useCreateConversationMutation();

  const dispatch = useDispatch();
  const { notifications, selectedConversation } = useSelector(
    (state) => state.chat,
  );

  const conversations = useMemo(() => data?.data || [], [data]);

  const handleSelectConversation = (conversation) => {
    dispatch(setSelectedConversation(conversation));
    dispatch(clearNotifications(conversation._id));
  };

  const handleSearch = async (value) => {
    setSearchTerm(value);

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

  const handleStartChat = async (userId) => {
    try {
      const result = await createConversation({ targetUserId: userId }).unwrap();
      const newConversation = result?.data;
      if (newConversation) {
        handleSelectConversation(newConversation);
        setSearchTerm("");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Chats</h2>
        <p className="text-xs text-gray-500">Start a new chat or continue existing ones</p>

        <input
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name or email"
          className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {!!searchTerm && (
          <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50">
            {isSearching && (
              <p className="px-3 py-2 text-xs text-gray-500">Searching users...</p>
            )}

            {!isSearching && searchResults.length === 0 && (
              <p className="px-3 py-2 text-xs text-gray-500">No users found.</p>
            )}

            {!isSearching &&
              searchResults.map((user) => (
                <button
                  key={user._id}
                  onClick={() => handleStartChat(user._id)}
                  disabled={isCreating}
                  className="w-full text-left px-3 py-2 hover:bg-white border-b border-gray-200 last:border-b-0"
                >
                  <p className="text-sm font-medium text-gray-800">{getUserDisplayName(user)}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </button>
              ))}
          </div>
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
          conversations.map((conv) => {
            const count = notifications.filter(
              (n) => n.conversationId === conv._id,
            ).length;

            const isActive = selectedConversation?._id === conv._id;

            return (
              <button
                key={conv._id}
                onClick={() => handleSelectConversation(conv)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 transition ${
                  isActive ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {getConversationTitle(conv)}
                  </p>

                  {count > 0 && (
                    <span className="min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 truncate mt-1">
                  {conv.lastMessage?.text || "No messages yet"}
                </p>
              </button>
            );
          })}
      </div>
    </div>
  );
};

export default ConversationList;
