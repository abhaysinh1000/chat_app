import { baseApi } from "../../App/base.api";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => ({
        url: "/conversation",
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),

    createConversation: builder.mutation({
      query: (body) => ({
        url: "/conversation",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chat"],
    }),

    createGroupConversation: builder.mutation({
      query: (body) => ({
        url: "/conversation/group",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chat"],
    }),

    searchUsers: builder.query({
      query: (query) => ({
        url: `/conversation/users/search?query=${encodeURIComponent(query)}`,
        method: "GET",
      }),
    }),

    getMessages: builder.query({
      query: ({ conversationId, page = 1 }) => ({
        url: `/message/${conversationId}?page=${page}`,
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),

    sendMessage: builder.mutation({
      query: (body) => ({
        url: "/message",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetMessagesQuery,
  useCreateConversationMutation,
  useCreateGroupConversationMutation,
  useGetConversationsQuery,
  useLazySearchUsersQuery,
} = chatApi;
