"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useForm } from "react-hook-form"
import type { z } from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/presentation/components/ui/form"

import { Button } from "../ui/button"
import { Input } from "../ui/input"

import { threadService } from "@/application"
import { CommentValidation } from "@/lib/validations/thread"

interface Props {
  threadId: string
  currentUserImg: string
  currentUserId: string
}

function Comment({ threadId, currentUserImg, currentUserId }: Props) {
  const pathname = usePathname()

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await threadService.addCommentToThread(
      threadId,
      values.thread,
      JSON.parse(currentUserId),
      pathname
    )

    form.reset()
  }

  return (
    <Form {...form}>
      <form className="comment-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="current_user"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  {...field}
                  placeholder="Comentar..."
                  className="no-focus text-light-1 outline-none"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="comment-form_btn">
          Responder
        </Button>
      </form>
    </Form>
  )
}

export default Comment
