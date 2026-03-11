import { withForm } from "@/components/form"
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import * as z from "zod"
import { formOpts } from ".."

export const TextAnswer = withForm({
  ...formOpts,
  props: { questionIndex: 0 },
  render: ({ form, questionIndex }) => {
    return (
      <form.Field
        name={`answers[${questionIndex}].value`}
        validators={{
          onChange: z.string().min(1, "Answer is required"),
        }}
      >
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

          return (
            <Field data-invalid={isInvalid}>
              {/* <FieldLabel htmlFor={field.name}>Your Answer</FieldLabel> */}
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value as string}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.Field>
    )
  },
})
