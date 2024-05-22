import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Markdown from 'react-markdown'

import { Post, AddComment, CommentsBlock } from "../components/";
import axios from "../axios"
import { useFetchCommentsQuery } from "../store/services/PostService";
import { openAlert } from "../store/slices/app";
import { useAppSelector, useAppDispatch } from "../hooks";
import { PostItem, User } from "../types/api";

export const FullPost = () => {
  const { id } = useParams()
  const [data, setData] = useState<PostItem>()
  const dispatch = useAppDispatch()
  const {data: currentUser} = useAppSelector(state => state.auth)
  const {data: comments, isLoading} = useFetchCommentsQuery(id)

  const typedUser: User = currentUser

  useEffect(() => {
    axios.get(`/posts/${id}`) 
      .then(({ data }) => setData(data))
      .catch(err => {
        console.log(err)
        dispatch(openAlert('Failed to get this Post, please try again later'))
      })
  }, [])

  if (!data) {
    return <Post isLoading={true} />
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? data.imageUrl : ''}
        user={data.user}
        createdAt={data.createdAt}
        views={data.views}
        commentsCount={comments?.length ?? 0}
        tags={data.tags}
        isFullPost
      >
        <Markdown>{ data.text }</Markdown>
      </Post>
      <CommentsBlock
        items={comments}
        isLoading={isLoading}
        userId={typedUser._id}
      >
        <AddComment user={typedUser} />
      </CommentsBlock>
    </>
  );
};
