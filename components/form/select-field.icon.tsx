import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LucideIcon } from "lucide-react"
import { useFieldContext } from "."

interface SelectOption {
  value: string
  label: string
  icon: LucideIcon
}

interface SelectIconFieldProps {
  label: string
  options: SelectOption[]
  placeholder?: string
  onValueChange?: (value: string) => void
}

export default function SelectIconField({
  label,
  options,
  placeholder,
  onValueChange,
}: SelectIconFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Select
        name={field.name}
        value={field.state.value}
        onValueChange={(value) => {
          field.handleChange(value)
          // Call the optional callback after the field is updated
          // so any downstream reads via form.getFieldValue see the new value.
          onValueChange?.(value)
        }}
      >
        <SelectTrigger id={field.name} onBlur={field.handleBlur} aria-invalid={isInvalid}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => {
            const Icon = option.icon
            return (
              <SelectItem
                key={option.value}
                value={option.value}
                className="flex items-center gap-2"
              >
                <Icon />
                <span>{option.label}</span>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
