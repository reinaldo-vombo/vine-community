import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { threadService, userService } from "@/application"
import ThreadCard from "@/presentation/components/cards/ThreadCard"
import Pagination from "@/presentation/components/shared/Pagination"

async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const user = await currentUser()
  if (!user) return null

  const userInfo = await userService.getUser(user.id)
  if (!userInfo?.onboarded) redirect("/onboarding")

  const result = await threadService.getPosts(
    searchParams.page ? +searchParams.page : 1,
    30
  )

  return (
    <>
      <h1 className="head-text text-left">VC Threads</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">Nenhum threads encontrado</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path="/"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  )
}

export default Home
