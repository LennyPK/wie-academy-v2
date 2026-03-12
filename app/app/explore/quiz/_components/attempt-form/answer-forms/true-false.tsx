import { withForm } from "@/components/form"
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Toggle } from "@/components/ui/toggle"
import { formOpts } from "@/explore/quiz/_components/attempt-form/options"
import { cn } from "@/utils"
import { Check } from "lucide-react"
import * as z from "zod"

export const TrueFalseAnswer = withForm({
  ...formOpts,
  props: { questionIndex: 0, trueLabel: "", falseLabel: "" },
  render: ({ form, questionIndex, trueLabel, falseLabel }) => {
    return (
      <form.Field
        name={`answers[${questionIndex}].value`}
        validators={{
          onChange: z
            .boolean()
            .nullable()
            .refine((val) => val !== null, { message: "Please select an option" }),
        }}
      >
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

          return (
            <Field data-invalid={isInvalid}>
              <FieldGroup>
                <FieldSet className="flex flex-row items-center">
                  <Toggle
                    variant="outline"
                    pressed={field.state.value === true}
                    onPressedChange={() => field.handleChange(true)}
                    className={cn(
                      "rounded-full",
                      "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                      "hover:cursor-pointer"
                    )}
                  >
                    <Check />
                  </Toggle>
                  <FieldLabel>{trueLabel}</FieldLabel>
                </FieldSet>

                <FieldSet className="flex flex-row items-center">
                  <Toggle
                    variant="outline"
                    pressed={field.state.value === false}
                    onPressedChange={() => field.handleChange(false)}
                    className={cn(
                      "rounded-full",
                      "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                      "hover:cursor-pointer"
                    )}
                  >
                    <Check />
                  </Toggle>
                  <FieldLabel>{falseLabel}</FieldLabel>
                </FieldSet>
              </FieldGroup>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.Field>
    )
  },
})
