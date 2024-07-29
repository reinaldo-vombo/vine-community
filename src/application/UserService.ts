import { UserGateway } from "@/models/User/UserGateway"
import { SortOrder } from "mongoose"

export class UserService {
  private readonly gateway: UserGateway

  constructor(gateway: UserGateway) {
    this.gateway = gateway
  }

  async getUser(userId: string) {
    return this.gateway.getUser(userId)
  }

  async updateUser({
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
  }) {
    return this.gateway.updateUser({
      userId,
      bio,
      name,
      path,
      username,
      image,
    })
  }

  async getUserPosts(userId: string) {
    return this.gateway.getUserPosts(userId)
  }

  async getUsers({
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
  }) {
    return this.gateway.getUsers({
      userId,
      searchString,
      pageNumber,
      pageSize,
      sortBy,
    })
  }

  async getActivity(userId: string) {
    return this.gateway.getActivity(userId)
  }
}
