"use client"

import RichTextEditor from "@/components/editor/rich-text-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { useForm } from "@tanstack/react-form"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { insertReply } from "../actions"
import { NewReply } from "../types"
import { replyFormSchema } from "./reply-form-schema"

interface ForumReplyFormProps {
  postId: string
  isPrivate: boolean
  clearForm: () => void
}

export default function ForumReplyForm({ postId, isPrivate, clearForm }: ForumReplyFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [editorContent, setEditorContent] = useState({
    plain: "",
    html: "",
    json: {},
  })

  const initialValues = {
    content: "",
    isAnonymous: false,
  }

  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: replyFormSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      toast.loading("Posting reply...")

      const replyPayload: NewReply = {
        id: "",
        postId: postId,
        contentPlain: editorContent.plain.trim(),
        contentHtml: editorContent.html,
        contentJson: JSON.parse(JSON.stringify(editorContent.json)),
        isAnonymous: value.isAnonymous,
      }

      const newReply = await insertReply(replyPayload)

      if (!newReply) {
        toast.dismiss()
        toast.error("Failed to post reply. Please try again.")
        setIsLoading(false)
        return
      }

      toast.dismiss()
      toast.success("Reply posted")

      setIsLoading(false)
      clearForm()
      router.refresh()
    },
  })

  return (
    <Card>
      <CardContent>
        <form
          id="reply-form"
          // className="space-y-6 px-1 py-4"
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <form.Field name="content">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field>
                  <div className="group" data-invalid={isInvalid}>
                    {/* <FieldLabel
                      htmlFor={field.name}
                      className="group-data-[invalid=true]:text-destructive"
                    >
                      Content
                    </FieldLabel> */}
                  </div>
                  <RichTextEditor
                    // key={editorKey}
                    placeholder="Join the conversation"
                    // initialContent={
                    //   post?.contentJson ? JSON.parse(JSON.stringify(post?.contentJson)) : undefined
                    // }
                    initialContent={undefined}
                    className="small-editor"
                    onChangeHTML={(html) => setEditorContent((prev) => ({ ...prev, html }))}
                    onChangeJSON={(json) => setEditorContent((prev) => ({ ...prev, json }))}
                    onChangePlainText={(plain) => {
                      setEditorContent((prev) => ({ ...prev, plain }))
                      field.handleChange(plain)
                    }}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name="isAnonymous">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field
                  orientation="horizontal"
                  data-invalid={isInvalid}
                  className="flex flex-col has-[>[data-slot=field-content]]:items-start"
                >
                  <FieldContent className="flex w-full flex-row justify-between gap-5">
                    <FieldLabel>Post Anonymously</FieldLabel>
                    <Switch
                      id={field.name}
                      name={field.name}
                      checked={field.state.value}
                      onCheckedChange={(checked) => field.handleChange(checked === true)}
                      disabled={isPrivate}
                      aria-invalid={isInvalid}
                    />
                  </FieldContent>

                  {isPrivate && (
                    <FieldDescription>
                      Anonymous posting is disabled for private threads.
                    </FieldDescription>
                  )}
                </Field>
              )
            }}
          </form.Field>

          <Field>
            <div className="grid grid-rows-2 gap-5 sm:grid-cols-2 sm:grid-rows-none">
              <Button type="button" variant="outline" className="flex-1" onClick={clearForm}>
                Clear
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                Submit
              </Button>
            </div>
          </Field>
        </form>
      </CardContent>
    </Card>
  )
}
