import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'

import {Typography, TextField, Paper, Button, IconButton, OutlinedInput, InputLabel, InputAdornment, FormControl} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import styles from './Login.module.scss'
import { useFetchLoginMutation } from '../../store/services/PostService'
import { openAlert } from '../../store/slices/app'
import { LazyLoading } from '../../components/LazyLoading'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { ErrorResponse, LoginData } from '../../types/auth';

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [fetchLogin, {data, error, isLoading}] = useFetchLoginMutation()
  
  const dispatch = useAppDispatch()
  const isAuth = useAppSelector(state => state.auth.isAuth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    defaultValues: {
      email: '',
      password: '',
    }
  })

  async function onSubmit(values: LoginData) {
    await fetchLogin(values)
    if (!data && error) {
      const typedError = error as ErrorResponse

      if ('status' in error) {
        dispatch(openAlert(typedError.data?.[0]?.msg || typedError.data?.message || 'Unknown error'))
      } else {
        dispatch(openAlert(error.message || 'Unknown error'))
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
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          fullWidth
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          {...register('email', { required: 'Укажите почту' })}
        />
        <FormControl variant="outlined" fullWidth >
          <InputLabel htmlFor="password">Password</InputLabel>
          <OutlinedInput
            error={Boolean(errors.password?.message)} 
            helperText={errors.password?.message}
            className={styles.field}
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password', { required: 'Укажите пароль' })}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(prev => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <Button type='submit' size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
      {isLoading && <LazyLoading />}
    </Paper>
  )
}
