import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { userService } from "@/application"
import UserCard from "@/presentation/components/cards/UserCard"
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

  const result = await userService.getUsers({
    userId: user.id,
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  })

  return (
    <section>
      <h1 className="head-text mb-10">Pesquisa</h1>

      <Searchbar routeType="search" />

      <div className="mt-14 flex flex-col gap-9">
        {result.users.length === 0 ? (
          <p className="no-result">Nenhum Resultado</p>
        ) : (
          <>
            {result.users.map((person) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType="User"
              />
            ))}
          </>
        )}
      </div>

      <Pagination
        path="search"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </section>
  )
}

export default Page
