import { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import { Link } from 'react-router-dom'

import styles from './Header.module.scss'
import { logout } from '../../store/slices/auth'
import {
  Hidden,
  Button,
  Container,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../hooks'

export const Header = () => {
  const dispatch = useAppDispatch()
  const isAuth = useAppSelector((state) => state.auth.isAuth)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const onClickLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      window.localStorage.removeItem('token')
      dispatch(logout())
    }
  }

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <div className={styles.root}>
    <Container maxWidth="lg">
      <div className={styles.inner}>
        <Link to={'/'} className={styles.logo}>
          <div>POST MERN</div>
        </Link>
        <div className={styles.buttons}>
          <Hidden smDown>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained">Написать статью</Button>
                </Link>
                <Button
                  onClick={onClickLogout}
                  variant="contained"
                  color="error"
                >
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </Hidden>
          <Hidden smUp>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              PaperProps={{ style: { boxShadow: '0 0 10px -5px black' } }}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {isAuth ? (
                <>
                  <MenuItem
                    onClick={handleMenuClose}
                    style={{ borderBottom: '1px solid #ccc' }}
                  >
                    <Link
                      className={styles.menuLink}
                      to="/add-post"
                    >
                      Написать статью
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={onClickLogout}>Выйти</MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={handleMenuClose} style={{ borderBottom: '1px solid #ccc' }}>
                    <Link className={styles.menuLink} to="/login">Войти</Link>
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose} >
                    <Link className={styles.menuLink} to="/register">Создать аккаунт</Link>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Hidden>
        </div>
      </div>
    </Container>
  </div>
  )
}
