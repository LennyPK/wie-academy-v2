import { withForm } from "@/components/form"
import { FieldLegend, FieldSet } from "@/components/ui/field"
import { formOpts } from "."

export const AddressField = withForm({
  ...formOpts,
  render: ({ form }) => {
    return (
      <FieldSet>
        <FieldLegend>Address</FieldLegend>

        <form.AppField name="address.street">
          {(field) => {
            return (
              <field.TextField
                type="text"
                label="Street"
                placeholder="Grafton Road"
                className="text-sm"
              />
            )
          }}
        </form.AppField>

        <form.AppField name="address.city">
          {(field) => {
            return (
              <field.TextField
                type="text"
                label="City"
                placeholder="Auckland"
                className="text-sm"
              />
            )
          }}
        </form.AppField>

        <form.AppField name="address.state">
          {(field) => {
            return (
              <field.TextField
                type="text"
                label="State"
                placeholder="Auckland"
                className="text-sm"
              />
            )
          }}
        </form.AppField>

        <form.AppField name="address.zipCode">
          {(field) => {
            return (
              <field.TextField
                type="text"
                label="Zip Code"
                placeholder="1010"
                className="text-sm"
              />
            )
          }}
        </form.AppField>
      </FieldSet>
    )
  },
})
