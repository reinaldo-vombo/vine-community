import { connectToDB } from "@/lib/mongoose"

import { ThreadGateway } from "@/models/Thread/ThreadGateway"
import { revalidatePath } from "next/cache"
import CommunitySchema from "./schemas/community.schema"
import ThreadSchema from "./schemas/thread.schema"
import UserSchema from "./schemas/user.schema"

interface Params {
  text: string
  author: string
  communityId: string | null
  path: string
}

export class HTTPTThreadGateway implements ThreadGateway {
  async getPosts(pageNumber = 1, pageSize = 20) {
    connectToDB()

    // Calculate the number of posts to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize

    // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
    const postsQuery = ThreadSchema.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "author",
        model: UserSchema,
      })
      .populate({
        path: "community",
        model: CommunitySchema,
      })
      .populate({
        path: "children", // Populate the children field
        populate: {
          path: "author", // Populate the author field within children
          model: UserSchema,
          select: "_id name parentId image", // Select only _id and username fields of the author
        },
      })

    // Count the total number of top-level posts (threads) i.e., threads that are not comments.
    const totalPostsCount = await ThreadSchema.countDocuments({
      parentId: { $in: [null, undefined] },
    }) // Get the total count of posts

    const posts = await postsQuery.exec()

    const isNext = totalPostsCount > skipAmount + posts.length

    return { posts, isNext }
  }

  async createThread({ text, author, communityId, path }: Params) {
    try {
      connectToDB()

      const communityIdObject = await CommunitySchema.findOne(
        { id: communityId },
        { _id: 1 }
      )

      const createdThread = await ThreadSchema.create({
        text,
        author,
        community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
      })

      // Update User model
      await UserSchema.findByIdAndUpdate(author, {
        $push: { threads: createdThread._id },
      })

      if (communityIdObject) {
        // Update Community model
        await CommunitySchema.findByIdAndUpdate(communityIdObject, {
          $push: { threads: createdThread._id },
        })
      }

      revalidatePath(path)
    } catch (error: any) {
      throw new Error(`Falha ao criar thread: ${error.message}`)
    }
  }

  async getAllChildThreads(threadId: string): Promise<any[]> {
    const childThreads = await ThreadSchema.find({ parentId: threadId })

    const descendantThreads = []
    for (const childThread of childThreads) {
      const descendants = await this.getAllChildThreads(childThread._id)
      descendantThreads.push(childThread, ...descendants)
    }

    return descendantThreads
  }

  async deleteThread(id: string, path: string): Promise<void> {
    try {
      connectToDB()

      // Find the thread to be deleted (the main thread)
      const mainThread =
        await ThreadSchema.findById(id).populate("author community")

      if (!mainThread) {
        throw new Error("Thread não encontrada")
      }

      // Fetch all child threads and their descendants recursively
      const descendantThreads = await this.getAllChildThreads(id)

      // Get all descendant thread IDs including the main thread ID and child thread IDs
      const descendantThreadIds = [
        id,
        ...descendantThreads.map((thread) => thread._id),
      ]

      // Extract the authorIds and communityIds to update User and Community models respectively
      const uniqueAuthorIds = new Set(
        [
          ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
          mainThread.author?._id?.toString(),
        ].filter((id) => id !== undefined)
      )

      const uniqueCommunityIds = new Set(
        [
          ...descendantThreads.map((thread) =>
            thread.community?._id?.toString()
          ), // Use optional chaining to handle possible undefined values
          mainThread.community?._id?.toString(),
        ].filter((id) => id !== undefined)
      )

      // Recursively delete child threads and their descendants
      await ThreadSchema.deleteMany({ _id: { $in: descendantThreadIds } })

      // Update User model
      await UserSchema.updateMany(
        { _id: { $in: Array.from(uniqueAuthorIds) } },
        { $pull: { threads: { $in: descendantThreadIds } } }
      )

      // Update Community model
      await CommunitySchema.updateMany(
        { _id: { $in: Array.from(uniqueCommunityIds) } },
        { $pull: { threads: { $in: descendantThreadIds } } }
      )

      revalidatePath(path)
    } catch (error: any) {
      throw new Error(`Falha ao excluir thread: ${error.message}`)
    }
  }

  async getThreadById(threadId: string) {
    connectToDB()

    try {
      const thread = await ThreadSchema.findById(threadId)
        .populate({
          path: "author",
          model: UserSchema,
          select: "_id id name image",
        }) // Populate the author field with _id and username
        .populate({
          path: "community",
          model: CommunitySchema,
          select: "_id id name image",
        }) // Populate the community field with _id and name
        .populate({
          path: "children", // Populate the children field
          populate: [
            {
              path: "author", // Populate the author field within children
              model: UserSchema,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
            {
              path: "children", // Populate the children field within children
              model: ThreadSchema, // The model of the nested children (assuming it's the same "Thread" model)
              populate: {
                path: "author", // Populate the author field within nested children
                model: UserSchema,
                select: "_id id name parentId image", // Select only _id and username fields of the author
              },
            },
          ],
        })
        .exec()

      return thread
    } catch (err) {
      console.error("Error while fetching thread:", err)
      throw new Error("Não é possivel buscar a thread")
    }
  }

  async addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string
  ) {
    connectToDB()

    try {
      // Find the original thread by its ID
      const originalThread = await ThreadSchema.findById(threadId)

      if (!originalThread) {
        throw new Error("Thread não encontrada")
      }

      // Create the new comment thread
      const commentThread = new ThreadSchema({
        text: commentText,
        author: userId,
        parentId: threadId, // Set the parentId to the original thread's ID
      })

      // Save the comment thread to the database
      const savedCommentThread = await commentThread.save()

      // Add the comment thread's ID to the original thread's children array
      originalThread.children.push(savedCommentThread._id)

      // Save the updated original thread to the database
      await originalThread.save()

      revalidatePath(path)
    } catch (err) {
      console.error("Error while adding comment:", err)
      throw new Error("Não é possivel adicionar comentário")
    }
  }
}
