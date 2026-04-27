import { useSelector, useDispatch } from "react-redux";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
} from "./chat.api";
import { setMessages } from "./chatSlice";
import { useEffect, useState } from "react";
import { getSocket } from "./socket";

const ChatWindow = () => {
  const dispatch = useDispatch();
  const { selectedConversation, messages, typingUsers } = useSelector(
    (state) => state.chat
  );

  const [text, setText] = useState("");
  const socket = getSocket();
  let typingTimeout;

  const { data } = useGetMessagesQuery(
    { conversationId: selectedConversation?._id },
    { skip: !selectedConversation }
  );

  const [sendMessage] = useSendMessageMutation();

  useEffect(() => {
    if (data?.data) {
      dispatch(setMessages(data.data));
    }
  }, [data, dispatch]);

  if (!selectedConversation) {
    return <div>Select a chat</div>;
  }

  const handleSend = async () => {
    if (!text.trim()) return;

    await sendMessage({
      conversationId: selectedConversation._id,
      text,
    });

    setText("");

    socket?.emit("stop_typing", {
      conversationId: selectedConversation._id,
    });
  };

  return (
    <div style={{ padding: "10px" }}>
      <div style={{ height: "80vh", overflowY: "auto" }}>
        {messages.map((msg) => (
          <div key={msg._id}>
            <b>{msg.sender.username}:</b> {msg.text}
          </div>
        ))}

        {typingUsers.length > 0 && (
          <div style={{ fontStyle: "italic", color: "gray" }}>
            Someone is typing...
          </div>
        )}
      </div>

      <div>
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);

            if (!socket || !selectedConversation) return;

            socket.emit("typing", {
              conversationId: selectedConversation._id,
            });

            clearTimeout(typingTimeout);

            typingTimeout = setTimeout(() => {
              socket.emit("stop_typing", {
                conversationId: selectedConversation._id,
              });
            }, 1000);
          }}
          placeholder="Type message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;