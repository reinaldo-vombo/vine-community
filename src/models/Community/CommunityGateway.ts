import { SortOrder } from "mongoose"
import { ICommunity } from "./Community"

export interface CommunityGateway {
  createCommunity(
    id: string,
    name: string,
    username: string,
    image: string,
    bio: string,
    createdById: string // Change the parameter name to reflect it's an id
  ): Promise<void>

  getCommunityDetails: (id: string) => Promise<ICommunity>

  getCommunityPosts: (id: string) => Promise<ICommunity[]>

  getCommunities: ({
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc",
  }: {
    searchString?: string
    pageNumber?: number
    pageSize?: number
    sortBy?: SortOrder
  }) => Promise<{ communities: any[]; isNext: boolean }>

  addMemberToCommunity: (
    communityId: string,
    memberId: string
  ) => Promise<ICommunity>

  removeUserFromCommunity: (
    userId: string,
    communityId: string
  ) => Promise<{ success: boolean } | Error>

  updateCommunityInfo: (
    communityId: string,
    name: string,
    username: string,
    image: string
  ) => Promise<ICommunity>

  deleteCommunity: (communityId: string) => Promise<any>
}
