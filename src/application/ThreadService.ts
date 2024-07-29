import { ThreadGateway } from "@/models/Thread/ThreadGateway"

export class ThreadService {
  private readonly gateway: ThreadGateway

  constructor(gateway: ThreadGateway) {
    this.gateway = gateway
  }

  getPosts(pageNumber: number, pageSize: number) {
    return this.gateway.getPosts(pageNumber, pageSize)
  }

  createThread({
    text,
    author,
    communityId,
    path,
  }: {
    text: string
    author: string
    communityId: string | null
    path: string
  }) {
    return this.gateway.createThread({ text, author, communityId, path })
  }

  getAllChildThreads(threadId: string) {
    return this.gateway.getAllChildThreads(threadId)
  }

  deleteThread(id: string, path: string) {
    return this.gateway.deleteThread(id, path)
  }

  getThreadById(threadId: string) {
    return this.gateway.getThreadById(threadId)
  }

  addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string
  ) {
    return this.gateway.addCommentToThread(threadId, commentText, userId, path)
  }
}
