import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "./socket";
import { initSocketListeners } from "./socketListener";

const ChatPage = () => {
  const { selectedConversation } = useSelector((state) => state.chat);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const store = useStore();

  useEffect(() => {
    if (!user) return;

    const socket = connectSocket();
    const cleanupListeners = initSocketListeners(dispatch, store.getState);

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return () => {
      cleanupListeners?.();
      disconnectSocket();
    };
  }, [user, dispatch, store]);

  return (
    <div className="h-screen bg-gradient-to-b from-[#EEF3FF] to-[#F8FAFF] p-3 md:p-4">
      <div className="h-full max-w-7xl mx-auto bg-white/80 backdrop-blur rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.10)] border border-white overflow-hidden md:grid md:grid-cols-[340px_1fr]">
        <div className={`${selectedConversation ? "hidden" : "block"} md:block h-full`}>
          <ConversationList />
        </div>

        <div className={`${selectedConversation ? "block" : "hidden"} md:block h-full`}>
          <ChatWindow />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
