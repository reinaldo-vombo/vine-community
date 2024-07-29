import { currentUser } from "@clerk/nextjs"

import UserCard from "../cards/UserCard"

import { communityService, userService } from "@/application"

async function RightSidebar() {
  const user = await currentUser()
  if (!user) return null

  const similarMinds = await userService.getUsers({
    userId: user.id,
    pageSize: 4,
  })

  const suggestedCOmmunities = await communityService.getCommunities({
    pageSize: 4,
  })

  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">
          Comunidades Sugeridas
        </h3>

        <div className="mt-7 flex w-[350px] flex-col gap-9">
          {suggestedCOmmunities.communities.length > 0 ? (
            <>
              {suggestedCOmmunities.communities.map((community) => (
                <UserCard
                  key={community.id}
                  id={community.id}
                  name={community.name}
                  username={community.username}
                  imgUrl={community.image}
                  personType="Community"
                />
              ))}
            </>
          ) : (
            <p className="!text-base-regular text-light-3">
              Sem comunidades ainda
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Ideias Similares</h3>
        <div className="mt-7 flex w-[350px] flex-col gap-10">
          {similarMinds.users.length > 0 ? (
            <>
              {similarMinds.users.map((person) => (
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
          ) : (
            <p className="!text-base-regular text-light-3">
              Sem utilizadores ainda
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default RightSidebar
