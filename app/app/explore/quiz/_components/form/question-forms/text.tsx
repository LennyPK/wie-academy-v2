import { withForm } from "@/components/form"
import { formOpts } from "@/explore/quiz/_components/form/options"

export const TextQuestion = withForm({
  ...formOpts,
  // props: { questionIndex: 0 },
  render: () => {
    return <></>
  },
})
