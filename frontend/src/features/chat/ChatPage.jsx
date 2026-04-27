import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";

const ChatPage = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "30%", borderRight: "1px solid #ccc" }}>
        <ConversationList />
      </div>

      <div style={{ width: "70%" }}>
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatPage;