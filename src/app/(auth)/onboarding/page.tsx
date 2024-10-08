import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { userService } from "@/application"
import AccountProfile from "@/presentation/components/forms/AccountProfile"

async function Page() {
  const user = await currentUser()
  if (!user) return null // to avoid typescript warnings

  const userInfo = await userService.getUser(user.id)
  if (userInfo?.onboarded) redirect("/")

  const userData = {
    id: user.id,
    objectId: userInfo?.id,
    username: (userInfo?.username || user.username) as string,
    name: userInfo ? userInfo?.name : (user.firstName ?? ""),
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user.imageUrl,
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Integração</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete o teu perfil agora, para utilizar a Vine Community.
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} btnTitle="Continuar" />
      </section>
    </main>
  )
}

export default Page
