import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuth } from "../features/auth/authSlice";

const rawbaseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:1000/api",
  credentials: "include",
});

export const rawbaseQuerywithreAuth = async (args, api, extraOptions) => {
  let result = await rawbaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // ⚠️ only try refresh if cookies exist
    const refreshResult = await rawbaseQuery(
      {
        url: "/auth/refresh-token",
        credentials: "include",
      },
      api,
      extraOptions,
    );

    if (refreshResult?.data?.success) {
      result = await rawbaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearAuth());

      // 🔥 IMPORTANT: stop here
      return result;
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",

  baseQuery: rawbaseQuerywithreAuth,

  tagTypes: ["Auth", "User", "Feed", "Connection", "Request", "Chat"],

  endpoints: () => ({}),
});
