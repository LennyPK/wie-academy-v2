import BackButton from "@/components/back-button"
import AnnouncementForm from "../_components/form"

export default async function AnnouncementCreatePage() {
  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <BackButton label="Announcements" />
        <AnnouncementForm />
      </main>
    </div>
  )
}
