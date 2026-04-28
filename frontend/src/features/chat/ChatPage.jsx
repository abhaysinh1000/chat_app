import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import { useSelector } from "react-redux";

const ChatPage = () => {
  const { selectedConversation } = useSelector((state) => state.chat);

  return (
    <div className="h-screen bg-gray-100 p-3 md:p-4">
      <div className="h-full max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden md:grid md:grid-cols-[340px_1fr]">
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
