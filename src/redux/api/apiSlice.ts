import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base URL
const BASE_URL = "https://assignment-3-nine-flame.vercel.app/api";
// const BASE_URL = "http://localhost:5000/api";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: "include", }),
  tagTypes: ["Books", "BorrowRequests"],
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: () => "/books",
      providesTags: ["Books"],
    }),

    createBook: builder.mutation({
      query: (bookData) => ({
        url: "/books",
        method: "POST",
        body: bookData,
      }),
      invalidatesTags: ["Books"],
    }),

    updateBook: builder.mutation({
      query: ({ id, ...bookData }) => ({
        url: `/books/${id}`,
        method: "PATCH",
        body: bookData,
      }),
      invalidatesTags: ["Books"],
    }),

    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/books/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Books"],
    }),

    createBorrowRequest: builder.mutation({
      query: (borrowData) => ({
        url: "/borrow",
        method: "POST",
        body: borrowData,
      }),
      invalidatesTags: ["BorrowRequests", "Books"],
    }),

    getBorrowSummary: builder.query({
      query: () => "/borrow",
      providesTags: ["BorrowRequests"],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useCreateBorrowRequestMutation,
  useGetBorrowSummaryQuery,
} = apiSlice;
