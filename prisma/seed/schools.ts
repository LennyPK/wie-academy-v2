import { Prisma } from "@/lib/generated/prisma/client"

const CKAN_BASE = "https://catalogue.data.govt.nz/api/3/action/datastore_search_sql"
const RESOURCE_ID = "4b292323-9fcc-41f8-814b-3c7b19cf14b3"

interface SchoolRecord {
  Org_Name: string
  School_Id: string
}

const mapRecordToSchool = (school: SchoolRecord): Prisma.SchoolCreateInput => ({
  code: school.School_Id,
  label: school.Org_Name,
})

export const getNZSchools = async (): Promise<Prisma.SchoolCreateInput[]> => {
  const sql = `
  SELECT "Org_Name", "School_Id"
  FROM "${RESOURCE_ID}"
  ORDER BY "Org_Name" ASC`

  const url = new URL(CKAN_BASE)
  url.searchParams.set("sql", sql)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`CKAN error ${res.status}`)

  const json = await res.json()
  const records: SchoolRecord[] = json?.result?.records ?? []

  const schools = records.map(mapRecordToSchool)

  return schools
}
