import { redirect } from "next/navigation"

import { communityService, userService } from "@/application"
import ThreadCard from "../cards/ThreadCard"

interface Result {
  name: string
  image: string
  id: string
  threads: {
    _id: string
    text: string
    parentId: string | null
    author: {
      name: string
      image: string
      id: string
    }
    community: {
      id: string
      name: string
      image: string
    } | null
    createdAt: string
    children: {
      author: {
        image: string
      }
    }[]
  }[]
}

interface Props {
  currentUserId: string
  accountId: string
  accountType: string
}

async function ThreadsTab({ currentUserId, accountId, accountType }: Props) {
  let result: any // TODO: Add correctly type

  if (accountType === "Community") {
    result = await communityService.getCommunityPosts(accountId)
  } else {
    result = await userService.getUserPosts(accountId)
  }

  if (!result) {
    redirect("/")
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.map(
        (
          thread: any // TODO: Add correctly type
        ) => (
          <ThreadCard
            key={thread._id}
            id={thread._id}
            currentUserId={currentUserId}
            parentId={thread.parentId}
            content={thread.text}
            author={
              accountType === "User"
                ? { name: result.name, image: result.image, id: result.id }
                : {
                    name: thread.author.name,
                    image: thread.author.image,
                    id: thread.author.id,
                  }
            }
            community={
              accountType === "Community"
                ? { name: result.name, id: result.id, image: result.image }
                : thread.community
            }
            createdAt={thread.createdAt}
            comments={thread.children}
          />
        )
      )}
    </section>
  )
}

export default ThreadsTab
