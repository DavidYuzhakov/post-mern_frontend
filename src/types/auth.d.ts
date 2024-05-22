export type LoginData = {
  email: string,
  password: string
}

export type ErrorResponse = {
  data?: {
    [key: string]: any
  }
  message?: string
  msg?: string
  status?: number
}

export type SignUpData = {
  fullName: string
  email: string
  password: string 
  avatarUrl: string
}
