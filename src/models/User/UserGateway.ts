import { SortOrder } from "mongoose"
import { IThread } from "../Thread/Thread"
import { IUser } from "./User"

export interface UserGateway {
  getUser: (userId: string) => Promise<IUser>

  updateUser: ({
    userId,
    bio,
    name,
    path,
    username,
    image,
  }: {
    userId: string
    username: string
    name: string
    bio: string
    image: string
    path: string
  }) => Promise<void>

  getUserPosts: (userId: string) => Promise<IThread[]>

  getUsers: ({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc",
  }: {
    userId: string
    searchString?: string
    pageNumber?: number
    pageSize?: number
    sortBy?: SortOrder
  }) => Promise<{ users: IUser[]; isNext: boolean }>

  getActivity: (userId: string) => Promise<any[]>
}
