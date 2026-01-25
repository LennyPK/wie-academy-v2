import { RenderTipTap } from "@/components/editor/render"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Reply } from "../types"
import ForumReplyForm from "./reply-form"

interface ReplyListProps {
  userId: string
  postId: string
  postIsPrivate: boolean
  postReplies: Reply[]
}

export default function ReplyList({ userId, postId, postIsPrivate, postReplies }: ReplyListProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      {showReplyForm ? (
        <ForumReplyForm
          postId={postId}
          isPrivate={postIsPrivate}
          clearForm={() => setShowReplyForm(false)}
        />
      ) : (
        <Card onClick={() => setShowReplyForm(true)}>
          <CardContent>
            <Input disabled className="text-sm opacity-100!" placeholder="Join the conversation" />
          </CardContent>
        </Card>
      )}

      {postReplies.map((reply) => {
        const authorAvatarUrl = reply.author?.image
        const authorInitials = reply.isAnonymous
          ? "A"
          : (reply.author?.firstName?.[0] ?? "") + (reply.author?.lastName?.[0] ?? "")
        const isAuthor = reply.author?.id === userId

        const getAuthorLabel = () => {
          if (reply.isAnonymous) {
            return isAuthor ? "Anonymous (You)" : "Anonymous"
          }

          if (!reply.author) {
            return "[deleted]"
          }

          const { firstName, lastName } = reply.author

          return `${firstName} ${lastName[0]}.`
        }

        return (
          <Card key={reply.id}>
            <CardHeader className="flex flex-row items-center gap-2 text-sm">
              <Avatar className="h-10 w-10">
                {authorAvatarUrl ? (
                  <AvatarImage src={authorAvatarUrl} alt="User avatar" />
                ) : (
                  <AvatarFallback className="bg-linear-to-br from-primary to-secondary font-semibold text-foreground">
                    {authorInitials}
                  </AvatarFallback>
                )}
              </Avatar>

              {getAuthorLabel()}
            </CardHeader>
            <CardContent>
              <RenderTipTap
                content={
                  reply.contentJson ? JSON.parse(JSON.stringify(reply.contentJson)) : undefined
                }
              />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
