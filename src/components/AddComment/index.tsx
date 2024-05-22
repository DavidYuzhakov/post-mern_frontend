import {TextField, Avatar, Button} from "@mui/material";
import { useParams } from "react-router-dom"

import styles from "./AddComment.module.scss";
import { useCreateCommentsMutation } from "../../store/services/PostService";
import { clearComValue, updateComValue } from "../../store/slices/app";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { User } from "../../types/api";

interface AddCommentProps {
  user: User
}

export const AddComment = ({ user }: AddCommentProps) => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const value = useAppSelector(state => state.app.commentValue)
  const [createComment, {isLoading}] = useCreateCommentsMutation()

  async function submitHandler (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const body = {
      text: value
    }
    await createComment({ body, id })
    dispatch(clearComValue())
  }

  return (
    <form onSubmit={submitHandler}>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={user?.avatarUrl || './noavatar.png'}
          alt={user?.fullName}
        />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
            value={value}
            onChange={e => dispatch(updateComValue(e.target.value))}
          />
          <Button disabled={isLoading} type="submit" variant="contained">Отправить</Button>
        </div>
      </div>
    </form>
  );
};
