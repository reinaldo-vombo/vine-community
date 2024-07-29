"use client"

import { useOrganization } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePathname, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import type * as z from "zod"

import { Button } from "@/presentation/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/presentation/components/ui/form"
import { Textarea } from "@/presentation/components/ui/textarea"

import { threadService } from "@/application"
import { ThreadValidation } from "@/lib/validations/thread"

interface Props {
  userId: string
}

function PostThread({ userId }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const { organization } = useOrganization()

  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  })

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    await threadService.createThread({
      text: values.thread,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
    })

    router.push("/")
  }

  return (
    <Form {...form}>
      <form
        className="mt-10 flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Conteúdo
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-primary-500">
          Publicar Thread
        </Button>
      </form>
    </Form>
  )
}

export default PostThread
