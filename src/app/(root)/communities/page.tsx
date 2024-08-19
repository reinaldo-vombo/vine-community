import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { communityService, userService } from "@/application"
import CommunityCard from "@/presentation/components/cards/CommunityCard"
import Pagination from "@/presentation/components/shared/Pagination"
import Searchbar from "@/presentation/components/shared/Searchbar"

async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const user = await currentUser()
  if (!user) return null

  const userInfo = await userService.getUser(user.id)
  if (!userInfo?.onboarded) redirect("/onboarding")

  const result = await communityService.getCommunities({
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  })

  return (
    <>
      <h1 className="head-text">Comunidades</h1>

      <div className="mt-5">
        <Searchbar routeType="communities" />
      </div>

      <section className="mt-9 flex flex-wrap gap-4">
        {result.communities.length === 0 ? (
          <p className="no-result">Nenhum Resultado</p>
        ) : (
          <>
            {result.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path="communities"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  )
}

export default Page
