import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { Link } from 'react-router-dom';


import styles from './Post.module.scss';
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import { useDeletePostMutation } from '../../store/services/PostService';
import { LazyLoading } from '../LazyLoading';
import { Tags, User } from '../../types/api';
import { ReactNode } from 'react';

interface PostProps {
  id?: string
  title?: string
  text?: string
  tags?: Tags
  views?: number
  user?: User
  imageUrl?: string
  commentsCount?: number
  createdAt?: string
  isFullPost?: boolean
  isLoading?: boolean
  isEditable?: boolean
  children?: ReactNode
}

export const Post = ({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  views,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
}: PostProps) => {
  const [deletePost, { isLoading: isLoadingDelete }] = useDeletePostMutation() // ассинхронная функция
  if (isLoading) {
    return <PostSkeleton />;
  }

  const onClickRemove = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      console.log(id)
      await deletePost(id)
    }
  }

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img
          className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
          src={imageUrl}
          alt={title}
        />
      )}
      <div className={styles.wrapper}>
        {user && <UserInfo avatarUrl={user.avatarUrl || ''} fullName={user.fullName} additionalText={createdAt || ''} />}
        <div className={styles.indention}>
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </h2>
          <ul className={styles.tags}>
            {tags?.filter(name => name.trim() !== "").length! > 0 && tags?.map((name) => (
              <li key={name}>
                <Link to={`/tags/${name}`}>#{name.trim()}</Link>
              </li>
            ))}
          </ul>
          {children && <div className={styles.content}>{children}</div>}
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{views}</span>
            </li>
            <li>
              <CommentIcon />
              <span>{commentsCount}</span>
            </li>
          </ul>
        </div>
      </div>
      {isLoadingDelete && <LazyLoading />}
    </div>
  );
};
