import { baseApi } from "../../App/base.api";
import { setAuthUser } from "../auth/authSlice";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),

      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.data) {
            dispatch(setAuthUser(data?.data));
          }
        } catch (error) {
          console.log(error);
        }
      },

      providesTags: ["User"],
    }),



    

  }),
});

export const { useGetProfileQuery } = userApi;



