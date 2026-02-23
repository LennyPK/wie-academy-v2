import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { lazy } from "react"

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

const TextField = lazy(() => import("@/components/form/text-field"))
const SelectField = lazy(() => import("@/components/form/select-field"))
const SelectIconField = lazy(() => import("@/components/form/select-field.icon"))
const CheckboxField = lazy(() => import("@/components/form/checkbox-field"))
const SubmitButton = lazy(() => import("@/components/form/submit-button"))

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    CheckboxField,
    SelectField,
    SelectIconField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
})
