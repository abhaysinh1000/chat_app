import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";

const ChatPage = () => {
  return (
    <div className="h-screen bg-gray-100 p-3 md:p-4">
      <div className="h-full max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden grid grid-cols-1 md:grid-cols-[340px_1fr]">
        <ConversationList />
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatPage;
