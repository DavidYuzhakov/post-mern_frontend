import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Box, Input, Tabs, Tab, Grid } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { CommentsBlock, Post, TagsBlock } from '../components'

import {
  useFetchAllCommentsQuery,
  useFetchAllPostsQuery,
  useFetchTagsQuery,
} from '../store/services/PostService'
import { changeSearchValue, clearSearchValue, openAlert } from '../store/slices/app'
import { useAppSelector, useDebounce } from '../hooks'
import { CommentItem, PostItem, Tags } from '../types/api'

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sort, setSort] = useState(searchParams.get('sort') || 'new')
  const [value, setValue] = useState(sort === 'popular' ? 1 : 0)

  const searchValue = useAppSelector((state) => state.app.searchValue)
  const debounced = useDebounce(searchValue)
  
  const dispatch = useDispatch()
  const {isAuth, data: user} = useAppSelector(state => state.auth)

  const { data: comments, isLoading: isLoadingComments } = useFetchAllCommentsQuery(null)
  const { data: tags, isLoading: isLoadingTags } = useFetchTagsQuery(null)
  const {
    data: posts,
    isLoading: isLoadingPosts,
    isError,
  } = useFetchAllPostsQuery(sort, {
    refetchOnMountOrArgChange: true,
  })

  const commentsArr: CommentItem[] = comments
  const postsArr: PostItem[] = posts
  const tagsArr: Tags = tags
  
  useEffect(() => {
    setSearchParams({
      sort: sort,
    })
  }, [sort])

  function changeHandler(_: any, v: number) {
    setValue(v)
    setSort(v === 0 ? 'new' : 'popular')
  }

  if (isError) {
    dispatch(openAlert('Failed to get all post :('))
  }

  const skeletonsPosts = [...Array(5)].map((_, i) => (
    <Post key={i} isLoading={true} />
  ))
  const resultPosts = postsArr
    ?.filter((post) =>
      post.title.toLowerCase().includes(debounced.toLowerCase())
    )
    .map((post) => (
      <Post
        {...post}
        key={post._id}
        id={post._id}
        imageUrl={post.imageUrl ? post.imageUrl : ''}
        commentsCount={
          commentsArr && commentsArr.filter((com) => com.postId === post._id).length
        }
        isEditable={post.user._id === user?._id && isAuth}
      />
    ))

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          marginBottom: 3
        }}
      >
        <Tabs
          style={{ marginBottom: 15 }}
          value={value}
          onChange={changeHandler}
          aria-label="basic tabs example"
        >
          <Tab label="Новые" />
          <Tab label="Популярные" />
        </Tabs>
        <div style={{ position: 'relative' }}>
          <Input
            value={searchValue}
            onChange={(e) => dispatch(changeSearchValue(e.target.value))}
            placeholder="Enter to search post"
            style={{ paddingRight: 13 }}
          />
          {searchValue.length > 0 && (
            <span
              onClick={() => dispatch(clearSearchValue())}
              style={{
                position: 'absolute',
                top: 1 / 2,
                right: 0,
                cursor: 'pointer',
              }}
            >
              &times;
            </span>
          )}
        </div>
      </Box>
      <Grid container spacing={4}>
        <Grid xs={12} md={8} item>
          {isLoadingPosts ? skeletonsPosts : resultPosts}
          {posts?.length < 1 && <p>Постов пока не имеется!</p>}
          {resultPosts?.length < 1 && <p>Посты не найдены</p>}
        </Grid>
        <Grid md={4} xs={12} item>
          <TagsBlock items={tagsArr?.filter(tag => tag.trim() !== '')} isLoading={isLoadingTags} />
          <CommentsBlock items={commentsArr} isLoading={isLoadingComments} />
        </Grid>
      </Grid>
    </>
  )
}
