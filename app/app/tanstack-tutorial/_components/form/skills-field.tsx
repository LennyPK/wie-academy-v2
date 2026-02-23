import { withForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { FieldError, FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field"
import { Plus, Trash2 } from "lucide-react"
import { formOpts } from "."

export const SkillsField = withForm({
  ...formOpts,
  render: ({ form }) => {
    return (
      <form.AppField name="skills" mode="array">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

          return (
            <FieldSet>
              <FieldLegend>Skills</FieldLegend>
              <FieldGroup>
                {field.state.value.map((skill, index) => (
                  <FieldSet key={skill.id} className="flex flex-row items-center justify-between">
                    <form.AppField name={`skills[${index}].name`}>
                      {(subField) => {
                        return (
                          <subField.TextField
                            type="text"
                            label="Name"
                            placeholder="HTML"
                            className="text-sm"
                          />
                        )
                      }}
                    </form.AppField>

                    <form.AppField name={`skills[${index}].level`}>
                      {(subField) => {
                        return (
                          <subField.SelectField
                            label="Level"
                            placeholder="Select level"
                            options={[
                              { value: "beginner", label: "Beginner" },
                              { value: "intermediate", label: "Intermediate" },
                              { value: "expert", label: "Expert" },
                            ]}
                          />
                        )
                      }}
                    </form.AppField>

                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => field.removeValue(index)}
                      className="rounded-full"
                    >
                      <Trash2 />
                    </Button>
                  </FieldSet>
                ))}
                <Button
                  type="button"
                  className="w-full"
                  variant="outline"
                  onClick={() =>
                    field.pushValue({
                      id: crypto.randomUUID(),
                      name: ` New Skill ${field.state.value.length + 1}`,
                      level: "beginner",
                    })
                  }
                >
                  <Plus />
                  Skill
                </Button>
              </FieldGroup>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </FieldSet>
          )
        }}
      </form.AppField>
    )
  },
})
