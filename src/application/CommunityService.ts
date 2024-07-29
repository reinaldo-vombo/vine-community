import { CommunityGateway } from "@/models/Community/CommunityGateway"
import { SortOrder } from "mongoose"

export class CommunityService {
  private readonly gateway: CommunityGateway

  constructor(gateway: CommunityGateway) {
    this.gateway = gateway
  }

  async createCommunity(
    id: string,
    name: string,
    username: string,
    image: string,
    bio: string,
    createdById: string // Change the parameter name to reflect it's an id
  ) {
    return this.gateway.createCommunity(
      id,
      name,
      username,
      image,
      bio,
      createdById
    )
  }

  async getCommunityDetails(id: string) {
    return this.gateway.getCommunityDetails(id)
  }

  async getCommunityPosts(id: string) {
    return this.gateway.getCommunityPosts(id)
  }

  getCommunities({
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc",
  }: {
    searchString?: string
    pageNumber?: number
    pageSize?: number
    sortBy?: SortOrder
  }) {
    return this.gateway.getCommunities({
      searchString,
      pageNumber,
      pageSize,
      sortBy,
    })
  }

  addMemberToCommunity(communityId: string, memberId: string) {
    return this.gateway.addMemberToCommunity(communityId, memberId)
  }

  removeUserFromCommunity(userId: string, communityId: string) {
    return this.gateway.removeUserFromCommunity(userId, communityId)
  }

  updateCommunityInfo(
    communityId: string,
    name: string,
    username: string,
    image: string
  ) {
    return this.gateway.updateCommunityInfo(communityId, name, username, image)
  }

  deleteCommunity(communityId: string) {
    return this.gateway.deleteCommunity(communityId)
  }
}
