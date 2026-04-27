import { useGetConversationsQuery } from "./chat.api";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedConversation,
  clearNotifications,
} from "./chatSlice";

const ConversationList = () => {
  const { data, isLoading } = useGetConversationsQuery();
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.chat);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.data?.map((conv) => {
        const count = notifications.filter(
          (n) => n.conversationId === conv._id
        ).length;

        return (
          <div
            key={conv._id}
            onClick={() => {
              dispatch(setSelectedConversation(conv));
              dispatch(clearNotifications(conv._id));
            }}
            style={{
              padding: "10px",
              borderBottom: "1px solid #eee",
              cursor: "pointer",
            }}
          >
            <div>
              {conv.groupName ||
                conv.members.map((m) => m.username).join(", ")}

              {count > 0 && (
                <span style={{ color: "red", marginLeft: "10px" }}>
                  ({count})
                </span>
              )}
            </div>

            <div style={{ fontSize: "12px", color: "gray" }}>
              {conv.lastMessage?.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;