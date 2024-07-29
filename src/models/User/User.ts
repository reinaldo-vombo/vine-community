import { ICommunity } from "../Community/Community"
import { IThread } from "../Thread/Thread"

export interface IUser {
  id: string
  username: string
  name: string
  image: string
  bio: string
  threads: IThread[]
  onboarded: boolean
  communities: ICommunity[]
}
