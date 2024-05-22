type DefaultFields = {
  _id: string
  createdAt: string
  updatedAt: string
  __v: number
}

export type Tags = string[]

export interface User extends DefaultFields {
  fullName: string
  email: string
  passwordHash: string
  avatarUrl?: string
}

export interface CommentItem extends DefaultFields {
  text: string
  user: User
  postId: string
}

export interface PostItem extends DefaultFields {
  title: string,
  text: string
  tags: Tags
  views: number
  user: User
  imageUrl?: string,
}

export interface UserAuth extends DefaultFields {
  fullName: string
  email: string
  avatarUrl?: string
  token: string
}
