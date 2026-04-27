import { baseApi } from "../../App/base.api";
import { clearAuth, setAuthUser } from "./authSlice";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
    }),

    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),

      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.user) {
            dispatch(setAuthUser(data.user)); // ✅ matches backend response
          }
        } catch (error) {
          console.log(error.message);
        }
      },
    }),
    
    verifyemail: builder.mutation({
      query: (token) => ({
        url: `/auth/verify-email/${token}`,
        method: "GET",
      }),
    }),

    sendEmailVerification: builder.mutation({
      query: (body) => ({
        url: "/auth/send-email-verification",
        method: "POST",
        body,
      }),
    }),

    forgetPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/forgetPassword",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `/auth/resetPassword/${token}`,
        method: "POST",
        body: { password },
      }),
    }),

    refreshToken: builder.mutation({
      query: (body) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body,
      }),
    }),

    logout: builder.mutation({
      query: (body) => ({
        url: "/auth/logout",
        method: "POST",
        body,
      }),

      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(clearAuth());
        } catch (error) {
          console.log(error.message);
        }
      },
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useVerifyemailMutation, // ✅ fixed
  useSendEmailVerificationMutation, // ✅ fixed
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation, // ✅ fixed
  useLogoutMutation,
} = authApi;
