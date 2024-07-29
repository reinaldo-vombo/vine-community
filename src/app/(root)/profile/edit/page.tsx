import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { userService } from "@/application"
import AccountProfile from "@/presentation/components/forms/AccountProfile"

// Copy paste most of the code as it is from the /onboarding

async function Page() {
  const user = await currentUser()
  if (!user) return null

  const userInfo = await userService.getUser(user.id)
  if (!userInfo?.onboarded) redirect("/onboarding")

  const userData = {
    id: user.id,
    objectId: userInfo?.id,
    username: (userInfo?.username || user.username) as string,
    name: userInfo ? userInfo?.name : (user.firstName ?? ""),
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user.imageUrl,
  }

  return (
    <>
      <h1 className="head-text">Editar Perfil</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Faça qualquer alteração
      </p>

      <section className="mt-12">
        <AccountProfile user={userData} btnTitle="Continuar" />
      </section>
    </>
  )
}

export default Page
