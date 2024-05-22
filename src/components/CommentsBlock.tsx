import React, { useEffect, useState } from 'react'

import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  List,
  Divider,
  Skeleton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { red } from '@mui/material/colors'

import { SideBlock } from './SideBlock'
import { useDeleteCommentMutation, useFetchEditCommentMutation } from '../store/services/PostService'
import axios from '../axios'
import { EditComment } from './EditComment'
import { openAlert } from '../store/slices/app'
import { LazyLoading } from './LazyLoading'
import { useAppDispatch } from '../hooks'
import { CommentItem } from '../types/api'

interface CommentsBlockProps {
  items: CommentItem[]
  children?: React.ReactNode
  isLoading: boolean
  userId?: string
}

export const CommentsBlock = ({
  items,
  children,
  isLoading = true,
  userId,
}: CommentsBlockProps) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [commentId, setCommentId] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)

  const dispatch = useAppDispatch()
  const [editComment, { isLoading: editingCommentLoad }] =
    useFetchEditCommentMutation()
  const [deleteComment, {isLoading: isLoadingDelete}] = useDeleteCommentMutation()

  async function openModal() {
    setOpen(true)
    const { data } = await axios(`/comment/${commentId}`)
    setValue(data.text)
  }

  async function deleteHandler(id: string) {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(id)
      } catch (err) {
        console.log(err)
        dispatch(openAlert('Failed to delete this comment'))
      }
    }
  }

  async function editHandler() {
    await editComment({
      id: commentId,
      body: {
        text: value,
      },
    })

    setOpen(false)
  }

  useEffect(() => {
    if (commentId) {
      openModal()
    }
  }, [commentId])
  
  return (
    <>
      <SideBlock title="Комментарии">
        <List>
          {(isLoading ? [...Array(5)] : items)?.map((obj, index) => (
            <React.Fragment key={index}>
              <ListItem onMouseEnter={() => setHoveredId(obj?._id)} onMouseLeave={() => setHoveredId(null)} alignItems="center">
                <ListItemAvatar>
                  {isLoading ? (
                    <Skeleton variant="circular" width={40} height={40} />
                  ) : (
                    <Avatar alt={obj.user?.fullName || 'user'} src={obj.user?.avatarUrl || '.'} />
                  )}
                </ListItemAvatar>
                {isLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Skeleton variant="text" height={25} width={120} />
                    <Skeleton variant="text" height={18} width={230} />
                  </div>
                ) : (
                  <>
                    <ListItemText
                      primary={obj.user?.fullName}
                      secondary={obj.text}
                    />
                    {obj.user?._id === userId && hoveredId === obj._id && (
                      <>
                        <DeleteIcon
                          onClick={() => deleteHandler(obj._id)}
                          style={{ cursor: 'pointer', marginRight: 15 }}
                          sx={{ color: red[700] }}
                        />
                        <EditIcon
                          onClick={() => setCommentId(obj._id)}
                          style={{ cursor: 'pointer' }}
                          color="disabled"
                        />
                      </>
                    )}
                  </>
                )}
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
        {children}
      </SideBlock>
      <EditComment open={open} setOpen={setOpen} value={value} setValue={setValue} isLoading={editingCommentLoad} editHandler={editHandler} />
      {isLoadingDelete && <LazyLoading />}
    </>
  )
}
