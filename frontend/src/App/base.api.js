import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuth } from "../features/auth/authSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1000/api";

const rawbaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
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
