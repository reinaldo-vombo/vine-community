import { IThread } from "../Thread/Thread"
import { IUser } from "../User/User"

export interface ICommunity {
  id: string
  username: string
  name: string
  image: string
  bio: string
  createdBy: any
  threads: IThread[]
  members: IUser[]
}
