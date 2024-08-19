import { connectToDB } from "@/lib/mongoose"
import { UserGateway } from "@/models/User/UserGateway"
import type { FilterQuery, SortOrder } from "mongoose"
import { revalidatePath } from "next/cache"
import CommunitySchema from "./schemas/community.schema"
import ThreadSchema from "./schemas/thread.schema"
import UserSchema from "./schemas/user.schema"

interface Params {
  userId: string
  username: string
  name: string
  bio: string
  image: string
  path: string
}

export class HTTPUserGateway implements UserGateway {
  async getUser(userId: string) {
    try {
      connectToDB()

      return await UserSchema.findOne({ id: userId }).populate({
        path: "communities",
        model: CommunitySchema,
      })
    } catch (error: any) {
      throw new Error(`Failed to fetch user: ${error.message}`)
    }
  }

  async updateUser({
    userId,
    bio,
    name,
    path,
    username,
    image,
  }: Params): Promise<void> {
    try {
      connectToDB()

      await UserSchema.findOneAndUpdate(
        { id: userId },
        {
          username: username.toLowerCase(),
          name,
          bio,
          image,
          onboarded: true,
        },
        { upsert: true }
      )

      if (path === "/profile/edit") {
        revalidatePath(path)
      }
    } catch (error: any) {
      throw new Error(`Falha ao criar/atualizar o utilizador: ${error.message}`)
    }
  }

  async getUserPosts(userId: string) {
    try {
      connectToDB()

      // Find all threads authored by the user with the given userId
      const threads = await UserSchema.findOne({ id: userId }).populate({
        path: "threads",
        model: ThreadSchema,
        populate: [
          {
            path: "community",
            model: CommunitySchema,
            select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
          },
          {
            path: "children",
            model: ThreadSchema,
            populate: {
              path: "author",
              model: UserSchema,
              select: "name image id", // Select the "name" and "_id" fields from the "User" model
            },
          },
        ],
      })
      return threads
    } catch (error) {
      console.error("Error fetching user threads:", error)
      throw error
    }
  }

  // Almost similar to Thead (search + pagination) and Community (search + pagination)
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
    try {
      connectToDB()

      // Calculate the number of users to skip based on the page number and page size.
      const skipAmount = (pageNumber - 1) * pageSize

      // Create a case-insensitive regular expression for the provided search string.
      const regex = new RegExp(searchString, "i")

      // Create an initial query object to filter users.
      const query: FilterQuery<typeof UserSchema> = {
        id: { $ne: userId }, // Exclude the current user from the results.
      }

      // If the search string is not empty, add the $or operator to match either username or name fields.
      if (searchString.trim() !== "") {
        query.$or = [
          { username: { $regex: regex } },
          { name: { $regex: regex } },
        ]
      }

      // Define the sort options for the fetched users based on createdAt field and provided sort order.
      const sortOptions = { createdAt: sortBy }

      const usersQuery = UserSchema.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize)

      // Count the total number of users that match the search criteria (without pagination).
      const totalUsersCount = await UserSchema.countDocuments(query)

      const users = await usersQuery.exec()

      // Check if there are more users beyond the current page.
      const isNext = totalUsersCount > skipAmount + users.length

      return { users, isNext }
    } catch (error) {
      console.error("Error fetching users:", error)
      throw error
    }
  }

  async getActivity(userId: string) {
    try {
      connectToDB()

      // Find all threads created by the user
      const userThreads = await ThreadSchema.find({ author: userId })

      // Collect all the child thread ids (replies) from the 'children' field of each user thread
      const childThreadIds = userThreads.reduce((acc, userThread) => {
        return acc.concat(userThread.children)
      }, [])

      // Find and return the child threads (replies) excluding the ones created by the same user
      const replies = await ThreadSchema.find({
        _id: { $in: childThreadIds },
        author: { $ne: userId }, // Exclude threads authored by the same user
      }).populate({
        path: "author",
        model: UserSchema,
        select: "name image _id",
      })

      return replies
    } catch (error) {
      console.error("Error fetching replies: ", error)
      throw error
    }
  }
}
