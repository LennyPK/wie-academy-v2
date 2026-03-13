import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { useFormContext } from "."

export default function SubmitButton({ label }: { label: string }) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.canSubmit}>
      {(canSubmit) => (
        <Field>
          <Button type="submit" disabled={!canSubmit}>
            {label}
          </Button>
        </Field>
      )}
    </form.Subscribe>
  )
}
