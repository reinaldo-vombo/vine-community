import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { userService } from "@/application"
import PostThread from "@/presentation/components/forms/PostThread"

async function Page() {
  const user = await currentUser()
  if (!user) return null

  // fetch organization list created by user
  const userInfo = await userService.getUser(user.id)
  if (!userInfo?.onboarded) redirect("/onboarding")

  return (
    <>
      <h1 className="head-text">Criar Threads</h1>

      <PostThread userId={userInfo.id} />
    </>
  )
}

export default Page
