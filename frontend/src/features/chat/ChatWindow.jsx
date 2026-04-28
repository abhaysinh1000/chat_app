import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGetMessagesQuery, useSendMessageMutation } from "./chat.api";
import { setMessages, setSelectedConversation } from "./chatSlice";
import { getSocket } from "./socket";

const displayName = (user) => {
  if (!user) return "Unknown";
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  return fullName || user.email || "Unknown";
};

const ChatWindow = () => {
  const dispatch = useDispatch();
  const { selectedConversation, messages, typingUsers } = useSelector(
    (state) => state.chat,
  );
  const currentUser = useSelector((state) => state.auth.user);

  const [text, setText] = useState("");
  const typingTimeoutRef = useRef(null);

  const socket = getSocket();

  const { data, isFetching } = useGetMessagesQuery(
    { conversationId: selectedConversation?._id },
    { skip: !selectedConversation },
  );

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const getSenderId = (message) => String(message?.sender?._id || message?.sender || "");
  const isOwnMessage = (message) => getSenderId(message) === String(currentUser?._id || "");

  const getMessageStatus = (message) => {
    if (!isOwnMessage(message)) return "";

    const seenCount = (message.seenBy || []).length;
    const memberCount = (selectedConversation?.members || []).length;

    if (memberCount > 1 && seenCount >= memberCount) return "Seen";
    return "Delivered";
  };

  useEffect(() => {
    if (data?.data) {
      dispatch(setMessages(data.data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (!socket || !selectedConversation?._id) return;

    socket.emit("join_conversation", selectedConversation._id);
    socket.emit("mark_seen", { conversationId: selectedConversation._id });
  }, [socket, selectedConversation?._id]);

  const title = useMemo(() => {
    if (!selectedConversation) return "";
    if (selectedConversation.groupName) return selectedConversation.groupName;
    if (selectedConversation.channelName) return `#${selectedConversation.channelName}`;
    const others = (selectedConversation.members || []).filter(
      (member) => String(member?._id || member) !== String(currentUser?._id),
    );
    if (others.length === 0) return "Direct message";
    return others.map(displayName).join(", ");
  }, [selectedConversation, currentUser?._id]);

  if (!selectedConversation) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <p className="text-lg font-semibold text-gray-700">Select a conversation</p>
          <p className="text-sm text-gray-500 mt-1">
            Choose a chat from the left panel or search a user to start chatting.
          </p>
        </div>
      </div>
    );
  }

  const handleSend = async () => {
    if (!text.trim() || !selectedConversation?._id) return;
    const payload = {
      conversationId: selectedConversation._id,
      text: text.trim(),
    };
    const trimmedText = text.trim();

    setText("");

    if (socket?.connected) {
      socket.emit("send_message", payload, async (ack) => {
        if (!ack?.success) {
          await sendMessage(payload);
        }
      });
      socket.emit("stop_typing", {
        conversationId: selectedConversation._id,
      });
      return;
    }

    await sendMessage({
      conversationId: selectedConversation._id,
      text: trimmedText,
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(setSelectedConversation(null))}
            className="md:hidden text-xs text-blue-600 font-medium"
          >
            ← Back
          </button>
          <p className="text-sm text-gray-500">Conversation</p>
        </div>
        <h3 className="text-base font-semibold text-gray-900 truncate">{title}</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {isFetching && <p className="text-sm text-gray-500">Loading messages...</p>}

        {!isFetching && messages.length === 0 && (
          <p className="text-sm text-gray-500">No messages yet. Start the conversation 👋</p>
        )}

        {messages.map((msg) => {
          const own = isOwnMessage(msg);
          const status = getMessageStatus(msg);

          return (
            <div key={msg._id} className={`flex ${own ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-xl border px-3 py-2 ${
                  own
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white border-gray-200 text-gray-800"
                }`}
              >
                {!own && <p className="text-xs text-gray-500 mb-1">{displayName(msg.sender)}</p>}
                <p className="text-sm break-words">{msg.text}</p>
                {own && <p className="text-[10px] mt-1 text-blue-100 text-right">{status}</p>}
              </div>
            </div>
          );
        })}

        {typingUsers.length > 0 && (
          <div className="text-xs italic text-gray-500">Typing...</div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => {
            const value = e.target.value;
            setText(value);

            if (!socket || !selectedConversation?._id) return;

            socket.emit("typing", {
              conversationId: selectedConversation._id,
            });

            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = setTimeout(() => {
              socket.emit("stop_typing", {
                conversationId: selectedConversation._id,
              });
            }, 1000);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Type a message..."
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSend}
          disabled={isSending || !text.trim()}
          className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
