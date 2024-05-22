import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const postApi = createApi({
  reducerPath: 'post/api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers => {
      headers.set('authorization', window.localStorage.getItem('token') as string)
      return headers
    })
  }),
  tagTypes: ['Post', 'Comments', 'Auth'],
  endpoints: (builder) => ({
    fetchAllPosts: builder.query({
      query: (sort) => ({
        url: '/posts',
        params: {
          sort
        }
      }),
      providesTags: ['Post']
    }),
    fetchTags: builder.query({
      query: () => '/tags',
      providesTags: ['Post']
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Post'] 
    }),
    fetchLogin: builder.mutation({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Auth']
    }),
    fetchAuthMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['Auth']
    }),
    fetchRegister: builder.mutation({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Auth']
    }),
    fetchComments: builder.query({
      query: (id) => `/comments/${id}`,
      providesTags: ['Comments']
    }),
    fetchEditComment: builder.mutation({
      query: ({ id, body }) => ({
        url: `/comments/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['Comments']
    }),
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Comments']
    }),
    createComments: builder.mutation({
      query: ({body, id}) => ({
        url: `/comments/${id}`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Comments']
    }),
    fetchAllComments: builder.query({
      query: () => '/comments',
      providesTags: ['Comments']
    })
  })
})

export const { 
  useFetchAllPostsQuery, 
  useFetchTagsQuery,
  useDeletePostMutation,
  useLazyFetchAuthMeQuery,
  useFetchLoginMutation,
  useFetchRegisterMutation,
  useFetchCommentsQuery,
  useCreateCommentsMutation,
  useFetchAllCommentsQuery,
  useFetchEditCommentMutation,
  useDeleteCommentMutation
} = postApi