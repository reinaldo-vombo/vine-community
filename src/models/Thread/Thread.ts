export interface IThread {
  text: string
  author: string
  community: string
  createdAt: Date
  parentId: string
  children: IThread[]
}
