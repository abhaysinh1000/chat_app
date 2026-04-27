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

    createConnversation: builder.mutation({
      query: (body) => ({
        url: "/conversation",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Chat"],
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
  useCreateConnversationMutation,
  useGetConversationsQuery,
} = chatApi;
