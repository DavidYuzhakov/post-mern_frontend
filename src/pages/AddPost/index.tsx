import React, { useEffect, useRef } from 'react';
import { useNavigate, Navigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {TextField, Alert, Paper, Button} from '@mui/material';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import axios from "../../axios"
import { openAlert } from '../../store/slices/app';
import { LazyLoading } from '../../components/LazyLoading';
import { useAppSelector } from '../../hooks';

export const AddPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [submiting, setSubmiting] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [uploading, setUploading] = React.useState(false)
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('')
  const [tags, setTags] = React.useState('')
  const [imageUrl, setImageUrl] = React.useState('')
  const [isImage, setIsImage] = React.useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  const isEdit = Boolean(id)
  const dispatch = useDispatch()
  const isAuth = useAppSelector(state => state.auth.isAuth)

  const isLoading = submiting || editing || uploading

  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsImage(true)
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      try {
        setUploading(true)
        const formData = new FormData()
        formData.append('image', file)
        const { data } = await axios.post('/upload', formData)
        setImageUrl(data.url)
      } catch (err) {
        dispatch(openAlert('Failed to upload this file :('))
      } finally {
        setUploading(false)
      }
    } else {
      setIsImage(false)
    }
  };

  const onClickRemoveImage = () => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      setImageUrl('')
    }
  };

  const onChange = React.useCallback((value: string) => { //useCallback необходим для этой библиотеки
    setText(value);
  }, []);

  useEffect(() => {
    if (isEdit) {
      axios.get(`/posts/${id}`)
        .then(({ data }) => {
          setEditing(true)
          setTitle(data.title)
          setText(data.text)
          setImageUrl(data.imageUrl)
          setTags(data.tags.join(','))
        })
        .catch((err) => {
          console.log(err)
          dispatch(openAlert('Failed to edit this post :('))
        })
        .finally(() => {
          setEditing(false)
        })
    }
  }, [id, isEdit])

  const options: EasyMDE.Options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,      
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        uniqueId: "text field",
        enabled: true,
        delay: 1000,
      },
      toolbar: [
        'bold',
        'italic',
        'heading',
        'code',
        'unordered-list',
        'ordered-list',
      ]
    }),
    [],
  );

  if (!isAuth) {
    return <Navigate to={'/'} />
  }
  
  const onSubmit = async () => {
    try {
      setSubmiting(true)
      const fields = {
        title,
        tags,
        text,
        imageUrl
      }
      const { data } = isEdit ? await axios.patch(`/posts/${id}`, fields) : await axios.post('/posts', fields)
      const _id = isEdit ? id : data._id

      navigate(`/posts/${_id}`)
    } catch (err: any) {
      console.log(err)
      dispatch(openAlert(err.response.data[0]?.msg ?? "Failed to publish this post :("))
    } finally {
      setSubmiting(false)
    }
  }

  return (
    <Paper elevation={0} className={styles.wrapper}>
      <Button onClick={() => inputRef.current?.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button style={{ marginLeft: '5px' }} variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={imageUrl} alt="Uploaded" />
        </>
      )}
      {!isImage && <Alert style={{ marginTop: '10px' }} severity="error">This type file is not allowed!</Alert>}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField 
        classes={{ root: styles.tags }} 
        variant="standard" 
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Example: mongoDB,express,react,node" 
        fullWidth 
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEdit ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
      {isLoading && <LazyLoading />}
    </Paper>
  );
};
