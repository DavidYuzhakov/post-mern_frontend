import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";

import { Post } from '../components/Post';
import axios from "../axios"
import { useFetchAllCommentsQuery } from "../store/services/PostService";
import { openAlert } from "../store/slices/app";
import { useAppSelector } from "../hooks";
import { CommentItem, PostItem } from "../types/api";

export function Tags () {
  const { tag } = useParams()
  const [posts, setPosts] = useState<PostItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()
  const {data: user} = useAppSelector(state => state.auth)
  const { data: comments } = useFetchAllCommentsQuery(null);

  useEffect(() => {
    async function fetchPostsByTags () {
      try {
        setIsLoading(true)
        const { data } = await axios.get(`/tags/${tag}`)
        setPosts(data)
      } catch (err) {
        console.log(err)
        dispatch(openAlert(`Не удалось найти посты по тегу ${tag}`))
      } finally {
        setIsLoading(false)
      }
    }
    fetchPostsByTags()
  }, [tag])


  return (
    <>
      <Typography marginBottom={3} fontSize={30} fontWeight={'bold'}>#Tags</Typography>
      <Grid xs={8} item>
        {isLoading
          ? [...Array(5)].map((_, i) => <Post key={i} isLoading={true} />)
          : posts.map((post) => (
            <Post
              key={post._id}
              id={post._id}
              title={post.title}
              imageUrl={post.imageUrl ? post.imageUrl : ''}
              user={post.user}
              views={post.views}
              createdAt={post.createdAt}
              tags={post.tags}
              isEditable={post.user._id === user?._id}
              commentsCount={comments && (comments as CommentItem[]).filter(com => com.postId === post._id).length}
            />
        ))}
        {posts?.length < 1 && <p>Постов пока не имеется!</p>}
      </Grid>
    </>
  )
}