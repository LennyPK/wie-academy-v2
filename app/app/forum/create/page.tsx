import BackButton from "@/components/back-button"
import ForumForm from "../_components/form"

export default async function ForumPostCreatePage() {
  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <BackButton />
        <ForumForm />
      </main>
    </div>
  )
}
