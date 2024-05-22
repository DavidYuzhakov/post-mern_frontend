import {Typography, TextField, Paper, Button, Avatar} from '@mui/material'
import { Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'

import styles from './Login/Login.module.scss'
import { useFetchRegisterMutation } from '../store/services/PostService'
import { useRef, useState } from 'react'
import axios from '../axios'
import { openAlert } from '../store/slices/app'
import { LazyLoading } from '../components/LazyLoading'
import React from 'react'
import { ErrorResponse, SignUpData } from '../types/auth'
import { useAppSelector, useAppDispatch } from '../hooks'

export const Registration = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  const dispatch = useAppDispatch()
  const isAuth = useAppSelector((state) => state.auth.isAuth)
  const [fetchRegister, {data, error, isLoading}] = useFetchRegisterMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>({
    defaultValues: {fullName: '', email: '', password: '', avatarUrl: ''},
  })

  async function changeHandler (e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      try {
        setUploading(true)
        const formData = new FormData()
        formData.append('icon', file)
        const {data} = await axios.post('/upload/avatar', formData)
        setImageUrl(data.url)
      } catch (err) {
        console.log(err)
        dispatch(openAlert('Failed to upload the avatar'))
      } finally {
        setUploading(false)
      }
    }
  }

  async function onSubmit(values: SignUpData) {
    const updatedValues = {
      ...values,
      avatarUrl: imageUrl
    }
    await fetchRegister(updatedValues)

    if (!data && error) {
      const typedError = error as ErrorResponse

      if ('status' in error) {
        dispatch(openAlert(typedError.data?.[0].msg))
      } else {
        dispatch(openAlert(typedError.message || 'Unknown error'))
      }
    } else if ('token' in data) {
      window.localStorage.setItem('token', data.token)
    }
  }

  if (isAuth) {
    return <Navigate to={'/'} />
  }

  return (
    <Paper elevation={0} classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        {!imageUrl ? (
          <Avatar
            onClick={() => inputRef.current?.click()}
            sx={{ width: 100, height: 100 }}
          />
        ) : (
          <img 
            src={imageUrl} 
            width={100} 
            height={100} 
            style={{ 
              borderRadius: '50%', 
              border: '1px solid #ccc',
              objectFit: 'cover'
            }} 
            alt="user icon" 
          />
        )}
        <input ref={inputRef} onChange={changeHandler} type="file" hidden />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          type="text"
          {...register('fullName', { required: 'Укажите полное имя' })}
          className={styles.field}
          label="Полное имя"
          fullWidth
        />
        <TextField
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          {...register('email', { required: 'Укажите почту' })}
          className={styles.field}
          label="E-Mail"
          fullWidth
        />
        <TextField
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          type="password"
          {...register('password', { required: 'Укажите пароль' })}
          className={styles.field}
          label="Пароль"
          fullWidth
        />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Зарегистрироваться
        </Button>
      </form>
      {isLoading || uploading && <LazyLoading />}
    </Paper>
  )
}

