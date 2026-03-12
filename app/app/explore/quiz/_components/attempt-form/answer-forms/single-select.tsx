import { withForm } from "@/components/form"
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field"
import { Toggle } from "@/components/ui/toggle"
import { formOpts } from "@/explore/quiz/_components/attempt-form/options"
import { cn } from "@/utils"
import { Check } from "lucide-react"
import * as z from "zod"

interface Option {
  id: string
  label: string
  value: string
  order: number
}

export const SingleSelectAnswer = withForm({
  ...formOpts,
  props: { questionIndex: 0, options: [] as Option[] },
  render: ({ form, questionIndex, options }) => {
    return (
      <form.Field
        name={`answers[${questionIndex}].value`}
        validators={{ onChange: z.string().min(1, "Please select an option") }}
      >
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

          return (
            <Field data-invalid={isInvalid}>
              {options
                .sort((a, b) => a.order - b.order)
                .map((option) => (
                  <FieldSet key={option.id} className="flex flex-row items-center">
                    <Toggle
                      variant="outline"
                      pressed={field.state.value === option.value}
                      onPressedChange={() => field.handleChange(option.value)}
                      className={cn(
                        "rounded-full",
                        "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                        "hover:cursor-pointer"
                      )}
                    >
                      <Check />
                    </Toggle>
                    <FieldLabel>{option.label}</FieldLabel>
                  </FieldSet>
                ))}
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.Field>
    )
  },
})
