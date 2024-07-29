export interface ThreadGateway {
  getPosts: (
    pageNumber: number,
    pageSize: number
  ) => Promise<{ posts: any[]; isNext: boolean }>

  createThread: ({
    text,
    author,
    communityId,
    path,
  }: {
    text: string
    author: string
    communityId: string | null
    path: string
  }) => Promise<void>

  getAllChildThreads: (threadId: string) => Promise<any[]>

  deleteThread: (id: string, path: string) => Promise<void>

  getThreadById: (threadId: string) => Promise<any>

  addCommentToThread: (
    threadId: string,
    commentText: string,
    userId: string,
    path: string
  ) => Promise<void>
}
