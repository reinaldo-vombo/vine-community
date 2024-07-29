import { connectToDB } from "@/lib/mongoose"

import { CommunityGateway } from "@/models/Community/CommunityGateway"
import type { FilterQuery, SortOrder } from "mongoose"
import CommunitySchema from "./schemas/community.schema"
import ThreadSchema from "./schemas/thread.schema"
import UserSchema from "./schemas/user.schema"

export class HTTPTCommunityGateway implements CommunityGateway {
  async createCommunity(
    id: string,
    name: string,
    username: string,
    image: string,
    bio: string,
    createdById: string // Change the parameter name to reflect it's an id
  ) {
    try {
      connectToDB()

      // Find the user with the provided unique id
      const user = await UserSchema.findOne({ id: createdById })

      if (!user) {
        throw new Error("Utilizador não encontrado") // Handle the case if the user with the id is not found
      }

      const newCommunity = new CommunitySchema({
        id,
        name,
        username,
        image,
        bio,
        createdBy: user._id, // Use the mongoose ID of the user
      })

      const createdCommunity = await newCommunity.save()

      // Update User model
      user.communities.push(createdCommunity._id)
      await user.save()

      return createdCommunity
    } catch (error) {
      // Handle any errors
      console.error("Error creating community:", error)
      throw error
    }
  }

  async getCommunityDetails(id: string) {
    try {
      connectToDB()

      const communityDetails = await CommunitySchema.findOne({ id }).populate([
        "createdBy",
        {
          path: "members",
          model: UserSchema,
          select: "name username image _id id",
        },
      ])

      return communityDetails
    } catch (error) {
      // Handle any errors
      console.error("Error fetching community details:", error)
      throw error
    }
  }

  async getCommunityPosts(id: string) {
    try {
      connectToDB()

      const communityPosts = await CommunitySchema.findById(id).populate({
        path: "threads",
        model: ThreadSchema,
        populate: [
          {
            path: "author",
            model: UserSchema,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
          {
            path: "children",
            model: ThreadSchema,
            populate: {
              path: "author",
              model: UserSchema,
              select: "image _id", // Select the "name" and "_id" fields from the "User" model
            },
          },
        ],
      })

      return communityPosts
    } catch (error) {
      // Handle any errors
      console.error("Error fetching community posts:", error)
      throw error
    }
  }

  async getCommunities({
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
    try {
      connectToDB()

      // Calculate the number of communities to skip based on the page number and page size.
      const skipAmount = (pageNumber - 1) * pageSize

      // Create a case-insensitive regular expression for the provided search string.
      const regex = new RegExp(searchString, "i")

      // Create an initial query object to filter communities.
      const query: FilterQuery<typeof CommunitySchema> = {}

      // If the search string is not empty, add the $or operator to match either username or name fields.
      if (searchString.trim() !== "") {
        query.$or = [
          { username: { $regex: regex } },
          { name: { $regex: regex } },
        ]
      }

      // Define the sort options for the fetched communities based on createdAt field and provided sort order.
      const sortOptions = { createdAt: sortBy }

      // Create a query to fetch the communities based on the search and sort criteria.
      const communitiesQuery = CommunitySchema.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize)
        .populate("members")

      // Count the total number of communities that match the search criteria (without pagination).
      const totalCommunitiesCount = await CommunitySchema.countDocuments(query)

      const communities = await communitiesQuery.exec()

      // Check if there are more communities beyond the current page.
      const isNext = totalCommunitiesCount > skipAmount + communities.length

      return { communities, isNext }
    } catch (error) {
      console.error("Error fetching communities:", error)
      throw error
    }
  }

  async addMemberToCommunity(communityId: string, memberId: string) {
    try {
      connectToDB()

      // Find the community by its unique id
      const community = await CommunitySchema.findOne({ id: communityId })

      if (!community) {
        throw new Error("Comunidade não encontrada")
      }

      // Find the user by their unique id
      const user = await UserSchema.findOne({ id: memberId })

      if (!user) {
        throw new Error("Utilizador não encontrado")
      }

      // Check if the user is already a member of the community
      if (community.members.includes(user._id)) {
        throw new Error("Este utilizador já é um membro da comunidade")
      }

      // Add the user's _id to the members array in the community
      community.members.push(user._id)
      await community.save()

      // Add the community's _id to the communities array in the user
      user.communities.push(community._id)
      await user.save()

      return community
    } catch (error) {
      // Handle any errors
      console.error("Error adding member to community:", error)
      throw error
    }
  }

  async removeUserFromCommunity(userId: string, communityId: string) {
    try {
      connectToDB()

      const userIdObject = await UserSchema.findOne({ id: userId }, { _id: 1 })
      const communityIdObject = await CommunitySchema.findOne(
        { id: communityId },
        { _id: 1 }
      )

      if (!userIdObject) {
        throw new Error("Utilizador não encontrado")
      }

      if (!communityIdObject) {
        throw new Error("Comunidade não encontrada")
      }

      // Remove the user's _id from the members array in the community
      await CommunitySchema.updateOne(
        { _id: communityIdObject._id },
        { $pull: { members: userIdObject._id } }
      )

      // Remove the community's _id from the communities array in the user
      await UserSchema.updateOne(
        { _id: userIdObject._id },
        { $pull: { communities: communityIdObject._id } }
      )

      return { success: true }
    } catch (error) {
      // Handle any errors
      console.error("Error removing user from community:", error)
      throw error
    }
  }

  async updateCommunityInfo(
    communityId: string,
    name: string,
    username: string,
    image: string
  ) {
    try {
      connectToDB()

      // Find the community by its _id and update the information
      const updatedCommunity = await CommunitySchema.findOneAndUpdate(
        { id: communityId },
        { name, username, image }
      )

      if (!updatedCommunity) {
        throw new Error("Comunidade não encontrada")
      }

      return updatedCommunity
    } catch (error) {
      // Handle any errors
      console.error("Error updating community information:", error)
      throw error
    }
  }

  async deleteCommunity(communityId: string) {
    try {
      connectToDB()

      // Find the community by its ID and delete it
      const deletedCommunity = await CommunitySchema.findOneAndDelete({
        id: communityId,
      })

      if (!deletedCommunity) {
        throw new Error("Comunidade não encontrada")
      }

      // Delete all threads associated with the community
      await ThreadSchema.deleteMany({ community: communityId })

      // Find all users who are part of the community
      const communityUsers = await UserSchema.find({ communities: communityId })

      // Remove the community from the 'communities' array for each user
      const updateUserPromises = communityUsers.map((user) => {
        user.communities.pull(communityId)
        return user.save()
      })

      await Promise.all(updateUserPromises)

      return deletedCommunity
    } catch (error) {
      console.error("Error deleting community: ", error)
      throw error
    }
  }
}
