"use client"

import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup } from "@/components/ui/field"
import { wait } from "@/lib/utils"
import { revalidateLogic } from "@tanstack/react-form"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { formOpts } from "."
import { formSchema } from "./form-schema"
import { QuestionsField } from "./questions-field"

export default function QuizForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const closeForm = () => {
    router.back()
  }

  // const initialValues = {
  //   title: "",
  //   description: "",
  //   questions: [
  //     {
  //       title: "",
  //       type: FormQuestionType.SINGLE_SELECT,
  //       correctOptionValue: "",
  //       options: [
  //         { label: "", value: "", isCorrect: false },
  //         { label: "", value: "", isCorrect: false },
  //       ],
  //     },
  //     {
  //       title: "",
  //       type: FormQuestionType.SINGLE_SELECT,
  //       correctOptionValue: "",
  //       options: [
  //         { label: "", value: "", isCorrect: false },
  //         { label: "", value: "", isCorrect: false },
  //       ],
  //     },
  //   ],
  // }

  const form = useAppForm({
    ...formOpts,
    validators: {
      onDynamic: formSchema,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      console.log(value)
      await wait(2000)
      setIsLoading(false)
    },
  })

  // const values = useStore(form.store, (state) => state.values)
  // const errors = useStore(form.store, (state) => state.errors)

  return (
    <form
      className="space-y-6 py-4"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      {/* <pre className="text-xs">{JSON.stringify(values, null, 2)}</pre> */}
      {/* <pre className="text-xs text-destructive">{JSON.stringify(errors, null, 2)}</pre> */}

      {/* Title and Description card */}
      <Card>
        <CardContent>
          <FieldGroup>
            <form.AppField name="title">
              {(field) => {
                return (
                  <field.TextField label="Title" variant="heading" placeholder="Enter quiz title" />
                )
              }}
            </form.AppField>

            <form.AppField name="description">
              {(field) => {
                return (
                  <field.TextField
                    label="Description"
                    placeholder="Add a description for this quiz"
                  />
                )
              }}
            </form.AppField>
          </FieldGroup>
        </CardContent>
      </Card>

      <h1 className="mx-2 text-3xl font-bold text-foreground">Questions</h1>

      {/* Questions Array */}
      <QuestionsField form={form} />

      <Field>
        <div className="grid grid-rows-2 gap-4 sm:grid-cols-2">
          <Button type="button" variant="outline" className="flex-1" onClick={closeForm}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={isLoading}>
            Submit
          </Button>
        </div>
      </Field>
    </form>
  )
}
