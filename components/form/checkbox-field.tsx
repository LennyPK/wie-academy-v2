import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field"
import { useFieldContext } from "."

interface CheckboxFieldProps {
  label: string
}

export default function CheckboxField({ label }: CheckboxFieldProps) {
  const field = useFieldContext<boolean>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldContent className="flex flex-row">
        <Checkbox
          id={field.name}
          name={field.name}
          checked={field.state.value}
          onCheckedChange={(checked) => field.handleChange(checked === true)}
          onBlur={field.handleBlur}
          aria-invalid={isInvalid}
        />
        <FieldLabel htmlFor={field.name} className="font-normal">
          {label}
        </FieldLabel>
      </FieldContent>

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
