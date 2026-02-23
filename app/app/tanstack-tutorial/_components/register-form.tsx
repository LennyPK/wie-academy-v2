"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { wait } from "@/lib/utils"
import { formOptions, revalidateLogic, useForm, useStore } from "@tanstack/react-form"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import * as z from "zod"
import { formSchema } from "./form/form-schema"

// interface RegisterForm {
//   firstName: string
//   lastName: string
//   age: number | undefined
//   email: string
//   password: string
//   confirmPassword: string
//   address: {
//     street: string
//     city: string
//     state: string
//     zipcode: string
//   }
//   skills: Array<{
//     id: string
//     name: string
//     level: "beginner" | "intermediate" | "expert"
//   }>
//   acceptTerms: boolean
// }

// const defaultValues: RegisterForm = {
const defaultValues: z.infer<typeof formSchema> = {
  firstName: "",
  lastName: "",
  age: undefined,
  // email: "",
  password: "",
  confirmPassword: "",
  // address: { street: "", city: " ", state: "", zipCode: "" },
  address: { street: "" },
  skills: [
    { name: "HTML", id: crypto.randomUUID(), level: "beginner" },
    { name: "CSS", id: crypto.randomUUID(), level: "beginner" },
    { name: "JavaScript", id: crypto.randomUUID(), level: "beginner" },
  ],
  acceptTerms: false,
}

const formOpts = formOptions({
  defaultValues,
})

export default function RegisterForm() {
  const form = useForm({
    ...formOpts,
    // listeners: {
    //   onChange: ({ formApi, fieldApi }) => {
    //     console.log(formApi, fieldApi)
    //   },
    // },
    // validators: {
    //   onChange: ({ value }) => {
    //     // if (value.firstName.length < 2) {
    //     //   return "First name must be at least 2 characters"
    //     // }
    //     return {
    //       fields: {
    //         firstName: !value.firstName ? "First name is required" : undefined,
    //         "address.street": !value.address.street ? "Street is required" : undefined,
    //         "skills[0].level":
    //           value.skills[0].level !== "expert" ? "You must be an expert" : undefined,
    //       },
    //     }
    //   },
    // },
    validators: {
      onChange: formSchema,
      onDynamic: formSchema,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "blur",
    }),
    onSubmit: ({ value, meta }) => {
      console.log(value)
      // console.log(formSchema.parse(value))
      console.log(meta)
      toast.success("Submitted")
    },
  })

  // console.log(form)

  const values = useStore(form.store, (state) => state.values)
  // const isDirty = useStore(form.store, (state) => state.isDirty)
  // const errors = useStore(form.store, (state) => state.errors)

  return (
    <div>
      {/* {errors && <FieldError errors={errors} />} */}
      {/* {errors && <p className="mb-5 text-sm text-destructive">{errors.join(", ")}</p>} */}
      {/* {JSON.stringify(errors)} */}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit({ key: "value" })
        }}
      >
        {/* <pre className="text-xs">{JSON.stringify(form.state, null, 2)}</pre> */}
        {/* <pre className="text-xs">{JSON.stringify(values, null, 2)}</pre> */}
        {/* <p className="text-xs">FirstName: {values}</p> */}
        {/* <p className="text-xs">{isDirty ? "Dirty" : "Pristine"}</p> */}

        <FieldGroup>
          <form.Field
            name="firstName"
            listeners={{
              onChange: ({ value }) => {
                if (!value) {
                  form.setFieldValue("lastName", "")
                }
              },
            }}
            // validators={{
            //   // onChangeAsyncDebounceMs: 500,
            //   // onChangeAsync: async ({ value }) => {
            //   //   await fetch("https://jsonplaceholder.typicode.com/todos/1")
            //   //   await wait(2000)
            //   //   if (value !== "John") {
            //   //     return "Your name must be John"
            //   //   }
            //   // },
            //   // onChange: ({ value }) => {
            //   //   if (value.length < 2) {
            //   //     return "First name must be at least 2 characters"
            //   //   }
            //   // },
            //   onDynamic: ({ value }) => {
            //     if (value.length < 2) {
            //       return "First name must be at least 2 characters"
            //     }
            //   },
            // }}
            // validators={{
            //   onBlur: z
            //     .string()
            //     .refine((val) => val !== "John", { error: "First name cannot be John" }),
            //   onChange: z.string().min(2, "First name should be at least 2 characters").max(50),
            // }}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: z.string().refine(
                async (value) => {
                  await wait(1000)
                  return value !== "John"
                },
                {
                  error: "First name cannot be John (async check)",
                }
              ),
            }}
          >
            {(field) => {
              // console.log(field)
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <pre className="text-xs">{JSON.stringify(field.state.meta, null, 2)}</pre>
                  <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="John"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className="text-sm"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  {/* {!field.state.meta.isValid && (
                    <p className="text-sm text-destructive" role="alert">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )} */}
                </Field>
              )
            }}
          </form.Field>

          <form.Subscribe selector={(state) => state.values.firstName}>
            {(firstName) =>
              firstName && (
                <form.Field name="lastName">
                  {(field) => {
                    // console.log(field)
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                    return (
                      <Field data-invalid={isInvalid}>
                        {/* <pre className="text-xs">{JSON.stringify(field.state.meta, null, 2)}</pre> */}
                        <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          placeholder="Smith"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          className="text-sm"
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                </form.Field>
              )
            }
          </form.Subscribe>

          <form.Field name="address.street">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Street</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="Grafton Road"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className="text-sm"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  {/* {!field.state.meta.isValid && (
                    <p className="text-sm text-destructive" role="alert">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )} */}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name="password">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    placeholder="******"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className="text-sm"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  {/* {!field.state.meta.isValid && (
                    <p className="text-sm text-destructive" role="alert">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )} */}
                </Field>
              )
            }}
          </form.Field>

          <form.Field
            name="confirmPassword"
            // validators={{
            //   onChange: ({ value, fieldApi }) => {
            //     if (value !== fieldApi.form.getFieldValue("password")) {
            //       return "Passwords do not match"
            //     }
            //     return undefined
            //   },
            //   onChangeListenTo: ["password"],
            // }}
          >
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    placeholder="******"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className="text-sm"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  {/* {!field.state.meta.isValid && (
                    <p className="text-sm text-destructive" role="alert">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )} */}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name="skills" mode="array">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <div>
                  Skills
                  <FieldGroup>
                    {field.state.value.map((skill, index) => (
                      <FieldSet
                        key={skill.id}
                        className="flex flex-row items-center justify-between"
                      >
                        <form.Field name={`skills[${index}].name`}>
                          {(subField) => {
                            const isInvalid =
                              subField.state.meta.isTouched && !subField.state.meta.isValid

                            return (
                              <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={subField.name}>Name</FieldLabel>
                                <Input
                                  id={subField.name}
                                  name={subField.name}
                                  type="text"
                                  placeholder="HTML"
                                  value={subField.state.value}
                                  onBlur={subField.handleBlur}
                                  onChange={(e) => subField.handleChange(e.target.value)}
                                  aria-invalid={isInvalid}
                                  className="text-sm"
                                />
                                {isInvalid && <FieldError errors={subField.state.meta.errors} />}
                              </Field>
                            )
                          }}
                        </form.Field>

                        <form.Field name={`skills[${index}].level`}>
                          {(subField) => {
                            const isInvalid =
                              subField.state.meta.isTouched && !subField.state.meta.isValid

                            return (
                              <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={subField.name}>Level</FieldLabel>
                                <Select
                                  name={subField.name}
                                  value={subField.state.value}
                                  onValueChange={(value) =>
                                    subField.handleChange(
                                      value as "beginner" | "intermediate" | "expert"
                                    )
                                  }
                                >
                                  <SelectTrigger onBlur={subField.handleBlur}>
                                    <SelectValue placeholder="Select level" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectItem value="beginner">Beginner</SelectItem>
                                      <SelectItem value="intermediate">Intermediate</SelectItem>
                                      <SelectItem value="expert">Expert</SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>

                                {isInvalid && <FieldError errors={subField.state.meta.errors} />}
                                {/* {!subField.state.meta.isValid && (
                                  <p className="text-sm text-destructive" role="alert">
                                    {subField.state.meta.errors.join(", ")}
                                  </p>
                                )} */}
                              </Field>
                            )
                          }}
                        </form.Field>

                        <Button
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
                </div>
              )
            }}
          </form.Field>

          <form.Field name="acceptTerms">
            {(field) => {
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
                      Accept Terms
                    </FieldLabel>
                  </FieldContent>

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          <form.Subscribe selector={(state) => state.canSubmit}>
            {(canSubmit) => (
              <Field>
                <Button type="submit" disabled={!canSubmit}>
                  Submit
                </Button>
              </Field>
            )}
          </form.Subscribe>
        </FieldGroup>
      </form>

      <pre className="text-xs">{JSON.stringify(values, null, 2)}</pre>
    </div>
  )
}
