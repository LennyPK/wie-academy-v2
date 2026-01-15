"use client"

import RichTextEditor from "@/components/editor/rich-text-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { getPostCategories } from "@/lib/database"
import { Category } from "@/lib/types"
import { useForm } from "@tanstack/react-form"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { insertPost } from "../actions"
import { NewPost, Post } from "../types"
import { formSchema } from "./form-schema"

interface ForumFormProps {
  post?: Post | null
  // setOpen: (open: boolean) => void
}

export default function ForumForm({ post }: ForumFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const openPost = (postId: string) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set("postId", postId)
    params.delete("mode")

    router.push(`?${params.toString()}`)
  }

  const closeForm = () => {
    const params = new URLSearchParams(searchParams.toString())

    params.delete("mode")

    router.push(`?${params.toString()}`)
  }

  const [editorContent, setEditorContent] = useState({
    plain: post?.contentPlain ?? "",
    html: post?.contentHtml ?? "",
    json: post?.contentJson ?? {},
  })

  const initialValues = {
    title: post?.title ?? "",
    content: post?.contentPlain ?? "",
    isAnonymous: post?.isAnonymous ?? false,
    isPrivate: post?.isPrivate ?? false,
    category: post?.categoryId ? String(post.category.id) : "",
  }

  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      toast.loading("Saving...")

      const postPayload: NewPost = {
        id: post?.id ?? "",
        title: value.title.trim(),
        contentPlain: editorContent.plain.trim(),
        contentHtml: editorContent.html,
        contentJson: JSON.parse(JSON.stringify(editorContent.json)),
        isAnonymous: value.isAnonymous,
        isPrivate: value.isPrivate,
        categoryId: Number(value.category),
      }

      const newPost = await insertPost(postPayload)
      toast.dismiss()
      toast.success(`New post saved: ${newPost.title}`)

      setIsLoading(false)

      openPost(newPost.id)
    },
  })

  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    async function loadData() {
      const [categories] = await Promise.all([getPostCategories()])
      setCategories(categories)
    }
    loadData()
  }, [])

  return (
    <Card>
      <CardContent>
        <form
          id="post-form"
          className="space-y-6 px-4 py-4 sm:px-1"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field name="title">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="Title"
                      variant="heading"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="category">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger
                        id={field.name}
                        aria-invalid={isInvalid}
                        className="cursor-pointer"
                      >
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={String(category.id)}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>

            <FieldGroup className="grid grid-cols-2">
              {/* <FieldGroup className="grid grid-cols-2 gap-x-10"> */}
              <form.Field name="isAnonymous" validators={{ onChangeListenTo: ["isPrivate"] }}>
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  const isPrivate = form.state.values.isPrivate

                  return (
                    <Field
                      orientation="horizontal"
                      data-invalid={isInvalid}
                      className="has-[>[data-slot=field-content]]:items-center"
                    >
                      <FieldContent>
                        <FieldLabel>Anonymous</FieldLabel>
                        <FieldDescription>Hide your name from other students</FieldDescription>
                      </FieldContent>

                      <Switch
                        id={field.name}
                        name={field.name}
                        checked={field.state.value}
                        onCheckedChange={(checked) => field.handleChange(checked === true)}
                        disabled={isPrivate}
                        aria-invalid={isInvalid}
                      />
                    </Field>
                  )
                }}
              </form.Field>

              <form.Field name="isPrivate" validators={{ onChangeListenTo: ["isAnonymous"] }}>
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  const isAnonymous = form.state.values.isAnonymous

                  return (
                    <Field
                      orientation="horizontal"
                      data-invalid={isInvalid}
                      className="has-[>[data-slot=field-content]]:items-center"
                    >
                      <FieldContent>
                        <FieldLabel>Private</FieldLabel>
                        <FieldDescription>Thread is visible to you and staff only</FieldDescription>
                      </FieldContent>

                      <Switch
                        id={field.name}
                        name={field.name}
                        checked={field.state.value}
                        onCheckedChange={(checked) => field.handleChange(checked === true)}
                        disabled={isAnonymous}
                        aria-invalid={isInvalid}
                      />
                    </Field>
                  )
                }}
              </form.Field>
            </FieldGroup>

            <form.Field name="content">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field>
                    <div className="group" data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="group-data-[invalid=true]:text-destructive"
                      >
                        Content
                      </FieldLabel>
                    </div>
                    <RichTextEditor
                      placeholder="Type here..."
                      initialContent={
                        post?.contentJson
                          ? JSON.parse(JSON.stringify(post?.contentJson))
                          : undefined
                      }
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

            <Field>
              <div className="grid grid-rows-2 gap-5 sm:grid-cols-2 sm:grid-rows-none">
                <Button type="button" variant="outline" className="flex-1" onClick={closeForm}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 cursor-pointer" disabled={isLoading}>
                  Submit
                </Button>
              </div>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
